package com.sparta.almondtalk.domain.message.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SendMessageRequest {

    private Integer userId;
    private Integer chatId;
    private String content;

    public SendMessageRequest() {
    }

    public SendMessageRequest(Integer userId, Integer chatId, String content) {
        this.userId = userId;
        this.chatId = chatId;
        this.content = content;
    }

    @Override
    public String toString() {
        return "SendMessageRequest [userId=" + userId + ", chatId=" + chatId + ", content=" + content + "]";
    }

}