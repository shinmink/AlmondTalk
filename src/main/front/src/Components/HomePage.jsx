import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical, BsEmojiSmile, BsMicFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import Profile from "./Profile/Profile";
import CreateGroup from "./Group/CreateGroup";
import EditGroup from "./Group/EditGroup";
import InviteFriends from "./Group/InviteFriends"; // InviteFriends 컴포넌트 추가
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat, updateChat, deleteChat, inviteUserToGroup } from "../Redux/Chat/Action"; // inviteUserToGroup 액션 추가
import { createMessage, getAllMessages } from "../Redux/Message/Action";
import "./HomePage.css";

function HomePage() {
    const [querys, setQuerys] = useState(""); // 검색어 상태
    const [currentChat, setCurrentChat] = useState(null); // 현재 선택된 채팅 상태
    const [content, setContent] = useState(""); // 메시지 내용 상태
    const [isProfile, setIsProfile] = useState(false); // 프로필 보기 상태
    const [isGroup, setIsGroup] = useState(false); // 그룹 생성 상태
    const [isEditGroup, setIsEditGroup] = useState(false); // 그룹 수정 상태
    const [isInviteMode, setInviteMode] = useState(false); // 초대 모드 상태
    const [anchorEl, setAnchorEl] = useState(null); // 메뉴 앵커 상태
    const isMenuOpen = Boolean(anchorEl); // 메뉴 열림 상태
    const [client, setClient] = useState(null); // STOMP 클라이언트 상태
    const [isConnected, setIsConnected] = useState(false); // 클라이언트 연결 상태
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [lastMessages, setLastMessages] = useState({}); // 마지막 메시지 상태
    const [lastReadTimestamps, setLastReadTimestamps] = useState({}); // 마지막 읽은 메시지의 타임스탬프 상태
    const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState(null); // 채팅방 메뉴 앵커 상태
    const [chats, setChats] = useState([]); // 채팅 목록 상태
    const subscribedChatsRef = useRef(new Set()); // 구독된 채팅방 ID를 저장하는 Set

    const messagesEndRef = useRef(null); // 스크롤을 위한 useRef

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, chat, message } = useSelector((store) => store);
    const searchUsers = useSelector((store) => store.auth.searchUsers) || []; // 검색된 사용자 상태
    const token = localStorage.getItem("token"); // 토큰 가져오기

    // 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // STOMP 클라이언트 연결 함수
    const connect = () => {
        const socket = new SockJS("http://localhost:8081/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            debug: (str) => console.log(str),
            onConnect: () => {
                setIsConnected(true);
                subscribeToAllChats(stompClient); // 모든 채팅방 구독
                // 새로운 채팅방 생성 구독
                stompClient.subscribe("/topic/chats/new", (message) => {
                    const newChat = JSON.parse(message.body);
                    setChats((prevChats) => [...prevChats, newChat]);
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error("Broker reported error:", frame.headers["message"]);
                console.error("Additional details:", frame.body);
            },
        });

        stompClient.activate();
        setClient(stompClient);
    };

    // 모든 채팅방 구독 함수 선언 추가
    const subscribeToAllChats = (stompClient) => {
        chat.chats.forEach((chat) => {
            if (!subscribedChatsRef.current.has(chat.id)) { // 중복 구독 방지
                subscribeToChat(stompClient, chat.id);
                subscribedChatsRef.current.add(chat.id); // 구독된 채팅방 ID 추가
            }
        });
    };

    // 마지막 메시지 및 읽은 타임스탬프 업데이트 함수
    const updateLastMessages = (chatId, message) => {
        setLastMessages((prevLastMessages) => ({
            ...prevLastMessages,
            [chatId]: message,
        }));
    };

    // 채팅 구독 함수
    const subscribeToChat = (stompClient, chatId) => {
        stompClient.subscribe(`/group/${chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            updateLastMessages(chatId, receivedMessage); // 마지막 메시지 업데이트 함수 호출
        });

        // 채팅방 수정 구독
        stompClient.subscribe(`/topic/chat/${chatId}/update`, (message) => {
            const updatedChat = JSON.parse(message.body);
            setChats((prevChats) => prevChats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
            if (updatedChat.id === currentChat?.id) {
                setCurrentChat((prevChat) => ({
                    ...prevChat,
                    chatName: updatedChat.chatName,
                    chatImage: updatedChat.chatImage,
                    users: updatedChat.users // 유저 리스트 업데이트
                }));
            }
        });

        // 채팅방 삭제 구독
        stompClient.subscribe(`/topic/chat/${chatId}/delete`, (message) => {
            const deletedChatId = JSON.parse(message.body);
            if (deletedChatId === currentChat?.id) {
                setCurrentChat(null); // 현재 채팅방이 삭제된 경우
                alert("채팅방이 삭제되었습니다.");
            }
            // 삭제된 채팅방에 대한 추가 처리
            setChats((prevChats) => prevChats.filter(chat => chat.id !== deletedChatId));
        });
    };

    // 쿠키 가져오는 함수
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    useEffect(() => {
        connect();
    }, []);

    // 채팅방 삭제 및 수정 이벤트 구독을 위해 useEffect
    useEffect(() => {
        if (isConnected && client && auth.reqUser) {
            subscribeToAllChats(client);
        }
    }, [isConnected, client, auth.reqUser, chat.chats]);

    // 채팅 목록 상태 업데이트 (Redux 상태에서 가져오기)
    useEffect(() => {
        setChats(chat.chats);
    }, [chat.chats]);

    // 메시지 상태가 변경될 때 메시지 설정 및 스크롤 이동
    useEffect(() => {
        if (message.messages) {
            setMessages(message.messages);
            scrollToBottom(); // 스크롤을 맨 아래로 이동
        }
    }, [message.messages]);

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom(); // 스크롤을 맨 아래로 이동
    }, [messages]);

    // 현재 채팅이 변경될 때 모든 메시지 가져오기
    useEffect(() => {
        if (currentChat?.id) {
            dispatch(getAllMessages({ chatId: currentChat.id, token }));
            setLastReadTimestamps((prevTimestamps) => ({
                ...prevTimestamps,
                [currentChat.id]: new Date().toISOString(), // 마지막 읽은 타임스탬프 업데이트
            }));
        }
    }, [currentChat, message.newMessage]);

    // 사용자 채팅 가져오기
    useEffect(() => {
        dispatch(getUsersChat({ token }));
    }, [chat.createdChat, chat.createdGroup, chat.updatedChat]);

    // 로그인된 사용자가 없을 경우 로그인 페이지로 이동
    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signin");
        }
    }, [auth.reqUser]);

    // 현재 사용자 정보 가져오기
    useEffect(() => {
        dispatch(currentUser(token));
    }, [token]);

    // 모든 채팅에 대한 모든 메시지 가져오기
    useEffect(() => {
        chat.chats &&
        chat.chats.forEach((item) => {
            dispatch(getAllMessages({ chatId: item.id, token }));
        });
    }, [chat.chats, token, dispatch]);

    // 마지막 메시지 설정
    useEffect(() => {
        const prevLastMessages = { ...lastMessages };
        if (message.messages && message.messages.length > 0) {
            message.messages.forEach((msg) => {
                prevLastMessages[msg.chat.id] = msg;
            });

            setLastMessages(prevLastMessages);
        }
    }, [message.messages]);

    // 메뉴 열기 핸들러
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    // 메뉴 닫기 핸들러
    const handleClose = () => {
        setAnchorEl(null);
    };

    // 채팅방 메뉴 열기 핸들러
    const handleChatMenuClick = (event) => {
        setChatMenuAnchorEl(event.currentTarget);
    };

    // 채팅방 메뉴 닫기 핸들러
    const handleChatMenuClose = () => {
        setChatMenuAnchorEl(null);
    };

    // 채팅 카드 클릭 시 채팅 생성
    const handleClickOnChatCard = (userId) => {
        dispatch(createChat({ token, data: { userId } }));
    };

    // 사용자 검색 핸들러
    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }));
    };

    // 새 메시지 생성 핸들러
    const handleCreateNewMessage = () => {
        if (client && isConnected) { // 메시지를 보낼 때 클라이언트 연결 상태 확인
            if (!content.trim()) {
                console.warn("Message content is empty");
                return;
            }

            const newMessage = {
                chatId: currentChat.id,
                content: content,
                user: auth.reqUser, // 메시지를 보낸 사용자 정보를 포함
                timestamp: new Date().toISOString(),
                type: "USER", // 메시지 타입 설정 USER_MASSAGE
            };

            dispatch(createMessage({
                token,
                data: newMessage,
            }));

            client.publish({
                destination: `/app/message`,
                body: JSON.stringify(newMessage),
            });

            setContent("");
        } else {
            console.error("STOMP client is not connected.");
        }
    };

    // 프로필 보기 상태 설정
    const handleNavigate = () => {
        setIsProfile(true);
    };

    // 프로필 닫기 상태 설정
    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    };

    // 그룹 생성 상태 설정
    const handleCreateGroup = () => {
        setIsGroup(true);
    };

    // 로그아웃 처리
    const handleLogout = () => {
        dispatch(logoutAction());
        navigate("/signin");
    };

    // 현재 채팅 설정
    const handleCurrentChat = (item) => {
        setCurrentChat(item);
        setLastReadTimestamps((prevTimestamps) => ({
            ...prevTimestamps,
            [item.id]: new Date().toISOString(), // 채팅 클릭 시 마지막 읽은 타임스탬프 업데이트
        }));
    };

    // 채팅방 수정하기 버튼 클릭 시 동작
    const handleEditChat = () => {
        setIsEditGroup(true); // 수정 모드로 전환
        handleChatMenuClose();
    };

    // 채팅방 삭제하기 버튼 클릭 시 동작
    const handleDeleteChat = () => {
        if (currentChat) {
            dispatch(deleteChat(currentChat.id, token));
            setCurrentChat(null); // 현재 채팅 초기화
        }
        handleChatMenuClose();
    };

    // 채팅방 나가기 버튼 클릭 시 동작
    const handleLeaveChat = () => {
        // TODO: 채팅방 나가기 로직 구현
        console.log("Leave Chat");
        handleChatMenuClose();
    };

    // 친구 초대하기 버튼 클릭 시 동작
    const handleInviteFriend = () => {
        setInviteMode(true); // 초대 모드로 전환
        handleChatMenuClose();
    };

    return (
        <div className="relative">
            <div className="w-[100vw] py-14 bg-[#00a884]">
                <div className="flex bg-[#f0f2f5] h-[90vh] absolute top-[5vh] left-[2vw] w-[96vw]">
                    <div className="left w-[30%] h-full bg-[#e8e9ec]">
                        {isProfile && (
                            <div className="w-full h-full">
                                <Profile handleCloseOpenProfile={handleCloseOpenProfile}/>
                            </div>
                        )}
                        {isGroup && <CreateGroup setIsGroup={setIsGroup}/>}
                        {isEditGroup && (
                            <EditGroup
                                currentChat={currentChat}
                                setIsEditGroup={setIsEditGroup}
                                // 수정된 데이터를 실시간으로 반영
                                onUpdate={(updatedChat) => {
                                    setCurrentChat(prevChat => ({
                                        ...prevChat,
                                        chatName: updatedChat.chatName,
                                        chatImage: updatedChat.chatImage,
                                    })); // currentChat 상태 업데이트
                                }}
                            />
                        )}
                        {isInviteMode && (
                            <InviteFriends
                                currentChat={currentChat}
                                setInviteMode={setInviteMode}
                            />
                        )}

                        {!isProfile && !isGroup && !isEditGroup && !isInviteMode && (
                            <div className="w-full">
                                <div className="flex justify-between items-center p-3">
                                    <div
                                        onClick={handleNavigate}
                                        className="flex items-center space-x-3"
                                    >
                                        <img
                                            className="rounded-full w-10 h-10 cursor-pointer"
                                            src={
                                                auth.reqUser?.profile ||
                                                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                                            }
                                            alt="profile"
                                        />
                                        <p>{auth.reqUser?.name}</p>
                                    </div>
                                    <Button
                                        aria-controls={isMenuOpen ? "user-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <BsThreeDotsVertical/>
                                    </Button>
                                    <Menu
                                        id="user-menu"
                                        anchorEl={anchorEl}
                                        open={isMenuOpen}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleCreateGroup}>
                                            새로운 채팅방 만들기
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            로그아웃
                                        </MenuItem>
                                    </Menu>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center border border-[#ced4da] rounded-lg">
                                        <AiOutlineSearch/>
                                        <input
                                            type="text"
                                            className="w-full p-2"
                                            placeholder="Search"
                                            value={querys}
                                            onChange={(e) => setQuerys(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSearch(querys);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="py-3">
                                        {chats.length > 0 && chats.map((item) => (
                                            <ChatCard
                                                key={item.id}
                                                userImg={item.chatImage || "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="}
                                                name={item.chatName} // 채팅방 이름 전달
                                                lastMessage={lastMessages[item.id]} // 마지막 메시지 전달
                                                lastReadTimestamp={lastReadTimestamps[item.id]} // 마지막 읽은 타임스탬프 전달
                                                onClick={() => handleCurrentChat(item)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="middle w-[40%] bg-[#ffffff]">
                        {currentChat ? (
                            <div className="flex flex-col h-full">
                                <div className="p-3 flex items-center justify-between border-b border-[#ced4da]">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="rounded-full w-10 h-10"
                                            src={
                                                currentChat.chatImage ||
                                                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                                            }
                                            alt="profile"
                                        />
                                        <div>
                                            <p>{currentChat.chatName}</p> {/* 채팅방 이름 표시 */}
                                            <p className="text-xs text-gray-500">
                                                {currentChat.users.map(user => (
                                                    <span key={user.id}
                                                          className={user.id === currentChat.createdBy.id ? 'font-bold' : ''}>
                                                        {user.name}
                                                    </span>
                                                )).reduce((prev, curr) => [prev, ', ', curr])} {/* 참가자 이름 표시, 생성자 이름 진하게 */}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        aria-controls={chatMenuAnchorEl ? "chat-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={handleChatMenuClick}
                                    >
                                        <BsThreeDotsVertical/>
                                    </Button>
                                    <Menu
                                        id="chat-menu"
                                        anchorEl={chatMenuAnchorEl}
                                        open={Boolean(chatMenuAnchorEl)}
                                        onClose={handleChatMenuClose}
                                    >
                                        <MenuItem onClick={handleEditChat}>채팅방 수정하기</MenuItem>
                                        <MenuItem onClick={handleDeleteChat}>채팅방 삭제하기</MenuItem>
                                        <MenuItem onClick={handleLeaveChat}>채팅방 나가기</MenuItem>
                                        <MenuItem onClick={handleInviteFriend}>친구 초대하기</MenuItem>
                                    </Menu>
                                </div>
                                <div className="flex flex-col flex-grow p-3 overflow-y-auto">
                                    {messages.map((msg, index) => ( // 메시지 타입에 따른 분기
                                        <MessageCard
                                            key={index}
                                            isReqUserMessage={msg.user.id === auth.reqUser.id}
                                            message={msg}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-3 border-t border-[#ced4da]">
                                    <div className="flex items-center space-x-2">
                                        <BsEmojiSmile/>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-[#ced4da] rounded-lg"
                                            placeholder="Type a message"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                        <ImAttachment/>
                                        <BsMicFill/>
                                        <button
                                            className="bg-[#00a884] text-white p-2 rounded-lg"
                                            onClick={handleCreateNewMessage}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p>Select a chat to start messaging</p>
                            </div>
                        )}
                    </div>

                    <div className="right w-[30%] bg-[#ffffff]">
                        <div className="p-3">
                            <div className="flex items-center border border-[#ced4da] rounded-lg">
                                <AiOutlineSearch/>
                                <input
                                    type="text"
                                    className="w-full p-2"
                                    placeholder="Search users"
                                    value={querys}
                                    onChange={(e) => setQuerys(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch(querys);
                                        }
                                    }}
                                />
                            </div>
                            <div className="py-3">
                                {searchUsers.length > 0 && searchUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center space-x-3 p-2 border-b border-[#ced4da]"
                                        onClick={() => handleClickOnChatCard(user.id)}
                                    >
                                    <img
                                            className="rounded-full w-10 h-10"
                                            src={
                                                user.profile ||
                                                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                                            }
                                            alt="profile"
                                        />
                                        <p>{user.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
