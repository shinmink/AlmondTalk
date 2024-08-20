// InviteFriends.jsx
import React, { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";
import { inviteUserToGroup } from "../../Redux/Chat/Action";
import useGroupMembers from "../../hooks/useGroupMembers"; // 커스텀 훅 가져오기

const InviteFriends = ({ currentChat, setInviteMode, nearbyUsers }) => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const token = localStorage.getItem("token");

    // 커스텀 훅 사용
    const { groupMember, addMember, removeMember } = useGroupMembers();

    const handleSearch = (keyword) => {
        // 이미 그룹에 포함된 멤버와 이미 초대된 멤버는 제외하고 검색
        const filteredUsers = nearbyUsers.filter(user =>
            (user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                user.email.toLowerCase().includes(keyword.toLowerCase())) &&
            !currentChat.users.some(chatUser => chatUser.id === user.id) && // 이미 그룹에 포함된 멤버 제외
            !Array.from(groupMember).some(member => member.id === user.id) // 이미 초대된 멤버 제외
        );
        dispatch(searchUser({ keyword, token, filteredUsers }));
    };

    const handleInvite = () => {
        if (currentChat) {
            Array.from(groupMember).forEach((member) => {
                dispatch(inviteUserToGroup(currentChat.id, member.id, token));
            });
        }
        setInviteMode(false); // 초대 완료 후 초대 모드 종료
    };

    return (
        <div className="w-full h-full">
            <div>
                <div className="flex items-center space-x-10 bg-[#069b60] text-white pt-16 px-10 pb-5">
                    <BsArrowLeft className="cursor-pointer text-2xl font-bold" onClick={() => setInviteMode(false)} />
                    <p className="text-xl font-semibold">Invite Friends</p>
                </div>

                <div className="relative bg-white py-4 px-3">
                    <div className="flex space-x-2 flex-wrap space-y-1">
                        {groupMember.size > 0 &&
                            Array.from(groupMember).map((item, index) => (
                                <SelectedMember
                                    key={index}
                                    handleRemoveMember={removeMember}
                                    member={item}
                                />
                            ))}
                    </div>

                    <input
                        type="text"
                        className="outline-none border-b border-[#8888] p-2 w-[93%]"
                        placeholder="Search user"
                        value={query}
                        onChange={(e) => {
                            handleSearch(e.target.value);
                            setQuery(e.target.value);
                        }}
                    />
                </div>

                <div className="bg-white overflow-y-scroll h-[50.3vh]">
                    {query &&
                        auth.searchUser?.map((item) => (
                            <div
                                onClick={() => {
                                    addMember(item);
                                    setQuery("");
                                }}
                                key={item?.id}
                            >
                                <hr />
                                <ChatCard userImg={item.profile} name={item.name} />
                            </div>
                        ))}
                </div>

                <div className="bottom-10 py-10 bg-slate-200 items-center justify-center flex">
                    <div
                        onClick={handleInvite}
                        className="bg-green-600 rounded-full p-4 cursor-pointer"
                    >
                        <span className="text-white font-bold text-3xl">Invite</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteFriends;
