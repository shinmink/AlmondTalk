import { BASE_API_URL } from "../../config/api";
import {
    LOGIN,
    LOGOUT,
    REGISTER,
    REQ_USER,
    SEARCH_USER,
    UPDATE_USER,
} from "./ActionType";

// 사용자 회원가입을 위한 액션 생성자
export const register = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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

// 사용자 로그인을 위한 액션 생성자
export const login = (data) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const resData = await res.json();

        // JWT 토큰이 있는 경우 로컬 스토리지에 저장
        if (resData.jwt) localStorage.setItem("token", resData.jwt);

        console.log("login", resData);
        dispatch({ type: LOGIN, payload: resData });
    } catch (error) {
        console.log("catch error", error);
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

// 사용자 로그아웃을 위한 액션 생성자
export const logoutAction = () => async (dispatch) => {
    // 로컬 스토리지에서 JWT 토큰 제거
    localStorage.removeItem("token");

    // 로그아웃을 나타내는 액션 디스패치
    dispatch({ type: LOGOUT, payload: null });
    dispatch({ type: REQ_USER, payload: null });
};
