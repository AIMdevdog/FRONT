import React from "react";
import styled from "styled-components";

const ScreenContainer = styled.div`
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
`;

const ScreenBottomBar = () => {
  return (
    <ScreenContainer id="screenSharing">
      <button id="shareBtn">Share</button>
      <button id="myFaceBtn">myFace</button>
    </ScreenContainer>
  );
};

export default ScreenBottomBar;
