// 필요한 라이브러리 및 컴포넌트 가져오기
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BiCommentDetail } from "react-icons/bi";
import { TbCircleDashed } from "react-icons/tb";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from "react-icons/bs";
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

// HomePage 컴포넌트 정의
function HomePage() {
    const [querys, setQuerys] = useState(""); // 검색어 상태
    const [currentChat, setCurrentChat] = useState(null); // 현재 선택된 채팅 상태
    const [content, setContent] = useState(""); // 메시지 내용 상태
    const [isProfile, setIsProfile] = useState(false); // 프로필 보기 상태
    const navigate = useNavigate();
    const [isGroup, setIsGroup] = useState(false); // 그룹 생성 상태
    const [anchorEl, setAnchorEl] = useState(null); // 메뉴 앵커 상태
    const open = Boolean(anchorEl); // 메뉴 열림 상태
    const dispatch = useDispatch();
    const { auth, chat, message } = useSelector((store) => store);
    const token = localStorage.getItem("token"); // 토큰 가져오기
    const [client, setClient] = useState(null); // STOMP 클라이언트 상태
    const [isConnected, setIsConnected] = useState(false); // 클라이언트 연결 상태
    const [messages, setMessages] = useState([]); // 메시지 상태
    const [lastMessages, setLastMessages] = useState({}); // 마지막 메시지 상태
    const searchUsers = useSelector((store) => store.auth.searchUsers); // 검색된 사용자 상태

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

    // 현재 채팅이 변경될 때마다 메시지 구독 설정
    useEffect(() => {
        if (isConnected && client && auth.reqUser && currentChat) {
            const subscription = client.subscribe(
                `/group${currentChat.id}`,
                (message) => {
                    console.log("Received message:", JSON.parse(message.body));
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnected, client, auth.reqUser, currentChat]);

    // 새 메시지가 있을 때 메시지 추가 및 전송
    useEffect(() => {
        if (message.newMessage && client) {
            setMessages((prevMessages) => [...prevMessages, message.newMessage]);
            client.publish({ destination: "/app/message", body: JSON.stringify(message.newMessage) });
        }
    }, [message.newMessage]);

    // 메시지 상태가 변경될 때 메시지 설정
    useEffect(() => {
        if (message.messages) {
            setMessages(message.messages);
        }
    }, [message.messages]);

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

    // 메시지 수신 처리 함수
    const onMessageReceive = (payload) => {
        console.log("Received message:", JSON.parse(payload.body));
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

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
        dispatch(
            createMessage({
                token,
                data: { chatId: currentChat.id, content: content },
            })
        );
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
                                <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
                            </div>
                        )}
                        {isGroup && <CreateGroup setIsGroup={setIsGroup} />}

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
                                        aria-controls={open ? "user-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <BsThreeDotsVertical />
                                    </Button>
                                    <Menu
                                        id="user-menu"
                                        anchorEl={anchorEl}
                                        open={open}
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
                                        <AiOutlineSearch />
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
                                                    chat={item}
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
                                        <p>{currentChat.name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow p-3 overflow-y-auto">
                                    {messages.map((msg, index) => (
                                        <MessageCard key={index} message={msg} />
                                    ))}
                                </div>
                                <div className="p-3 border-t border-[#ced4da]">
                                    <div className="flex items-center space-x-2">
                                        <BsEmojiSmile />
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-[#ced4da] rounded-lg"
                                            placeholder="Type a message"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                        <ImAttachment />
                                        <BsMicFill />
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
                                {searchUsers &&
                                    searchUsers.map((user) => (
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
