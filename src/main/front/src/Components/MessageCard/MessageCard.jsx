// MessageCard 컴포넌트 정의
const MessageCard = ({ isReqUserMessage, content }) => {
    return (
        // 메시지 카드 컨테이너, 사용자 메시지 여부에 따라 스타일 적용
        <div
            className={`py-2 px-2 wounded-md max-w-[50%] ${
                isReqUserMessage ? "self-start bg-white" : "self-end bg-[#d9fdd3]"
            }`}
        >
            {/* 메시지 내용 표시 */}
            <p>{content}</p>
        </div>
    );
};

export default MessageCard;
