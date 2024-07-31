// useGroupMembers.js
import { useState } from 'react';

const useGroupMembers = () => {
    const [groupMember, setGroupMember] = useState(new Set());

    const addMember = (member) => {
        setGroupMember((prevMembers) => new Set(prevMembers).add(member));
    };

    const removeMember = (member) => {
        setGroupMember((prevMembers) => {
            const updatedMembers = new Set(prevMembers);
            updatedMembers.delete(member);
            return updatedMembers;
        });
    };

    return {
        groupMember,
        addMember,
        removeMember,
    };
};

export default useGroupMembers;
