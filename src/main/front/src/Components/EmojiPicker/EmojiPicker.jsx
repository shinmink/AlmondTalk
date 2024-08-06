import React from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import styled from 'styled-components';

// 스타일드 컴포넌트 정의
const StyledPickerWrapper = styled.div`
    position: absolute;
    top: 60px; /* 채팅 리스트의 상단에서 약간의 여백을 둠 */
    left: 10px;
    z-index: 10;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px; /* 이모티콘 선택기의 너비 설정 */
    height: 350px; /* 이모티콘 선택기의 높이 설정 */
`;


const EmojiPicker = ({ onSelect }) => {
    return (
        <div className="emoji-picker">
            <Picker data={data} onEmojiSelect={onSelect} />
        </div>
    );
};

export default EmojiPicker;