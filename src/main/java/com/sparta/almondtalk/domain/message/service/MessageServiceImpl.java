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
    private MessageRepository messageRepository;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ChatServiceImpl chatService;

    @Override
    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
        User user = this.userService.findUserById(req.getUserId());
        Chat chat = this.chatService.findChatById(req.getChatId());

        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());

        message = this.messageRepository.save(message);
        return message;
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {

        Chat chat = this.chatService.findChatById(chatId);

        if (!chat.getUsers().contains(reqUser)) {
            throw new UserException("You are not related to this chat");
        }

        List<Message> messages = this.messageRepository.findByChatId(chat.getId());

        return messages;

    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        Message message = this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));
        return message;
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException {
        Message message = this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));

        if (message.getUser().getId() == reqUser.getId()) {
            this.messageRepository.delete(message);
        }

        throw new MessageException("You are not authorized for this task");
    }

}
