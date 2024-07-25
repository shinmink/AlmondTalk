import React from "react";

// ChatCard 컴포넌트는 사용자 이미지, 이름, 마지막 메시지를 표시하는 카드 컴포넌트입니다.
const ChatCard = ({ userImg, name, lastMessage, lastReadTimestamp, onClick }) => {
    // 타임스탬프를 읽기 쉬운 날짜 형식으로 포맷하는 함수
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";

        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(timestamp).toLocaleDateString(undefined, options);
    };

    // 마지막 메시지가 마지막 읽은 타임스탬프보다 최신인지 확인하는 함수
    const isNewMessage = () => {
        if (!lastMessage || !lastReadTimestamp) return false;
        return new Date(lastMessage.timestamp) > new Date(lastReadTimestamp);
    };

    return (
        // Flexbox를 사용하여 항목을 중앙에 정렬하고 마우스를 올렸을 때 커서 모양을 변경하는 div
        <div className="flex items-center justify-center py-2 group cursor-pointer" onClick={onClick}>
            {/* 사용자 이미지를 표시하는 div */}
            <div className="w-[19%]">
                <img className="h-13 w-14 rounded-full" src={userImg} alt="profile" />
            </div>
            {/* 사용자 이름 및 마지막 메시지를 표시하는 div */}
            <div className="pl-5 w-[80%]">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg">{name}</p> {/* 채팅방 이름 표시 */}
                        <p className="text-sm text-gray-600 truncate">{lastMessage ? lastMessage.content : ""}</p> {/* 마지막 메시지 내용 표시 */}
                    </div>
                    <p className="text-sm">
                        {/* 마지막 메시지가 있을 경우, 타임스탬프를 포맷하여 표시 */}
                        {lastMessage ? formatTimestamp(lastMessage.timestamp) : ""}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {/* 새로운 메시지가 있을 경우 표시할 녹색 원 */}
                        {isNewMessage() && <span className="bg-green-500 h-2 w-2 rounded-full"></span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatCard;
