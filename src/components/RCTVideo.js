import { useRef, useEffect } from "react";
import Slider from "react-slick";
import styled from "styled-components";

const UserStreamDiv = styled.div`
  width: 200px;
  margin-right: 20px;
`;

const UserVideoTag = styled.video`
  width: 200px;
  border-radius: 10px;
  /*Mirror code starts*/
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */

  /*Mirror code ends*/
  &:hover {
    outline: 2px solid red;
    cursor: pointer;
  }
`;

const UserVideoNickname = styled.div`
  position: relative;
  bottom: 140px;
  left: 5px;
  display: inline;
  background-color: rgb(0, 0, 0, 0.6);
  padding: 5px;
  border-radius: 10px;
  color: white;
`;

const RTCVideo = ({ mediaStream }) => {
  const { peerStream, nickname, id } = mediaStream;
  const viewRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (!viewRef.current) return;
    viewRef.current.srcObject = peerStream ? peerStream : null;
  }, [peerStream]);

  return (
    <UserStreamDiv id={id}>
      <UserVideoTag
        ref={viewRef}
        muted={false}
        autoPlay
        controls
      ></UserVideoTag>
      <UserVideoNickname>{nickname}</UserVideoNickname>
    </UserStreamDiv>
  );
};

export default RTCVideo;
