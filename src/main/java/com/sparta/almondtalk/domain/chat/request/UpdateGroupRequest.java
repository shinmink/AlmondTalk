package com.sparta.almondtalk.domain.chat.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateGroupRequest {
    private String chatName;
    private String chatImage;

    public UpdateGroupRequest(String chatName, String chatImage) {
        this.chatName = chatName;
        this.chatImage = chatImage;
    }

    @Override
    public String toString() {
        return "UpdateGroupRequest [chatName=" + chatName + ", chatImage=" + chatImage + "]";
    }
}