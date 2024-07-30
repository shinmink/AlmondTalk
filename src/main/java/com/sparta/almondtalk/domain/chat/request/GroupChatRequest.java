package com.sparta.almondtalk.domain.chat.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GroupChatRequest {

    private List<Integer> userIds;
    private String chatName;
    private String chatImage;

    public GroupChatRequest() {
    }

    public GroupChatRequest(List<Integer> userIds, String chatName, String chatImage) {
        this.userIds = userIds;
        this.chatName = chatName;
        this.chatImage = chatImage;
    }

    @Override
    public String toString() {
        return "GroupChatRequest [userIds=" + userIds + ", chatName=" + chatName + ", chatImage=" + chatImage + "]";
    }

}