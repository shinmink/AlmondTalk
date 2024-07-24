package com.sparta.almondtalk.domain.message.controller;

import com.sparta.almondtalk.domain.home.response.ApiResponse;
import com.sparta.almondtalk.domain.message.model.Message;
import com.sparta.almondtalk.domain.message.request.SendMessageRequest;
import com.sparta.almondtalk.domain.message.service.MessageServiceImpl;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.service.UserServiceImpl;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.MessageException;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageServiceImpl messageService; // MessageServiceImpl 빈을 주입받음

    @Autowired
    private UserServiceImpl userService; // UserServiceImpl 빈을 주입받음

    // 메시지 전송 핸들러
    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(
            @RequestBody SendMessageRequest sendMessageRequest,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        sendMessageRequest.setUserId(user.getId()); // 요청에 사용자 ID 설정

        Message message = this.messageService.sendMessage(sendMessageRequest); // 메시지 전송

        return new ResponseEntity<Message>(message, HttpStatus.OK); // 전송된 메시지와 함께 OK 상태 반환
    }

    // 특정 채팅의 모든 메시지를 가져오는 핸들러
    @GetMapping("/{chatId}")
    public ResponseEntity<List<Message>> getChatMessageHandler(
            @PathVariable Integer chatId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        List<Message> messages = this.messageService.getChatsMessages(chatId, user); // 채팅의 모든 메시지 가져오기

        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK); // 메시지 목록과 함께 OK 상태 반환
    }

    // 메시지 삭제 핸들러
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId,
                                                            @RequestHeader("Authorization") String jwt) throws UserException, ChatException, MessageException {

        User user = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        this.messageService.deleteMessage(messageId, user); // 메시지 삭제

        ApiResponse res = new ApiResponse("Deleted successfully......", false); // 삭제 성공 응답 생성

        return new ResponseEntity<>(res, HttpStatus.OK); // 응답과 함께 OK 상태 반환
    }
}
