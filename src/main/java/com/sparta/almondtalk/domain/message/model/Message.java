package com.sparta.almondtalk.domain.message.model;

import com.sparta.almondtalk.domain.chat.model.Chat;
import com.sparta.almondtalk.domain.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String content;
    @Setter
    @Getter
    private LocalDateTime timestamp;

    @ManyToOne
    private Chat chat;

    @Setter
    @Getter
    @ManyToOne
    private User user;


    @Enumerated(EnumType.STRING)
    private MessageType type;

    public Message(Integer id, String content, LocalDateTime timestamp, Chat chat, User user, MessageType type) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.chat = chat;
        this.user = user;
        this.type = type;
    }

    @Override
    public String toString() {
        return "Message [id=" + id + ", content=" + content + ", timestamp=" + timestamp + ", chat=" + chat + ", user="
                + user + ", type=" + type + "]";
    }

    public enum MessageType {
        USER, SYSTEM
    }

}
