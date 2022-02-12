import React, { useState } from "react";
import Lottie from "react-lottie";
import styled from "styled-components";
import ThumbsUp from "../assets/lottie/lf30_editor_shtnllxd_white.json";

const LottieTag = styled.div`
  width: 100%;
  height: 100vh;
  background: rgb(0, 0, 0, 0.6);
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const lottieOptions = {
  animationData: ThumbsUp,
  loop: true,
  autoplay: true,
  rendererSettings: {
    className: "add-class", // svg에 적용
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ThumbsUpComponent = () => {
  const [isStopped, SetIsStopped] = useState(false);
  const [isPaused, SetIsPaused] = useState(false);

  const onStop = () => {
    SetIsStopped(!isStopped);
  };

  const onPause = () => {
    SetIsPaused(!isPaused);
  };

  return (
    <LottieTag>
      <Lottie
        options={lottieOptions}
        // isStopped={isStopped}
        // isPaused={isPaused}
        // autoplay={true}
        isClickToPauseDisabled={false}
        style={{
          width: 100,
          height: 100,
        }} // svg의 부모 LottieTag에 적용
        eventListeners={[
          {
            eventName: "complete",
            callback: () => console.log("the animation completed"),
          },
        ]}
      />
      {/* <button onClick={onPause}>Play/Pause</button> */}
    </LottieTag>
  );
};

export default ThumbsUpComponent;
