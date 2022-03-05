import React from "react";
import styled from "styled-components";

const NicknameContainer = styled.div`
    span {
        color: white;
    }
  .nickname{
    transform: translateX(-25%);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 6px;
    border-radius: 6px;
    color: white;
    font-size: 12px;
    text-align: center;
    position: absolute;
  }
`;


const CharacterNickname = ({ nicknames }) => {
    return (
        <NicknameContainer>
            {nicknames.map(function (nickname) {
                return <div className="nickname" id={nickname} key={nickname} >{nickname}</div>
            })}
        </NicknameContainer>
    )
}

export default CharacterNickname;