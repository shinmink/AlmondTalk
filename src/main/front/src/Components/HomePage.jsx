import React, { useEffect, useState, useRef } from "react"; // useRef 추가
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
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";
import "./HomePage.css";

function HomePage() {
    const [querys, setQuerys] = useState(""); // 검색어 상태
    const [currentChat, setCurrentChat] = useState(null); // 현재 선택된 채팅 상태
    const [content, setContent] = useState(""); // 메시지 내용 상태
    const [isProfile, setIsProfile] = useState(false); // 프로필 보기 상태
    const [isGroup, setIsGroup] = useState(false); // 그룹 생성 상태
    const [anchorEl, setAnchorEl] = useState(null); // 메뉴 앵커 상태
    const isMenuOpen = Boolean(anchorEl); // 메뉴 열림 상태
    const [client, setClient] = useState(null); // STOMP 클라이언트 상태
    const [isConnected, setIsConnected] = useState(false); // 클라이언트 연결 상태
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [lastMessages, setLastMessages] = useState({}); // 마지막 메시지 상태
    const [lastReadTimestamps, setLastReadTimestamps] = useState({}); // 마지막 읽은 메시지의 타임스탬프 상태


    const messagesEndRef = useRef(null); // 스크롤을 위한 useRef 추가

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
                if (currentChat) {
                    subscribeToChat(stompClient, currentChat.id); // 연결 시 현재 채팅 구독
                }
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

    // 채팅 구독 함수
    const subscribeToChat = (stompClient, chatId) => {
        stompClient.subscribe(`/group/${chatId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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

    useEffect(() => {
        if (isConnected && client && auth.reqUser && currentChat) {
            subscribeToChat(client, currentChat.id);
        }
    }, [isConnected, client, auth.reqUser, currentChat]);

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
        }
    }, [currentChat, message.newMessage]);

    // 사용자 채팅 가져오기
    useEffect(() => {
        dispatch(getUsersChat({ token }));
    }, [chat.createdChat, chat.createdGroup]);

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
                user: auth.reqUser, // 메시지를 보낸 사용자 정보를 포함하도록 수정된 부분
                timestamp: new Date().toISOString(),
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

                        {!isProfile && !isGroup && (
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
                                            Create New Group
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            Logout
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
                                        {chat.chats &&
                                            chat.chats.map((item) => (
                                                <ChatCard
                                                    key={item.id}
                                                    userImg={item.profile || "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="}
                                                    name={item.chatName} // 채팅방 이름 전달
                                                    lastMessage={lastMessages[item.id]} // 마지막 메시지 전달 (수정된 부분)
                                                    lastReadTimestamp={lastReadTimestamps[item.id]} // 마지막 읽은 타임스탬프 전달
                                                    onClick={() => handleCurrentChat(item)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 채팅 및 메시지 섹션 */}
                    <div className="middle w-[40%] bg-[#ffffff]">
                        {currentChat ? (
                            <div className="flex flex-col h-full">
                                <div className="p-3 flex items-center justify-between border-b border-[#ced4da]">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="rounded-full w-10 h-10"
                                            src={
                                                currentChat.profile ||
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
                                </div>
                                <div className="flex flex-col flex-grow p-3 overflow-y-auto">
                                    {messages.map((msg, index) => (
                                        <MessageCard
                                            key={index}
                                            isReqUserMessage={msg.user.id === auth.reqUser.id} // 보낸 이가 현재 로그인된 유저인지 확인
                                            message={msg} // 메시지 객체 전달
                                        />
                                    ))}
                                    <div ref={messagesEndRef} /> {/* 스크롤을 위한 div 추가 */}
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

                    {/* 사용자 검색 및 프로필 섹션 */}
                    <div className="right w-[30%] bg-[#ffffff]">
                        <div className="p-3">
                            <div className="flex items-center border border-[#ced4da] rounded-lg">
                                <AiOutlineSearch />
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
