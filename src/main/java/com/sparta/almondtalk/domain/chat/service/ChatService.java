package com.sparta.almondtalk.domain.chat.service;

import com.sparta.almondtalk.domain.chat.model.Chat;
import com.sparta.almondtalk.domain.chat.request.GroupChatRequest;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.UserException;

import java.util.List;

public interface ChatService {

    public Chat createChat(User reqUser, Integer userId) throws UserException;

    public Chat findChatById(Integer chatId) throws ChatException;

    public List<Chat> findAllChatByUserId(Integer userId) throws UserException;

    public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException;

    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;

    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws ChatException, UserException;

    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException;

    public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException;

}