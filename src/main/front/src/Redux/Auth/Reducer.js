import {
    LOGIN,
    REGISTER,
    REQ_USER,
    SEARCH_USER,
    UPDATE_USER,
} from "./ActionType";

// 인증 스토어의 초기 상태
const initialValue = {
    signup: null, // 사용자 회원가입 관련 데이터를 저장
    signin: null, // 사용자 로그인 관련 데이터를 저장
    reqUser: null, // 현재 사용자 관련 데이터를 저장
    searchUser: null, // 사용자 검색 관련 데이터를 저장
    updateUser: null, // 사용자 업데이트 관련 데이터를 저장
};

// 인증 관련 액션을 처리하는 리듀서 함수
export const authReducer = (store = initialValue, { type, payload }) => {
    // 액션 타입을 확인하고 스토어를 적절하게 업데이트
    if (type === REGISTER) {
        return { ...store, signup: payload }; // 회원가입 데이터 업데이트
    } else if (type === LOGIN) {
        return { ...store, signin: payload }; // 로그인 데이터 업데이트
    } else if (type === REQ_USER) {
        return { ...store, reqUser: payload }; // 현재 사용자 데이터 업데이트
    } else if (type === SEARCH_USER) {
        return { ...store, searchUser: payload }; // 사용자 검색 데이터 업데이트
    } else if (type === UPDATE_USER) {
        return { ...store, updateUser: payload }; // 사용자 업데이트 데이터 업데이트
    }
    // 인식되지 않은 액션 타입의 경우 현재 스토어를 그대로 반환
    return store;
};
