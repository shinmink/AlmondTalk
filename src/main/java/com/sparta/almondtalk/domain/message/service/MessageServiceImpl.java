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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    //private static final String UPLOAD_DIR = "uploads/"; // 파일 저장 디렉토리

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
        message.setType(Message.MessageType.USER);

        // 메시지 저장 및 반환
        message = this.messageRepository.save(message);
        return message;
    }

    // 시스템 메시지를 보내는 메서드
    @Override
    public Message sendSystemMessage(SendMessageRequest req) throws UserException, ChatException {
        // 요청된 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(req.getUserId());
        // 요청된 채팅 ID로 채팅 찾기
        Chat chat = this.chatService.findChatById(req.getChatId());

        // 시스템 메시지 생성 및 설정
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setType(Message.MessageType.SYSTEM); // 시스템 메시지로 설정

        // 메시지 저장 및 반환
        message = this.messageRepository.save(message);
        return message;
    }

    @Override
    public Message uploadFileMessage(Integer chatId, Integer userId, MultipartFile file) throws UserException, ChatException, MessageException {
        // 요청된 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(userId);
        // 요청된 채팅 ID로 채팅 찾기
        Chat chat = this.chatService.findChatById(chatId);

        if (file.isEmpty()) {
            throw new MessageException("File is empty");
        }

        // 파일 저장 로직 (예: 파일 시스템, 클라우드 스토리지 등)
        String fileUrl = saveFile(file);

        // 메시지 생성 및 설정
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(fileUrl);
        message.setTimestamp(LocalDateTime.now());
        message.setType(Message.MessageType.FILE); // 파일 메시지 타입 설정

        // 메시지 저장 및 반환
        message = this.messageRepository.save(message);
        return message;
    }

    private String saveFile(MultipartFile file) {
        // 파일 저장 로직 구현
        // 예: 파일 시스템에 저장하고 URL 반환
        // 이 예제에서는 단순히 파일 이름을 반환합니다.
        return file.getOriginalFilename();
    }

//    // 파일을 서버의 로컬 파일 시스템에 저장하는 메소드 $$$$$$$$$$
//    private String saveFile(MultipartFile file) throws MessageException {
//        try {
//            // 파일 저장 디렉토리가 없으면 생성
//            Path uploadPath = Paths.get(UPLOAD_DIR);
//            if (!Files.exists(uploadPath)) {
//                Files.createDirectories(uploadPath);
//            }
//
//            // 원본 파일 이름을 사용하여 저장 경로 설정
//            String fileName = file.getOriginalFilename();
//            Path filePath = uploadPath.resolve(fileName);
//
//            // 파일을 지정된 경로에 저장
//            Files.copy(file.getInputStream(), filePath);
//
//            // 저장된 파일의 URL 반환 (여기서는 파일 시스템 경로를 반환)
//            return filePath.toString();
//        } catch (IOException e) {
//            throw new MessageException("Failed to save file", e);
//        }
//    }


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
