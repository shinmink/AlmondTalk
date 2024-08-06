import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, DELETE_MESSAGE, UPLOAD_FILE_MESSAGE } from "./ActionType";

// 메시지 스토어의 초기 상태
const initialValue = {
    messages: null, // 메시지 배열을 저장
    newMessage: null, // 새로 생성된 메시지 관련 데이터를 저장
};

// 메시지 관련 액션을 처리하는 리듀서 함수
export const messageReducer = (store = initialValue, { type, payload }) => {
    // 액션 타입을 확인하고 스토어를 적절하게 업데이트
    switch (type) {
        case CREATE_NEW_MESSAGE:
            return { ...store, newMessage: payload }; // 새로 생성된 메시지 데이터 업데이트
        case GET_ALL_MESSAGE:
            return { ...store, messages: payload }; // 모든 메시지 데이터 업데이트
        case DELETE_MESSAGE: // 메시지 삭제 처리
            return {
                ...store,
                messages: store.messages.filter(message => message.id !== payload)
            };
        case UPLOAD_FILE_MESSAGE: // 파일 메시지 업로드 처리 추가
            return { ...store, newMessage: payload };
        default:
            return store;// 인식되지 않은 액션 타입의 경우 현재 스토어를 그대로 반환
    }
};