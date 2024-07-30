package com.sparta.almondtalk.domain.chat.service;

import com.sparta.almondtalk.domain.chat.model.Chat;
import com.sparta.almondtalk.domain.chat.repository.ChatRepository;
import com.sparta.almondtalk.domain.chat.request.GroupChatRequest;
import com.sparta.almondtalk.domain.chat.request.UpdateGroupRequest;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.service.UserServiceImpl;
import com.sparta.almondtalk.global.exception.ChatException;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private UserServiceImpl userService; // 사용자 서비스 의존성 주입

    @Autowired
    private ChatRepository chatRepository; // 채팅 저장소 의존성 주입

    @Override
    public Chat createChat(User reqUser, Integer userId) throws UserException {
        // 요청된 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(userId);

        // 기존에 같은 사용자들 사이에 채팅이 있는지 확인
        Chat isChatExist = this.chatRepository.findSingleChatByUserIds(user, reqUser);

        // 기존 채팅이 있으면 반환
        if (isChatExist != null) {
            return isChatExist;
        }

        // 새로운 채팅 생성
        Chat chat = new Chat();
        chat.setCreatedBy(reqUser);
        chat.getUsers().add(user);
        chat.getUsers().add(reqUser);
        chat.setGroup(false);

        // 채팅 저장 및 반환
        chat = this.chatRepository.save(chat);

        return chat;
    }

    @Override
    public Chat findChatById(Integer chatId) throws ChatException {
        // 채팅 ID로 채팅 찾기
        return this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The requested chat is not found"));
    }

    @Override
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
        // 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(userId);

        // 사용자 ID로 채팅 목록 찾기
        List<Chat> chats = this.chatRepository.findChatByUserId(user.getId());

        return chats;
    }

    @Override
    public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException {
        // 새로운 그룹 채팅 생성
        Chat group = new Chat();
        group.setGroup(true);
        group.setChatImage(req.getChatImage());
        group.setChatName(req.getChatName());
        group.setCreatedBy(reqUser);
        group.getAdmins().add(reqUser);

        // 그룹에 사용자 추가
        for (Integer userId : req.getUserIds()) {
            User user = this.userService.findUserById(userId);
            group.getUsers().add(user);
        }

        // 그룹 저장 및 반환
        group = this.chatRepository.save(group);
        return group;
    }

    @Override
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
        // 채팅 ID로 채팅 찾기
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        // 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(userId);

        // 요청한 사용자가 관리자면 사용자 추가
        if (chat.getAdmins().contains(reqUser)) {
            chat.getUsers().add(user);
            return chat;
        } else {
            throw new UserException("You have not access to add user");
        }
    }

    @Override
    public Chat updateGroup(Integer chatId, UpdateGroupRequest updateGroupRequest, User reqUser) throws ChatException, UserException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        // 요청한 사용자가 채팅에 속해 있는지 확인
        if (chat.getUsers().contains(reqUser)) {
            chat.setChatName(updateGroupRequest.getChatName());
            chat.setChatImage(updateGroupRequest.getChatImage());
            return this.chatRepository.save(chat);
        } else {
            throw new UserException("You are not authorized to update this group");
        }
    }


    @Override
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException {
        // 채팅 ID로 채팅 찾기
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        // 사용자 ID로 사용자 찾기
        User user = this.userService.findUserById(userId);

        // 요청한 사용자가 관리자면 사용자 제거
        if (chat.getAdmins().contains(reqUser)) {
            chat.getUsers().remove(user);
            return chat;
        } else if (chat.getUsers().contains(reqUser)) {
            // 요청한 사용자가 일반 사용자이면 자신만 제거 가능
            if (user.getId() == reqUser.getId()) {
                chat.getUsers().remove(user);
                return this.chatRepository.save(chat);
            }
        }
        throw new UserException("You have not access to remove user");
    }

    @Override
    public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException {
        // 채팅 ID로 채팅 찾기
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found while deleting"));
        // 채팅 삭제
        this.chatRepository.delete(chat);
    }

}
