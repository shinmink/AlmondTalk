import { useEffect, useState } from "react";
import { stories } from "./DummyStorage"; // DummyStorage로부터 stories 데이터를 가져옴
import ProgressBar from "./ProgressBar"; // ProgressBar 컴포넌트 가져옴
import { BsArrowLeft } from "react-icons/bs"; // react-icons로부터 아이콘 가져옴
import { AiOutlineClose } from "react-icons/ai"; // react-icons로부터 아이콘 가져옴
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위해 useNavigate 훅 사용

// StatusViewer 컴포넌트 정의
const StatusViewer = () => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0); // 현재 스토리 인덱스 상태
    const [activeIndex, setActiveIndex] = useState(0); // 활성화된 인덱스 상태
    const navigate = useNavigate();

    // 이전 페이지로 이동하는 함수
    const handleNavigate = () => {
        navigate(-1);
    };

    // 다음 스토리로 이동하는 함수
    const handleNextStory = () => {
        if (currentStoryIndex < stories?.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            setActiveIndex(activeIndex + 1);
        } else {
            // 스토리의 끝에 도달하면 처음으로 돌아감
            setCurrentStoryIndex(0);
            setActiveIndex(0);
        }
    };

    // useEffect를 사용하여 자동으로 다음 스토리로 이동
    useEffect(() => {
        const intervalId = setInterval(() => {
            handleNextStory();
        }, 3000); // 3초마다 다음 스토리로 이동

        // 컴포넌트가 언마운트되거나 현재 스토리가 변경될 때 interval을 정리
        return () => clearInterval(intervalId);
    }, [currentStoryIndex]);

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-slate-900">
            <div className="relative">
                {/* 현재 스토리 이미지 */}
                <img
                    src={stories?.[currentStoryIndex].image}
                    alt="story"
                    className="max-h-[96vh] object-contain"
                />
                <div className="absolute top-0 flex w-full">
                    {/* ProgressBar 컴포넌트 렌더링 */}
                    {stories?.map((item, index) => (
                        <ProgressBar
                            key={index}
                            duration={3000}
                            index={index}
                            activeIndex={activeIndex}
                        />
                    ))}
                </div>
            </div>
            <div>
                {/* 이전 페이지로 이동하는 왼쪽 화살표 아이콘 */}
                <BsArrowLeft
                    onClick={handleNavigate}
                    className="text-white text-4xl cursor-pointer absolute top-3 left-10"
                />
                {/* 이전 페이지로 이동하는 닫기 아이콘 */}
                <AiOutlineClose
                    onClick={handleNavigate}
                    className="text-white text-4xl cursor-pointer absolute top-3 right-10"
                />
            </div>
        </div>
    );
};

export default StatusViewer;
