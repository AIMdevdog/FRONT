import React, { useState } from "react";
import styled from "styled-components";

const PictureContainer = styled.div`
    position: fixed;
    overflow-y: scroll;
    z-index: 60;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    padding: 20px;

    background-color: rgb(0, 0, 0, 0.6);
    .layout{
        margin-left: 152px;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .layout2{
        margin-left: 342px;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
`;
const Frame = styled.div` 
    margin-right: 20px;
    padding: 20px;
    height: 100vh;
    background-color: rgb(255, 235, 205, 1);
    border-radius: 5px;
    img{
        position: relative;
        display:block;
        top:50%;
        transform: translateY(-50%);
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        outline: 5px solid black;
    }
`;
const PictureInfoContainer = styled.div`
    width: 300px;
    min-width: 300px;
    height: 100vh;
    background-color: #FFEBCD;
    border-radius: 5px;
`;
const Cursor = styled.div`
    img{
        z-index = 99;
        width: 24px;
        height: 24px;
        outline: none;
    }
`;

const PictureFrame = ({collapsed}) => {
    return (
        <PictureContainer>
            <div className={collapsed? "layout": "layout2"}>
                <Frame>
                    <img src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80" />
                    <Cursor className="draw"></Cursor>
                </Frame>
                <PictureInfoContainer> hello </PictureInfoContainer>
            </div>
        </PictureContainer>
    );
}


export default PictureFrame;