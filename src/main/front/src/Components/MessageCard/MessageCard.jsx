import React from "react";

// MessageCard 컴포넌트 정의
const MessageCard = ({ isReqUserMessage, message }) => {
    if (!message) return null; // message undefined 경우 아무것도 렌더링하지 않음

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

    // 사용자 메시지 렌더링
    return (
        <div className={`flex ${isReqUserMessage ? "justify-end" : "justify-start"} my-2`}>
            <div
                className={`py-2 px-4 rounded-md max-w-[70%] ${
                    isReqUserMessage ? "bg-[#d9fdd3] text-black" : "bg-[#f0f0f0] text-black"
                }`}
            >
                <p className="text-xs text-gray-500 mb-1">{message.user.name}</p> {/* user 객체 사용 */}
                <p>{message.content}</p>
            </div>
        </div>
    );
};

export default MessageCard;