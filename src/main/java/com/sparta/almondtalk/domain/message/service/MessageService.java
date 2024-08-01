package com.sparta.almondtalk.domain.message.service;

import com.sparta.almondtalk.domain.message.model.Message;
import com.sparta.almondtalk.domain.message.request.SendMessageRequest;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.MessageException;
import com.sparta.almondtalk.global.exception.UserException;

import java.util.List;

public interface MessageService {

    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException;

    public Message sendSystemMessage(SendMessageRequest req) throws UserException, ChatException;

    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;

    public Message findMessageById(Integer messaageId) throws MessageException;

    public void deleteMessage(Integer messageId, User reqUser) throws MessageException;

}
