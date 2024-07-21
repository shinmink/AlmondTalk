package com.sparta.almondtalk.domain.chat.model;

import com.sparta.almondtalk.domain.message.model.Message;
import com.sparta.almondtalk.domain.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Chat {


    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Setter
    private String chatName;
    @Getter
    @Setter
    private String chatImage;
    private boolean isGroup;

    @ManyToMany
    private Set<User> admins = new HashSet<>();

    @Setter
    @ManyToOne
    private User createdBy;

    @ManyToMany
    private Set<User> users = new HashSet<>();

    @OneToMany
    private List<Message> messages = new ArrayList<>();

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public Chat(Integer id, String chatName, String chatImage, boolean isGroup, Set<User> admins, User createdBy,
                Set<User> users, List<Message> messages) {
        this.id = id;
        this.chatName = chatName;
        this.chatImage = chatImage;
        this.isGroup = isGroup;
        this.admins = admins;
        this.createdBy = createdBy;
        this.users = users;
        this.messages = messages;
    }

    @Override
    public String toString() {
        return "Chat [id=" + id + ", chatName=" + chatName + ", chatImage=" + chatImage + ", isGroup=" + isGroup
                + ", admins=" + admins + ", createdBy=" + createdBy + ", users=" + users + ", messages=" + messages
                + "]";
    }

}