import { useEffect } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

const GameContainer = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
  background: red;
`;

const GameCanvas = styled.canvas`
  width: 500px;
  height: 300px;
  outline: 1px solid solid #fff;
`;

const Room = () => {
  useEffect(() => {
    console.log(1);
  });
  const { roomId } = useParams();
  return (
    <GameContainer>
      <GameCanvas></GameCanvas>
    </GameContainer>
  );
};

export default Room;
