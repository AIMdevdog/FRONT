import React, { useState } from "react";
import {
  FaVideoSlash,
  FaVideo,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeOff,
} from "react-icons/fa";
import styled from "styled-components";

const ButtonContainer = styled.button`
  position: absolute;
  width: 52%;
  bottom: 60px;
  border-radius: 50%;
  /* border: 1px solid red; */
  border: none;
  background-color: transparent;

  &:nth-child(2) {
    left: 40%;
  }
`;

const VideoButton = () => {
  const [isVideo, isSetVideo] = useState(false);
  const [isVoice, isSetVoice] = useState(false);

  const onHandleVideo = () => {
    isSetVideo(!isVideo);
  };
  const onHandleVoice = () => {
    isSetVoice(!isVoice);
  };

  return (
    <>
      <ButtonContainer id="playerCamera" onClick={onHandleVideo}>
        {isVideo ? (
          <FaVideo color={"white"} />
        ) : (
          <FaVideoSlash color={"white"} />
        )}
      </ButtonContainer>
      <ButtonContainer id="playerMute" onClick={onHandleVoice}>
        {isVoice ? (
          <FaVolumeUp color={"white"} />
        ) : (
          <FaVolumeMute color={"white"} />
        )}
      </ButtonContainer>
    </>
  );
};

export default VideoButton;
