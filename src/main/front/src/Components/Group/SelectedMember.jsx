import React from "react";
import { AiOutlineClose } from "react-icons/ai";

// SelectedMember 컴포넌트 정의
const SelectedMember = ({ handleRemoveMember, member }) => {
    return (
        // 멤버 정보를 담고 있는 컨테이너, 유연한 정렬과 스타일 적용
        <div className="flex items-center bg-slate-300 rounded-full p-1">
            {/* 멤버 프로필 이미지 */}
            <img
                className="w-7 h-7 rounded-full"
                src={
                    member.profile || // 멤버의 프로필 이미지가 없으면 기본 이미지 사용
                    "https://cdn.pixabay.com/photo/2023/09/04/06/59/dog-8232158_1280.jpg"
                }
                alt=""
            />
            {/* 멤버 이름 표시 */}
            <p className="px-2 text-white">{member.name}</p>
            {/* 멤버 제거 아이콘 */}
            <AiOutlineClose
                onClick={() => handleRemoveMember(member)} // 클릭 시 멤버 제거 함수 호출
                className="cursor-pointer text-white"
            />
        </div>
    );
};

export default SelectedMember;
