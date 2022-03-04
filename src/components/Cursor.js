import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Cursor = styled.img.attrs((props) => ({
    style: {
        left: props.isCursorX + "px",
        top: props.isCursorY + "px",
    },
}))`
    z-index: 99;
    width: 24px;
    height: 24px;
    outline: none;
    position: fixed;
`;

const CursorNickname = styled.div.attrs((props) => ({
    style: {
        left: props.isCursorX + 16 + "px",
        top: props.isCursorY + 20 + "px",
    },
}))`
    font-size: 12px;
    z-index: 99;
    position: fixed;
    bottom: 140px;
    height: 16px;
    background-color: rgb(0, 0, 0, 0.6);
    padding: 3px;
    border-radius: 5px;
    color: white;
`;
const DrawCursor = ({ socket, nickname }) => {
    const [isCursorX, setIsCursorX] = useState(0);
    const [isCursorY, setIsCursorY] = useState(0);
    socket.on("shareCursorPosition", (xRatio, yRatio, socketNickname) => {
        const frame = document.querySelector(".frame");
        if (nickname == socketNickname) {
            setIsCursorX(frame.offsetLeft + xRatio * frame.clientWidth);
            setIsCursorY(yRatio * frame.clientHeight);
        }
    });
    return (
        <>
            <CursorNickname
                isCursorX={isCursorX}
                isCursorY={isCursorY}
            >{nickname}</CursorNickname>
            <Cursor
                isCursorX={isCursorX}
                isCursorY={isCursorY}
                className="cursor"
                src="https://img.icons8.com/ios-glyphs/344/cursor--v1.png"
                alt="img"
            />
        </>
    )
}


export default DrawCursor;