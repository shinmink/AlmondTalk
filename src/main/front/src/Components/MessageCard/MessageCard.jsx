import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위해 useNavigate 훅 사용


// MessageCard 컴포넌트 정의
const MessageCard = ({ isReqUserMessage, message }) => {
    const navigate = useNavigate(); //  navigate 함수 사용

    if (!message) return null; // message undefined 경우 아무것도 렌더링하지 않음

    // 프로필 클릭 핸들러
    const handleProfileClick = () => {
        navigate(`/status/${message.user.id}`); //  클릭된 유저의 스토리 페이지로 이동
    };
    // 시스템 메시지인 경우 다른 스타일로 렌더링
    if (message.type === "SYSTEM") {
        return (
            <div className="flex justify-center my-2">
                <div className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-100 text-black">
                    <p>{message.content}</p>
                </div>
            </div>
        );
    }

    // 파일 메시지인 경우 파일 다운로드 링크를 렌더링
    if (message.type === "FILE") {
        console.log("message check => ", message);

        return (
            <div className={`flex ${isReqUserMessage ? "justify-end" : "justify-start"} my-2`}>
                {!isReqUserMessage && ( // 프로필 사진 추가 (받은 메시지의 경우)
                    <img
                        src={message.user.profile}
                        alt={`${message.user.name}'s profile`}
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={handleProfileClick} // 프로필 클릭 시 스토리 페이지로 이동
                    />
                )}
                <div
                    className={`py-2 px-4 rounded-md max-w-[70%] ${
                        isReqUserMessage ? "bg-[#d9fdd3] text-black" : "bg-[#f0f0f0] text-black"
                    }`}
                >
                    <p className="text-xs text-gray-500 mb-1">{message.user.name}</p>
                    <a href={message.content} download className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {message.content.split("/").pop()}
                    </a>
                </div>
                {isReqUserMessage && ( // 프로필 사진 추가 (보낸 메시지의 경우)
                    <img
                        src={message.user.profile}
                        alt={`${message.user.name}'s profile`}
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={handleProfileClick} // 프로필 클릭 시 스토리 페이지로 이동
                    />
                )}
            </div>
        );
    }

    // 사용자 메시지 렌더링
    return (
        <div className={`flex ${isReqUserMessage ? "justify-end" : "justify-start"} my-2`}>
            {!isReqUserMessage && ( // 프로필 사진 추가 (받은 메시지의 경우)
                <img
                    src={message.user.profile}
                    alt={`${message.user.name}'s profile`}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={handleProfileClick} // 프로필 클릭 시 스토리 페이지로 이동
                />
            )}
            <div
                className={`py-2 px-4 rounded-md max-w-[70%] ${
                    isReqUserMessage ? "bg-[#d9fdd3] text-black" : "bg-[#f0f0f0] text-black"
                }`}
            >
                <p className="text-xs text-gray-500 mb-1">{message.user.name}</p> {/* user 객체 사용 */}
                <p>{message.content}</p>
            </div>
            {isReqUserMessage && ( // 프로필 사진 추가 (보낸 메시지의 경우)
                <img
                    src={message.user.profile}
                    alt={`${message.user.name}'s profile`}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={handleProfileClick} // 프로필 클릭 시 스토리 페이지로 이동
                />
            )}
        </div>
    );
};

export default MessageCard;