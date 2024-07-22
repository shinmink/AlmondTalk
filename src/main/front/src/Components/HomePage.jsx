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

function HomePage() {
    const [querys, setQuerys] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState("");
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const [isGroup, setIsGroup] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { auth, chat, message } = useSelector((store) => store);
    const token = localStorage.getItem("token");
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const searchUsers = useSelector((store) => store.auth.searchUsers); // 추가된 부분

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

    useEffect(() => {
        if (message.newMessage && client) {
            setMessages((prevMessages) => [...prevMessages, message.newMessage]);
            client.publish({ destination: "/app/message", body: JSON.stringify(message.newMessage) });
        }
    }, [message.newMessage]);

    useEffect(() => {
        if (message.messages) {
            setMessages(message.messages);
        }
    }, [message.messages]);

    useEffect(() => {
        if (currentChat?.id) {
            dispatch(getAllMessages({ chatId: currentChat.id, token }));
        }
    }, [currentChat, message.newMessage]);

    useEffect(() => {
        dispatch(getUsersChat({ token }));
    }, [chat.createdChat, chat.createdGroup]);

    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signin");
        }
    }, [auth.reqUser]);

    useEffect(() => {
        dispatch(currentUser(token));
    }, [token]);

    useEffect(() => {
        chat.chats &&
        chat.chats.forEach((item) => {
            dispatch(getAllMessages({ chatId: item.id, token }));
        });
    }, [chat.chats, token, dispatch]);

    useEffect(() => {
        const prevLastMessages = { ...lastMessages };
        if (message.messages && message.messages.length > 0) {
            message.messages.forEach((msg) => {
                prevLastMessages[msg.chat.id] = msg;
            });

            setLastMessages(prevLastMessages);
        }
    }, [message.messages]);

    const onMessageReceive = (payload) => {
        console.log("Received message:", JSON.parse(payload.body));
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOnChatCard = (userId) => {
        dispatch(createChat({ token, data: { userId } }));
    };

    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }));
    };

    const handleCreateNewMessage = () => {
        dispatch(
            createMessage({
                token,
                data: { chatId: currentChat.id, content: content },
            })
        );
    };

    const handleNavigate = () => {
        setIsProfile(true);
    };

    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    };

    const handleCreateGroup = () => {
        setIsGroup(true);
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate("/signin");
    };

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

                    {/* Chat and Message Section */}
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

                    {/* User Search and Profile Section */}
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
