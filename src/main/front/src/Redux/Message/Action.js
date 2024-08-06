// 필요한 라이브러리 및 상수 가져오기
import { BASE_API_URL } from "../../config/api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, DELETE_MESSAGE, UPLOAD_FILE_MESSAGE } from "./ActionType.js";

// 새로운 메시지를 생성하기 위한 액션 생성자
export const createMessage = (messageData) => async (dispatch) => {
    try {
        // 시스템 메시지와 사용자 메시지의 엔드포인트 구분
        const endpoint = messageData.type === "SYSTEM" ? "system" : "create";

        const res = await fetch(`${BASE_API_URL}/api/messages/${endpoint}`, {
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

// 파일 메시지를 업로드하기 위한 액션 생성자
export const uploadFileMessage = (uploadData) => async (dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/messages/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${uploadData.token}`, // 인증 헤더 추가
            },
            body: uploadData.formData, // FormData 객체 사용
        });

        const data = await res.json();
        console.log("upload file message ", data);

        // 업로드된 파일 메시지 데이터를 포함하는 액션 디스패치
        dispatch({ type: UPLOAD_FILE_MESSAGE, payload: data });
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

// 메시지를 삭제하기 위한 액션 생성자
export const deleteMessage = (messageId, token) => async (dispatch) => {
    try {
        // DELETE 요청을 통해 메시지 삭제
        await fetch(`${BASE_API_URL}/api/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
        });

        // 메시지 삭제 액션 디스패치
        dispatch({ type: DELETE_MESSAGE, payload: messageId });
    } catch (error) {
        console.log("catch error ", error);
    }
};

