import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // 기본 내보내기로 redux-thunk를 가져옵니다.
import { authReducer } from "./Auth/Reducer";
import { chatReducer } from "./Chat/Reducer";
import { messageReducer } from "./Message/Reducer";

// 여러 리듀서를 단일 rootReducer로 결합
const rootReducer = combineReducers({
    auth: authReducer, // 인증 관련 상태
    chat: chatReducer, // 채팅 관련 상태
    message: messageReducer, // 메시지 관련 상태
});

// rootReducer와 미들웨어(thunk)를 사용하여 Redux 스토어 생성
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
