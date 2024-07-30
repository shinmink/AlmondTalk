import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { updateChat } from "../../Redux/Chat/Action"; // updateChat 액션을 사용

const EditGroup = ({ currentChat, setIsEditGroup, onUpdate }) => {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [groupImage, setGroupImage] = useState(currentChat.chatImage || ""); // 수정된 부분: chatImage로 변경
    const [groupName, setGroupName] = useState(currentChat.chatName || "");
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const handleUpdateGroup = () => {
        const updatedChat = {
            id: currentChat.id,
            chatName: groupName,
            chatImage: groupImage,
        };

        dispatch(updateChat(updatedChat, token)).then(() => {
            onUpdate(updatedChat); // 업데이트된 정보를 상위 컴포넌트로 전달
            setIsEditGroup(false); // 수정 모드 종료
        });
    };

    // 이미지 업로드 함수
    const uploadToCloudinary = (pics) => {
        setIsImageUploading(true);
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "whatsapp");
        data.append("cloud_name", "dadlxgune");

        fetch("https://api.cloudinary.com/v1_1/dadlxgune/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Uploaded Image URL:', data.url); // 업로드된 이미지 URL 로그
                setGroupImage(data.url.toString());
                setIsImageUploading(false);
            });
    };

    return (
        <div className="w-full h-full">
            {/* 헤더 부분 */}
            <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
                <BsArrowLeft className="cursor-pointer text-2xl font-bold" onClick={() => setIsEditGroup(false)} />
                <p className="text-xl font-semibold">Edit Group</p>
            </div>

            {/* 그룹 이미지 */}
            <div className="flex flex-col justify-center items-center my-12">
                <label htmlFor="imgInput" className="relative">
                    <Avatar
                        alt="Group Image"
                        sx={{ width: "15rem", height: "15rem" }}
                        src={groupImage}
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
                    placeholder="Group Name"
                    value={groupName}
                    type="text"
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>

            {/* 그룹 업데이트 버튼 */}
            <div className="py-10 bg-slate-200 flex items-center justify-center">
                <Button onClick={handleUpdateGroup}>
                    <div className="bg-[#0c977d] rounded-full p-4">
                        <BsCheck2 className="text-white text-3xl font-bold" />
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default EditGroup;
