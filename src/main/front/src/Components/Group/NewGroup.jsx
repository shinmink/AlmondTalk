import { Avatar, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

// NewGroup 컴포넌트 정의
const NewGroup = ({ groupMember, setIsGroup }) => {
    // 이미지 업로드 상태를 관리하는 상태
    const [isImageUploading, setIsImageUploading] = useState(false);
    // 그룹 이미지를 저장하는 상태
    const [groupImage, setGroupImage] = useState(null);
    // 그룹 이름을 저장하는 상태
    const [groupName, setGroupName] = useState("");
    const dispatch = useDispatch();
    // 로컬 스토리지에서 사용자의 토큰을 가져옴
    const token = localStorage.getItem("token");

    // 새로운 그룹을 생성하는 함수
    const handleCreateGroup = () => {
        // 그룹 멤버에서 사용자 ID를 추출
        let userIds = [];
        for (let user of groupMember) {
            userIds.push(user.id);
        }
        // 사용자 ID, 그룹 이름, 그룹 이미지로 그룹 객체 생성
        const group = {
            userIds,
            chatName: groupName,
            chatImage: groupImage,
        };
        // 그룹과 토큰을 포함한 데이터 객체 생성
        const data = {
            group,
            token,
        };
        // 그룹 채팅 생성을 위한 액션 디스패치
        dispatch(createGroupChat(data));
        // 새로운 그룹 생성 인터페이스를 닫음
        setIsGroup(false);
    };

    // 이미지를 Cloudinary에 업로드하는 함수
    const uploadToCloudinary = (pics) => {
        // 이미지 업로드 상태를 true로 설정
        setIsImageUploading(true);
        // 새로운 FormData 객체를 생성하고 선택된 파일을 추가
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "whatsapp");
        data.append("cloud_name", "dadlxgune");
        // Cloudinary API에 이미지 업로드를 위한 POST 요청
        fetch("https://api.cloudinary.com/v1_1/dadlxgune/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                // 그룹 이미지 URL을 설정하고 이미지 업로드 상태를 false로 업데이트
                setGroupImage(data.url.toString());
                setIsImageUploading(false);
            });
    };

    return (
        <div className="w-full h-full">
            {/* 헤더 부분 */}
            <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
                <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
                <p className="text-xl font-semibold">New Group</p>
            </div>

            {/* 그룹 이미지 */}
            <div className="flex flex-col justify-center items-center my-12">
                <label htmlFor="imgInput" className="relative">
                    <Avatar
                        alt="Group Image"
                        sx={{ width: "15rem", height: "15rem" }}
                        src={
                            groupImage ||
                            "https://media.istockphoto.com/id/1455296779/photo/smiling-businesspeople-standing-arm-in-arm-in-an-office-hall.webp?b=1&s=170667a&w=0&k=20&c=0bdu3-mVcOw6FN_vIkwTx4pCE6jgL7Jy29bBWZhoiik="
                        }
                    />
                    {isImageUploading && (
                        <CircularProgress className="absolute top-[5rem] left-[6rem]" />
                    )}
                </label>
                <input
                    type="file"
                    id="imgInput"
                    className="hidden"
                    onChange={(e) => uploadToCloudinary(e.target.files[0])}
                />
            </div>

            {/* 그룹 이름 입력란 */}
            <div className="w-full flex justify-between items-center py-2 px-5">
                <input
                    className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
                    placeholder="Group Subject"
                    value={groupName || ""}
                    type="text"
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>

            {/* 그룹 생성 버튼 */}
            {groupName && (
                <div className="py-10 bg-slate-200 flex items-center justify-center">
                    <Button onClick={handleCreateGroup}>
                        <div className="bg-[#0c977d] rounded-full p-4">
                            <BsCheck2 className="text-white text-3xl font-bold" />
                        </div>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NewGroup;
