package com.sparta.almondtalk.domain.chat.controller;

import com.sparta.almondtalk.domain.chat.model.Chat;
import com.sparta.almondtalk.domain.chat.request.GroupChatRequest;
import com.sparta.almondtalk.domain.chat.request.SingleChatRequest;
import com.sparta.almondtalk.domain.chat.request.UpdateGroupRequest;
import com.sparta.almondtalk.domain.chat.service.ChatServiceImpl;
import com.sparta.almondtalk.domain.home.response.ApiResponse;
import com.sparta.almondtalk.domain.message.model.Message;
import com.sparta.almondtalk.domain.message.request.SendMessageRequest;
import com.sparta.almondtalk.domain.message.service.MessageServiceImpl;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.service.UserServiceImpl;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 채팅 관련 요청을 처리하는 컨트롤러 클래스
@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService; // ChatServiceImpl 빈을 주입받음

    @Autowired
    private UserServiceImpl userService; // UserServiceImpl 빈을 주입받음

    @Autowired
    private MessageServiceImpl messageService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;;

    // 단일 채팅을 생성하는 핸들러
    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatRequest singleChatRequest,
                                                  @RequestHeader("Authorization") String jwt) throws UserException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.createChat(reqUser, singleChatRequest.getUserId()); // 단일 채팅 생성

        // 새로운 채팅방 생성 브로드캐스트
        this.simpMessagingTemplate.convertAndSend("/topic/chats/new", chat);

        return new ResponseEntity<>(chat, HttpStatus.CREATED); // 생성된 채팅과 함께 HTTP 상태 코드 201(CREATED)을 반환
    }

    // 그룹 채팅을 생성하는 핸들러
    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatRequest groupChatRequest,
                                                   @RequestHeader("Authorization") String jwt) throws UserException {

        System.out.println(groupChatRequest);
        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.createGroup(groupChatRequest, reqUser); // 그룹 채팅 생성

        // 새로운 그룹 채팅방 생성 브로드캐스트
        this.simpMessagingTemplate.convertAndSend("/topic/chats/new", chat);

        return new ResponseEntity<>(chat, HttpStatus.CREATED); // 생성된 그룹 채팅과 함께 HTTP 상태 코드 201(CREATED)을 반환
    }

    // 특정 채팅을 ID로 찾는 핸들러
    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatByIdHandler(@PathVariable int chatId) throws ChatException {

        Chat chat = this.chatService.findChatById(chatId); // 채팅 ID로 채팅 찾기

        return new ResponseEntity<>(chat, HttpStatus.OK); // 찾은 채팅과 함께 HTTP 상태 코드 200(OK)을 반환
    }

    // 사용자의 모든 채팅을 찾는 핸들러
    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findChatByUserIdHandler(@RequestHeader("Authorization") String jwt)
            throws UserException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        List<Chat> chats = this.chatService.findAllChatByUserId(reqUser.getId()); // 사용자 ID로 모든 채팅 찾기

        return new ResponseEntity<>(chats, HttpStatus.OK); // 찾은 채팅 목록과 함께 HTTP 상태 코드 200(OK)을 반환
    }

    // 그룹에 사용자를 추가하는 핸들러
    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandler(@PathVariable Integer chatId,
                                                      @PathVariable Integer userId, @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.addUserToGroup(userId, chatId, reqUser); // 그룹에 사용자 추가

        // 사용자 추가 브로드캐스트 이벤트 추가
        this.simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId + "/update", chat);

        // 사용자 입장 메시지 생성
        String enterMessage = userService.findUserById(userId).getName() + "님이 입장하셨습니다.";

        SendMessageRequest sendMessageRequest = new SendMessageRequest(userId, chatId, enterMessage);;

        messageService.sendSystemMessage(sendMessageRequest); // 시스템 메시지 전송


        return new ResponseEntity<>(chat, HttpStatus.OK); // 업데이트된 채팅과 함께 HTTP 상태 코드 200(OK)을 반환
    }

    // 사용자가 채팅방을 나가는 핸들러
    @PutMapping("/{chatId}/leave")
    public ResponseEntity<Chat> leaveChatHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.removeFromGroup(chatId, reqUser.getId(), reqUser); // 그룹에서 사용자 제거

        // 사용자 퇴장 브로드캐스트 이벤트 추가
        this.simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId + "/update", chat);

        // 사용자 퇴장 메시지 생성
        String leaveMessage = reqUser.getName() + "님이 채팅방을 나갔습니다.";

        SendMessageRequest sendMessageRequest = new SendMessageRequest(reqUser.getId(), chatId, leaveMessage);
        messageService.sendSystemMessage(sendMessageRequest); // 시스템 메시지 전송 $$$$$$$$$$$

        return new ResponseEntity<>(chat, HttpStatus.OK); // 업데이트된 채팅과 함께 HTTP 상태 코드 200(OK)을 반환 $$$$$$$$$$$
    }

    // 그룹 정보를 업데이트하는 핸들러 추가
    @PutMapping("/{chatId}/update")
    public ResponseEntity<Chat> updateGroupHandler(@PathVariable Integer chatId,
                                                   @RequestBody UpdateGroupRequest updateGroupRequest,
                                                   @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.updateGroup(chatId, updateGroupRequest, reqUser); // 그룹 정보 업데이트

        // 그룹 정보 수정 브로드캐스트 이벤트 추가
        this.simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId + "/update", chat);

        return new ResponseEntity<>(chat, HttpStatus.OK); // 업데이트된 그룹 정보와 함께 HTTP 상태 코드 200(OK)을 반환
    }

    // 그룹에서 사용자를 제거하는 핸들러
    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroupHandler(@PathVariable Integer chatId,
                                                           @PathVariable Integer userId, @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        Chat chat = this.chatService.removeFromGroup(userId, chatId, reqUser); // 그룹에서 사용자 제거

        // 사용자 제거 브로드캐스트 이벤트 추가
        this.simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId + "/update", chat);

        // 사용자 퇴장 메시지 생성
        String leaveMessage = userService.findUserById(userId).getName() + "님이 강제퇴장되셨습니다.";

        SendMessageRequest sendMessageRequest = new SendMessageRequest(userId, chatId, leaveMessage);;

        Message message = messageService.sendSystemMessage(sendMessageRequest);

        return new ResponseEntity<>(chat, HttpStatus.OK); // 업데이트된 채팅과 함께 HTTP 상태 코드 200(OK)을 반환
    }

    // 채팅을 삭제하는 핸들러
    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(@PathVariable Integer chatId,
                                                         @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt); // JWT 토큰을 사용하여 사용자 프로필을 찾음

        this.chatService.deleteChat(chatId, reqUser.getId()); // 채팅 삭제

        // 채팅방 삭제 브로드캐스트 이벤트 추가
        this.simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId + "/delete", chatId);

        ApiResponse res = new ApiResponse("Deleted Successfully...", false); // 삭제 성공 응답 생성

        return new ResponseEntity<>(res, HttpStatus.OK); // 응답과 함께 HTTP 상태 코드 200(OK)을 반환
    }
}
