import { BASE_API_URL } from "../../config/api";
import {
    LOGIN,
    LOGOUT,
    REGISTER,
    REQ_USER,
    SEARCH_USER,
    UPDATE_USER,
    CHANGE_PASSWORD,
    GET_NEARBY_USERS,
    GET_NEARBY_USERS_ERROR

} from "./ActionType";

// 사용자 회원가입을 위한 액션 생성자
export const register = (data) => async (dispatch) => {
    const handleRegistration = async (signupData) => {
        try {
            // 서버로 회원가입 요청
            const res = await fetch(`${BASE_API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            const resData = await res.json();

            // JWT 토큰이 있는 경우 로컬 스토리지에 저장
            if (resData.jwt) localStorage.setItem("token", resData.jwt);

            console.log("register", resData);
            dispatch({ type: REGISTER, payload: resData });
        } catch (error) {
            console.log("catch error", error);
        }
    };

    try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // 위치 정보를 포함한 회원가입 데이터
                const signupData = {
                    ...data, // 기존 사용자 데이터(email, password, name 등)
                    latitude,
                    longitude,
                };

                handleRegistration(signupData); // 회원가입 처리 함수 호출
            },
            (error) => {
                console.error("Error getting location:", error);

                // 위치 정보가 없을 경우 null로 설정
                const signupData = {
                    ...data,
                    latitude: null,
                    longitude: null,
                };

                handleRegistration(signupData); // 회원가입 처리 함수 호출
            }
        );
    } catch (error) {
        console.log("catch error", error);
    }
};

// 사용자 로그인을 위한 액션 생성자
export const login = (data) => async (dispatch) => {
    // 로그인 요청을 처리하는 함수
    const handleLogin = async (loginData) => {
        try {
            const res = await fetch(`${BASE_API_URL}/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData), // 위치 정보를 포함한 데이터 전송
            });

            const resData = await res.json();

            // JWT 토큰이 있는 경우 로컬 스토리지에 저장
            if (resData.jwt) {
                localStorage.setItem("token", resData.jwt);  // JWT 토큰을 로컬 스토리지에 저장
            }

            console.log("login", resData);
            dispatch({ type: LOGIN, payload: resData }); // 로그인 성공 시 Redux에 상태 업데이트

        } catch (error) {
            console.log("catch error", error); // 예외 발생 시 콘솔에 에러 출력
        }
    };

    try {
        // 사용자의 현재 위치를 가져옵니다.
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;  // 사용자의 위도
                const longitude = position.coords.longitude;  // 사용자의 경도

                // 위치 정보를 포함한 로그인 데이터 생성
                const loginData = {
                    ...data, // 기존 로그인 데이터 (email, password 등)
                    latitude, // 위도 추가
                    longitude, // 경도 추가
                };

                handleLogin(loginData); // 로그인 처리 함수 호출
            },
            (error) => {
                console.error("Error getting location:", error);

                // 위치 정보를 가져오지 못했을 때 처리
                const loginData = {
                    ...data,
                    latitude: null, // 위치 정보를 가져오지 못한 경우 null로 설정
                    longitude: null,
                };

                handleLogin(loginData); // 위치 정보가 없을 때도 로그인 처리 함수 호출
            }
        );
    } catch (error) {
        console.log("catch error", error); // 위치 정보를 가져오는 과정에서 발생하는 예외 처리
    }
};

// 현재 사용자 데이터를 가져오는 액션 생성자
export const currentUser = (token) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const resData = await res.json();

        console.log("current user", resData);
        dispatch({ type: REQ_USER, payload: resData });
    } catch (error) {
        console.log("catch error", error);
    }
};

// 사용자를 검색하는 액션 생성자
export const searchUser = (data) => async (dispatch) => {
    try {
        console.log(data);
        const res = await fetch(`${BASE_API_URL}/api/users/${data.keyword}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
            },
        });
        const resData = await res.json();

        console.log("search", resData);
        dispatch({ type: SEARCH_USER, payload: resData });
    } catch (error) {
        console.log("catch error", error);
    }
};

// 사용자 데이터를 업데이트하는 액션 생성자
export const updateUser = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify(data.data),
        });
        const resData = await res.json();

        console.log("updated user", resData);
        dispatch({ type: UPDATE_USER, payload: resData });
    } catch (error) {
        console.log("catch error", error);
    }
};

// 비밀번호 변경을 위한 액션 생성자
export const changePassword = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }),
        });
        const resData = await res.json();

        console.log("changed password", resData);
        dispatch({ type: CHANGE_PASSWORD, payload: resData });
    } catch (error) {
        console.log("catch error", error);
    }
};


// 사용자 로그아웃을 위한 액션 생성자
export const logoutAction = () => async (dispatch) => {
    // 로컬 스토리지에서 JWT 토큰 제거
    localStorage.removeItem("token");

    // 로그아웃을 나타내는 액션 디스패치
    dispatch({ type: LOGOUT, payload: null });
    dispatch({ type: REQ_USER, payload: null });
};


// // 근처 사용자 가져오기 액션
// export const getNearbyUsers = ({ latitude, longitude, radius, token }) => async (dispatch) => {
//     try {
//         // 서버로 반경 내의 사용자 목록 요청
//         const res = await fetch(`${BASE_API_URL}/api/users/nearby`, {
//             method: "POST", // HTTP POST 메서드를 사용
//             headers: {
//                 "Content-Type": "application/json", // 요청 데이터가 JSON임을 명시
//                 Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
//             },
//             body: JSON.stringify({ latitude, longitude, radius }) // 요청 바디에 데이터를 JSON으로 변환하여 포함
//         });
//
//         const resData = await res.json(); // 서버의 응답을 JSON으로 변환
//
//         console.log("nearby users", resData); // 서버 응답 데이터 로그 출력
//         dispatch({ type: GET_NEARBY_USERS, payload: resData }); // 근처 사용자 목록 가져오기 성공 시 액션 디스패치
//     } catch (error) {
//         console.log("catch error", error); // 에러 발생 시 로그 출력
//         dispatch({ type: GET_NEARBY_USERS_ERROR, payload: error.message }); // 에러 발생 시 에러 액션 디스패치
//     }
// };

// 근처 사용자 가져오기 액션
export const getNearbyUsers = ({ latitude, longitude, radius, token }) => async (dispatch) => {
    try {
        // 서버로 반경 내의 사용자 목록 요청
        const res = await fetch(`${BASE_API_URL}/api/users/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`, {
            method: "GET", // HTTP GET 메서드를 사용
            headers: {
                "Content-Type": "application/json", // 요청 데이터가 JSON임을 명시
                Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
            },
        });

        const resData = await res.json(); // 서버로부터의 응답을 JSON으로 변환

        console.log("Nearby users response:", resData); // 서버 응답을 콘솔에 출력

        dispatch({ type: GET_NEARBY_USERS, payload: resData });

        return resData; // 이 부분이 중요합니다: 데이터를 반환하여 fetchNearbyUsers에서 사용할 수 있도록 합니다.


    } catch (error) {
        console.log("Error fetching nearby users:", error);
        dispatch({ type: GET_NEARBY_USERS_ERROR, payload: error.message });
        return undefined; // 에러 발생 시 undefined 반환
    }
};
