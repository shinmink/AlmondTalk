import React from "react";

// MessageCard 컴포넌트 정의
const MessageCard = ({ isReqUserMessage, message }) => {
    if (!message) return null; // message undefined 경우 아무것도 렌더링하지 않음

    return (
        <div className={`flex ${isReqUserMessage ? "justify-end" : "justify-start"} my-2`}>
            <div
                className={`py-2 px-4 rounded-md max-w-[70%] ${
                    isReqUserMessage ? "bg-[#d9fdd3] text-black" : "bg-white text-black"
                }`}
            >
                <p className="text-xs text-gray-500 mb-1">{message.user.name}</p> {/* message.sender 대신 message.user.name 사용 */}
                <p>{message.content}</p>
            </div>
        </div>
    );
};

export default MessageCard;
