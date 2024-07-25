// 필요한 라이브러리 및 상수 가져오기
import { BASE_API_URL } from "../../config/api";
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT, DELETE_CHAT, LEAVE_CHAT, UPDATE_CHAT } from "./ActionType";

// 단일 채팅을 생성하기 위한 액션 생성자
export const createChat = (chatData) => async (dispatch) => {
    try {
        // POST 요청을 통해 단일 채팅 생성
        const res = await fetch(`${BASE_API_URL}/api/chats/single`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`, // 인증 헤더 추가
            },
            body: JSON.stringify(chatData.data), // 요청 본문에 채팅 데이터 추가
        });

        const data = await res.json();
        console.log("create chat ", data);

        // 생성된 채팅 데이터를 포함하는 액션 디스패치
        dispatch({ type: CREATE_CHAT, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }
};


// 그룹 채팅을 생성하기 위한 액션 생성자
export const createGroupChat = (chatData) => async (dispatch) => {
    try {
        // POST 요청을 통해 그룹 채팅 생성
        const res = await fetch(`${BASE_API_URL}/api/chats/group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`, // 인증 헤더 추가
            },
            body: JSON.stringify(chatData.group), // 요청 본문에 그룹 데이터 추가
        });

        const data = await res.json();
        console.log("create group chat ", data);

        // 생성된 그룹 채팅 데이터를 포함하는 액션 디스패치
        dispatch({ type: CREATE_GROUP, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }
};

// 채팅에 참여하는 사용자들을 가져오기 위한 액션 생성자
export const getUsersChat = (chatData) => async (dispatch) => {
    try {
        // GET 요청을 통해 사용자 채팅 데이터 가져오기
        const res = await fetch(`${BASE_API_URL}/api/chats/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chatData.token}`, // 인증 헤더 추가
            },
        });

        const data = await res.json();
        console.log("get users chat ", data);

        // 가져온 사용자 채팅 데이터를 포함하는 액션 디스패치
        dispatch({ type: GET_USERS_CHAT, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }

};

// 채팅을 삭제하기 위한 액션 생성자 - 수정된 부분
export const deleteChat = (chatId, token) => async (dispatch) => {
    try {
        // DELETE 요청을 통해 채팅 삭제
        await fetch(`${BASE_API_URL}/api/chats/delete/${chatId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
        });

        // 채팅 삭제 액션 디스패치
        dispatch({ type: DELETE_CHAT, payload: chatId });
    } catch (error) {
        console.log("catch error ", error);
    }
};


// 채팅을 나가기 위한 액션 생성자 - 수정된 부분
export const leaveChat = (chatId, token) => async (dispatch) => {
    try {
        // PUT 요청을 통해 채팅 나가기
        await fetch(`${BASE_API_URL}/api/chats/${chatId}/leave`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
        });

        // 채팅 나가기 액션 디스패치
        dispatch({ type: LEAVE_CHAT, payload: chatId });
    } catch (error) {
        console.log("catch error ", error);
    }
};

// 채팅을 수정하기 위한 액션 생성자 - 수정된 부분
export const updateChat = (chatId, groupChatData, token) => async (dispatch) => {
    try {
        // PUT 요청을 통해 채팅 수정
        const res = await fetch(`${BASE_API_URL}/api/chats/${chatId}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
            body: JSON.stringify(groupChatData), // 요청 본문에 수정된 채팅 데이터 추가
        });

        const data = await res.json();
        console.log("update chat ", data);

        // 수정된 채팅 데이터를 포함하는 액션 디스패치
        dispatch({ type: UPDATE_CHAT, payload: data });
    } catch (error) {
        console.log("catch error ", error);
    }
};
