import React, { useState } from "react";
import styled from "styled-components";

const PictureContainer = styled.div`
    display: flex;
    position: absolute;
    overflow-y: scroll;
    z-index: 1;
    min-width: 100%;
    min-height: 100%;
    padding: 20px;
    background-color: rgb(0, 0, 0, 0.6);
    padding-left: 362px;
    .layout{
        margin:auto;
        height: 100%;
        display: flex;
    }
`;
const Frame = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position:relative;
    margin-right: 20px;
    height: 100%;
    background-color: rgb(255, 235, 205, 1);
    border-radius: 5px;
    img{
        position: relative;
        display:block;
        width: 100%;
        // height: 800px;
        margin: auto;
        outline: 5px solid black;
    }
`;
const PictureInfoContainer = styled.div`
    width: 300px;
    min-width: 300px;
    min-height: 100%;
    background-color: rgb(255, 235, 205, 1);
    border-radius: 5px;
`;
const Cursor = styled.div`
    position: absolute;   
    height: 100%;
    width: 100%;
    background-color: rgb(0, 0, 0, 0);  
    z-index = 12;
    img{
        z-index = 15 !important;
        position: absolute;
        width: 24px;
        height: 24px;
        outline: none;
        // transform: translate(-50%, -50%);
    }
`;

const PictureFrame = ({ collapsed }) => {
    return (
        <>
            <PictureContainer>
                <div className="layout">
                    <Frame className="frame">
                        <img src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1672&q=80" />
                        <Cursor className="draw"></Cursor>
                    </Frame>
                    <PictureInfoContainer> Lorem </PictureInfoContainer>
                </div>
            </PictureContainer>
        </>
    );
}


export default PictureFrame;