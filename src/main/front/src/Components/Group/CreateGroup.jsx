import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";

// CreateGroup 컴포넌트 정의
const CreateGroup = ({ setIsGroup }) => {
    // 새로운 그룹 생성 여부를 관리하는 상태
    const [newGroup, setNewGroup] = useState(false);
    // 선택된 그룹 멤버를 저장하는 상태 (Set 자료구조 사용)
    const [groupMember, setGroupMember] = useState(new Set());
    // 사용자 검색 쿼리를 저장하는 상태
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    // 로컬 스토리지에서 사용자의 토큰을 가져옴
    const token = localStorage.getItem("token");

    // 그룹에서 멤버를 제거하는 함수
    const handleRemoveMember = (item) => {
        const updatedMembers = new Set(groupMember);
        updatedMembers.delete(item);
        setGroupMember(updatedMembers);
    };

    // 키워드를 기반으로 사용자를 검색하는 함수
    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }));
    };

    return (
        <div className="w-full h-full">
            {/* 새로운 그룹 생성 여부에 따른 조건부 렌더링 */}
            {!newGroup && (
                <div>
                    {/* 헤더 부분 */}
                    <div className="flex items-center space-x-10 bg-[#069b60] text-white pt-16 px-10 pb-5">
                        <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
                        <p className="text-xl font-semibold">Add Participants</p>
                    </div>

                    <div className="relative bg-white py-4 px-3">
                        {/* 그룹 멤버 표시 및 제거 기능 */}
                        <div className="flex space-x-2 flex-wrap space-y-1">
                            {groupMember.size > 0 &&
                                Array.from(groupMember).map((item, index) => (
                                    <SelectedMember
                                        key={index}
                                        handleRemoveMember={(item) => handleRemoveMember(item)}
                                        member={item}
                                    />
                                ))}
                        </div>

                        {/* 그룹 멤버 추가 입력란 */}
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

                    {/* 검색 결과 표시 */}
                    <div className="bg-white overflow-y-scroll h-[50.3vh]">
                        {query &&
                            auth.searchUser?.map((item) => (
                                <div
                                    onClick={() => {
                                        groupMember.add(item);
                                        setGroupMember(groupMember);
                                        setQuery("");
                                    }}
                                    key={item?.id}
                                >
                                    <hr />
                                    <ChatCard userImg={item.profile} name={item.name} />
                                </div>
                            ))}
                    </div>

                    {/* 다음 단계로 넘어가는 버튼 */}
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

            {/* 새로운 그룹 생성 컴포넌트 렌더링 */}
            {newGroup && (
                <NewGroup groupMember={groupMember} setIsGroup={setIsGroup} />
            )}
        </div>
    );
};

export default CreateGroup;
