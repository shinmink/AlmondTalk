import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, login } from "../../Redux/Auth/Action";

// Signin 컴포넌트 정의
const Signin = () => {
    // 스낵바 상태 관리
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // 입력 데이터 상태 관리
    const [inputData, setInputData] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { auth } = useSelector((store) => store);

    // 폼 제출 처리 함수
    const handleSubmit = (e) => {
        e.preventDefault();
        // 입력 데이터를 사용하여 로그인 액션 디스패치
        dispatch(login(inputData));
        // 스낵바 열기
        setOpenSnackbar(true);
    };

    // 입력 값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 새로운 값을 입력 데이터 상태에 업데이트
        setInputData((values) => ({ ...values, [name]: value }));
    };

    // 스낵바 닫기 처리 함수
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        // 토큰이 있는 경우 현재 사용자 데이터를 가져옴
        if (token) {
            dispatch(currentUser(token));
        }
    }, [token]);

    useEffect(() => {
        // 현재 사용자 데이터가 있으면 홈 페이지로 이동
        if (auth.reqUser?.name) {
            navigate("/");
        }
    }, [auth.reqUser, navigate]);

    return (
        <div>
            {/* 로그인 폼 */}
            <div className="flex justify-center h-screen w-[100vw] items-center">
                <div className="p-10 w-[30%] shadow-md bg-white">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <p className="mb-2">Email</p>
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                value={inputData.email}
                                className="py-2 outline outline-green-600 w-full rounded-md border"
                            />
                        </div>
                        <div>
                            <p className="mb-2">Password</p>
                            <input
                                type="password" // 보안을 위해 type="password" 사용
                                name="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                value={inputData.password}
                                className="py-2 outline outline-green-600 w-full rounded-md border"
                            />
                        </div>
                        <div>
                            <Button
                                type="submit"
                                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                                className="w-full"
                                variant="contained"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    {/* 회원 가입 링크 */}
                    <div className="flex space-x-3 items-center mt-5">
                        <p className="m-0">Create New Account</p>
                        <Button variant="text" onClick={() => navigate("/signup")}>
                            SignUp
                        </Button>
                    </div>
                </div>
            </div>

            {/* 스낵바 알림 */}
            <div>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        Login Successfully!!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default Signin;
