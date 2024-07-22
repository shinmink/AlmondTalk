import { useNavigate } from "react-router-dom";

// StatusUserCard 컴포넌트 정의
const StatusUserCard = () => {
    const navigate = useNavigate();

    // 사용자의 상태 페이지로 이동하는 함수
    const handleNavigate = () => {
        navigate(`/status/userId`); // 'userId'를 실제 사용자 ID로 대체해야 합니다.
    };

    return (
        // 상태 사용자 카드 컨테이너, 클릭 시 상태 페이지로 이동
        <div
            onClick={handleNavigate}
            className="flex items-center p-3 cursor-pointer"
        >
            <div>
                {/* 사용자 아바타 이미지 */}
                <img
                    className="h-7 w-7 lg:w-10 lg:h-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2023/09/11/14/19/weight-8246973_640.jpg"
                    alt="User Avatar"
                />
            </div>
            <div className="ml-2 text-white">
                <p>Something Something</p> {/* 실제 사용자 정보를 대체해야 합니다. */}
            </div>
        </div>
    );
};

export default StatusUserCard;
