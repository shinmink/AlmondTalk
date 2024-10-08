// CreateGroup.jsx
import { useState, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";
import useGroupMembers from "../../hooks/useGroupMembers"; // 커스텀 훅 가져오기

const CreateGroup = ({ setIsGroup, nearbyUsers  }) => {
    const [newGroup, setNewGroup] = useState(false);
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const token = localStorage.getItem("token");

    // 커스텀 훅 사용
    // 미리 채팅 생성자를 그룹 멤버에 추가하는 useEffect
    const { groupMember, addMember, removeMember } = useGroupMembers();
    useEffect(() => {
        if (auth.reqUser) {
            addMember(auth.reqUser);  // 채팅 생성자를 미리 그룹에 추가
        }
    }, [auth.reqUser]);

    const handleSearch = (keyword) => {
        // 이미 그룹에 포함된 멤버는 제외하고 검색
        const filteredUsers = nearbyUsers.filter(user =>
            (user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                user.email.toLowerCase().includes(keyword.toLowerCase())) &&
            !Array.from(groupMember).some(member => member.id === user.id) // 이미 선택된 멤버 제외
        );
        dispatch(searchUser({ keyword, token, filteredUsers }));
    };


    return (
        <div className="w-full h-full">
            {!newGroup && (
                <div>
                    <div className="flex items-center space-x-10 bg-[#069b60] text-white pt-16 px-10 pb-5">
                        <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
                        <p className="text-xl font-semibold">Add Participants</p>
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
                            onClick={() => {
                                setNewGroup(true);
                            }}
                            className="bg-green-600 rounded-full p-4 cursor-pointer"
                        >
                            <BsArrowRight className="text-white font-bold text-3xl" />
                        </div>
                    </div>
                </div>
            )}

            {newGroup && (
                <NewGroup groupMember={groupMember} setIsGroup={setIsGroup} />
            )}
        </div>
    );
};

export default CreateGroup;
