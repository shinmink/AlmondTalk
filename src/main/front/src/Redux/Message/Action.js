import { BASE_API_URL } from "../../config/api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType.js";

// 새로운 메시지를 생성하기 위한 액션 생성자
export const createMessage = (messageData) => async (dispatch) => {
    try {
        // POST 요청을 통해 새로운 메시지 생성
        const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${messageData.token}`, // 인증 헤더 추가
            },
            body: JSON.stringify(messageData.data), // 요청 본문에 메시지 데이터 추가
        });

        const data = await res.json();
        console.log("create message ", data);

        // 생성된 메시지 데이터를 포함하는 액션 디스패치
        dispatch({ type: CREATE_NEW_MESSAGE, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }
};

// 채팅의 모든 메시지를 가져오기 위한 액션 생성자
export const getAllMessages = (reqData) => async (dispatch) => {
    console.log("Came inside get all messages");

    try {
        // GET 요청을 통해 모든 메시지 가져오기
        const res = await fetch(`${BASE_API_URL}/api/messages/${reqData.chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${reqData.token}`, // 인증 헤더 추가
            },
        });

        const data = await res.json();
        console.log("get all messages from action method", data);

        // 가져온 메시지 데이터를 포함하는 액션 디스패치
        dispatch({ type: GET_ALL_MESSAGE, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }
};
