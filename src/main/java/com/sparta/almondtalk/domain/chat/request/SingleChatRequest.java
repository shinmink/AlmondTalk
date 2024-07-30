package com.sparta.almondtalk.domain.chat.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SingleChatRequest {

    private Integer userId;

    public SingleChatRequest() {
    }

    public SingleChatRequest(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "SingleChatRequest [userId=" + userId + "]";
    }

}