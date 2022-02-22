import React, { useState } from "react";
import styled from "styled-components";
import { BACKGROUND_COLOR } from "../config/color";
import { FaDesktop } from "react-icons/fa";
import {
  MdDesktopWindows,
  MdOutlineDesktopAccessDisabled,
} from "react-icons/md";

const ScreenContainer = styled.div`
  display: block;
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${BACKGROUND_COLOR};
    padding: 14px;
    border-radius: 20px;

    button {
      border: none;
      background-color: transparent;
      cursor: pointer;
    }
  }
`;

const ScreenBottomBar = () => {
  const [isShareScreen, isSetShareScreen] = useState(false);

  const onHnadleShareMonitor = () => {
    isSetShareScreen(!isShareScreen);
  };
  return (
    <ScreenContainer id="screenSharing">
      <div>
        <button
          onClick={onHnadleShareMonitor}
          id="myFaceBtn"
          disabled={!isShareScreen}
        >
          <MdOutlineDesktopAccessDisabled color="white" size="18" />
        </button>
        <button
          id="shareBtn"
          onClick={onHnadleShareMonitor}
          disabled={isShareScreen}
        >
          <MdDesktopWindows color="white" size="18" />
        </button>
      </div>
    </ScreenContainer>
  );
};

export default ScreenBottomBar;
