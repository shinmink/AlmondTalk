import { AiOutlineClose } from "react-icons/ai";
import StatusUserCard from "./StatusUserCard";
import { useNavigate } from "react-router-dom";

// Status 컴포넌트 정의
const Status = () => {
    const navigate = useNavigate();

    // 이전 페이지로 이동하는 함수
    const handleNavigate = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="relative">
            <div className="flex items-center w-screen">
                {/* 왼쪽 부분 */}
                <div className="left h-screen bg-[#1e262c] lg:w-2/5 w-2/3 px-5">
                    <div className="pt-5 h-[13%]">
                        {/* 현재 사용자의 상태 카드 */}
                        <StatusUserCard />
                    </div>
                    <hr />
                    <div className="overflow-y-scroll h-[86%] pt-3">
                        {/* 상태 카드 리스트 */}
                        {[1, 1, 1, 1, 1].map((item, index) => (
                            <StatusUserCard key={index} />
                        ))}
                    </div>
                </div>

                {/* 오른쪽 부분 (닫기 버튼 포함) */}
                <div
                    onClick={handleNavigate}
                    className="right relative h-screen lg:w-3/5 w-1/3 bg-[#0b141a]"
                >
                    <AiOutlineClose className="text-white cursor-pointer absolute top-5 right-10 text-xl" />
                </div>
            </div>
        </div>
    );
};

export default Status;
