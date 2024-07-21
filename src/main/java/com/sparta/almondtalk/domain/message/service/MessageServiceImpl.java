package com.sparta.almondtalk.domain.message.service;

import com.sparta.almondtalk.domain.chat.model.Chat;
import com.sparta.almondtalk.domain.chat.service.ChatServiceImpl;
import com.sparta.almondtalk.domain.message.model.Message;
import com.sparta.almondtalk.domain.message.repository.MessageRepository;
import com.sparta.almondtalk.domain.message.request.SendMessageRequest;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.service.UserServiceImpl;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.MessageException;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository; // 메시지 저장소 의존성 주입

    @Autowired
    private UserServiceImpl userService; // 사용자 서비스 의존성 주입

    @Autowired
    private ChatServiceImpl chatService; // 채팅 서비스 의존성 주입

    @Override
    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
        // 요청된 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(req.getUserId());
        // 요청된 채팅 ID로 채팅 찾기
        Chat chat = this.chatService.findChatById(req.getChatId());

        // 메시지 생성 및 설정
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());

        // 메시지 저장 및 반환
        message = this.messageRepository.save(message);
        return message;
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {
        // 요청된 채팅 ID로 채팅 찾기
        Chat chat = this.chatService.findChatById(chatId);

        // 요청한 사용자가 해당 채팅에 속해 있는지 확인
        if (!chat.getUsers().contains(reqUser)) {
            throw new UserException("You are not related to this chat");
        }

        // 채팅 ID로 메시지 목록 찾기
        List<Message> messages = this.messageRepository.findByChatId(chat.getId());

        return messages;
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        // 메시지 ID로 메시지 찾기
        Message message = this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));
        return message;
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException {
        // 메시지 ID로 메시지 찾기
        Message message = this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));

        // 요청한 사용자가 메시지의 작성자인지 확인 후 삭제
        if (message.getUser().getId() == reqUser.getId()) {
            this.messageRepository.delete(message);
            return; // 메시지 삭제 후 예외 발생하지 않도록 return 추가
        }

        // 작성자가 아닌 경우 예외 발생
        throw new MessageException("You are not authorized for this task");
    }
}
