import { useEffect, useState } from "react";
import "./ProgressBar.css";

// ProgressBar 컴포넌트 정의
const ProgressBar = ({ index, activeIndex, duration }) => {
    // 이 프로그레스 바가 현재 활성 상태인지 확인
    const isActive = index === activeIndex;

    // 프로그레스 바의 진행 상태를 관리하는 상태
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 일정 간격마다 프로그레스 바의 진행 상태를 업데이트
        const intervalId = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1; // 1%씩 증가
                }
                clearInterval(intervalId); // 100%에 도달하면 인터벌 종료
                return prev;
            });
        }, duration / 100); // 주어진 기간(duration)을 100등분하여 인터벌 설정

        // 컴포넌트가 언마운트되거나 activeIndex가 변경될 때 인터벌 정리
        return () => clearInterval(intervalId);
    }, [duration, activeIndex]);

    useEffect(() => {
        // activeIndex가 변경될 때 프로그레스 바를 초기화
        setProgress(0);
    }, [activeIndex]);

    return (
        <div className={`progress-bar-container ${isActive ? "active" : ""}`}>
            <div
                className={` ${isActive ? "progress-bar" : ""}`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
