import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType";

// 채팅 스토어의 초기 상태
const initialValue = {
    chats: [], // 채팅 데이터를 담는 배열
    createdGroup: null, // 생성된 그룹 채팅 관련 데이터를 저장
    createdChat: null, // 생성된 단일 채팅 관련 데이터를 저장
};

// 채팅 관련 액션을 처리하는 리듀서 함수
export const chatReducer = (store = initialValue, { type, payload }) => {
    // 액션 타입을 확인하고 스토어를 적절하게 업데이트
    if (type === CREATE_CHAT) {
        return { ...store, createdChat: payload }; // 단일 채팅 생성 데이터 업데이트
    } else if (type === CREATE_GROUP) {
        return { ...store, createdGroup: payload }; // 그룹 채팅 생성 데이터 업데이트
    } else if (type === GET_USERS_CHAT) {
        return { ...store, chats: payload }; // 사용자 채팅 데이터 업데이트
    }
    // 인식되지 않은 액션 타입의 경우 현재 스토어를 그대로 반환
    return store;
};
