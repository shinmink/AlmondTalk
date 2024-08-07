import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser, changePassword } from "../../Redux/Auth/Action";

// Profile 컴포넌트 정의
const Profile = ({ handleCloseOpenProfile }) => {
    const [flag, setFlag] = useState(false); // 편집 모드 여부를 관리하는 상태
    const [username, setUsername] = useState(null); // 사용자 이름을 관리하는 상태
    const [tempPicture, setTempPicture] = useState(null); // 임시 프로필 사진 URL을 관리하는 상태
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호를 관리하는 상태
    const [newPassword, setNewPassword] = useState(""); // 새 비밀번호를 관리하는 상태
    const { auth } = useSelector((store) => store); // Redux 스토어에서 인증 상태를 가져옴
    const dispatch = useDispatch(); // Redux 디스패치를 사용하기 위해 선언

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

    // 비밀번호 변경 핸들러 함수
    const handleChangePassword = () => {
        const data = {
            id: auth.reqUser.id, // 사용자 ID
            token: localStorage.getItem("token"), // 로컬 스토리지에서 토큰 가져오기
            currentPassword, // 현재 비밀번호
            newPassword, // 새 비밀번호
        };
        dispatch(changePassword(data)); // 비밀번호 변경 액션 디스패치
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
                        alt="Profile"
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

            {/* 이메일 및 비밀번호 변경 섹션 */}
            <div className="bg-white px-3 mt-5">
                <p className="py-3">Your email</p>
                <p className="py-3">{auth.reqUser?.email || "Email"}</p>
            </div>

            <div className="bg-white px-3 mt-5">
                <p className="py-3">Change Password</p>
                <input
                    type="password"
                    placeholder="Current password"
                    className="w-full outline-none border-b-2 border-blue-700 p-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New password"
                    className="w-full outline-none border-b-2 border-blue-700 p-2 mt-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                    onClick={handleChangePassword}
                    className="bg-blue-700 text-white py-2 px-4 mt-3 rounded"
                >
                    Update Password
                </button>
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