package com.sparta.almondtalk.domain.home.controller;

import com.sparta.almondtalk.domain.message.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

// 실시간 채팅을 처리하는 클래스
public class RealTimeChat {

    private SimpMessagingTemplate simpMessagingTemplate; // 메시징 템플릿을 사용하여 메시지를 전송

    // "/message" 경로로 들어오는 메시지를 처리하는 메서드
    @MessageMapping("/message")
    // "/group/public" 목적지로 메시지를 전송
    @SendTo("/group/public")
    public Message recieveMessage(@Payload Message message) {
        // 특정 그룹 채팅 경로로 메시지 전송
        simpMessagingTemplate.convertAndSend("/group" + message.getChat().getId().toString(), message);
        return message; // 전송된 메시지를 반환
    }
}
