import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../Redux/Auth/Action";

// Profile 컴포넌트 정의
const Profile = ({ handleCloseOpenProfile }) => {
    // 상태 관리: 편집 모드 여부
    const [flag, setFlag] = useState(false);
    // 상태 관리: 사용자 이름
    const [username, setUsername] = useState(null);
    // 상태 관리: 임시 프로필 사진 URL
    const [tempPicture, setTempPicture] = useState(null);
    const { auth } = useSelector((store) => store);
    const dispatch = useDispatch();

    // 편집 모드로 전환하는 함수
    const handleFlag = () => {
        setFlag(true);
    };

    // 확인 버튼 클릭 시 처리하는 함수
    const handleCheckClick = (e) => {
        setFlag(false);
        const data = {
            id: auth.reqUser.id,
            token: localStorage.getItem("token"),
            data: { name: username },
        };
        dispatch(updateUser(data));
    };

    // 이름 변경 핸들러 함수
    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    // Cloudinary에 이미지를 업로드하는 함수
    const uploadToCloudinary = (pics) => {
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
                setTempPicture(data.url.toString());
                const dataa = {
                    id: auth.reqUser.id,
                    token: localStorage.getItem("token"),
                    data: { profile: data.url.toString() },
                };
                dispatch(updateUser(dataa));
            });
    };

    // 이름을 엔터 키로 업데이트하는 함수
    const handleUpdateName = (e) => {
        if (e.key === "Enter") {
            const data = {
                id: auth.reqUser.id,
                token: localStorage.getItem("token"),
                data: { name: username },
            };
            dispatch(updateUser(data));
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
                <BsArrowLeft
                    className="cursor-pointer text-2xl font-bold"
                    onClick={handleCloseOpenProfile}
                />
                <p className="cursor-pointer font-semibold">Profile</p>
            </div>

            {/* 프로필 사진 업데이트 섹션 */}
            <div className="flex flex-col justify-center items-center my-12">
                <label htmlFor="imgInput">
                    <img
                        className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
                        src={
                            auth.reqUser.profile ||
                            tempPicture ||
                            "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
                        }
                        alt=""
                    />
                </label>

                <input
                    onChange={(e) => uploadToCloudinary(e.target.files[0])}
                    type="file"
                    id="imgInput"
                    className="hidden"
                />
            </div>

            {/* 이름 섹션 */}
            <div className="bg-white px-3">
                <p className="py-3">Your name</p>

                {!flag && (
                    <div className="w-full flex justify-between items-center">
                        <p className="py-3 ">{auth.reqUser?.name || "Username"}</p>
                        <BsPencil onClick={handleFlag} className="cursor-pointer" />
                    </div>
                )}

                {flag && (
                    <div className="w-full flex justify-between items-center py-2">
                        <input
                            onKeyPress={handleUpdateName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter your name"
                            className="w-[80%] outline-none border-b-2 border-blue-700 p-2 "
                        />
                        <BsCheck2
                            onClick={handleCheckClick}
                            className="cursor-pointer text-2xl"
                        />
                    </div>
                )}
            </div>

            <div className="px-3 my-5">
                <p className="py-10">
                    This is not your username or pin. This name will be visible to others.
                </p>
            </div>
        </div>
    );
};

export default Profile;
