import React, { useState } from "react";
import styled from "styled-components";
import { BsFillMicFill, BsFillMicMuteFill, BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { useLocation } from "react-router";

const SettingContainer = styled.div`
    width: 100vh;
    height: 100vh;
    background-color: rgb(32, 37, 64);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    overflow-y: auto;
    padding: 20px;
`;
const Layout = styled.div`
    display: flex;
    max-width: 660px;
    background-color: rgb(51, 58, 100);
    border-radius: 32px;
    padding: 40px;
    -webkit-box-flex: 1;
    flex-grow: 1;
    color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 25%) 0px 10px 30px;
    margin: auto;
    
    .layout{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
`;
const BodyLeft = styled.div`
    display: flex;
    flex: 1 0 0px;
    flex-direction: column;
    padding-right: 32px;
    align-items: center;
    span{
        font-weight: 600;
        font-size: 20px;
        color: rgb(255, 255, 255);
        line-height: 1.3;
        text-align: center;
        max-width: 220px;
        overflow-wrap: break-word;   
    }
`;
const CharacterContainer = styled.div`
    display: flex;
    padding-top: 32px;
    padding-bottom: 32px;
`;
const CharacterBox = styled.div`
    background-color: rgb(144, 173, 255);
    border: 8px solid rgb(202, 216, 255);
    border-radius: 24px;
    padding: 24px 16px;
    -webkit-box-flex: 1;
    flex-grow: 1;
    width: 216px;
    height: 256px;
    img{
        width: 144px;
        height: 288px;
        margin: 0px 12px;
        object-fit: cover;
        object-position: 0px -72px;
        image-rendering: pixelated;
        transform: translate3d(0px, 0px, 0px);
    }
`;
const BodyRight = styled.div`
    display: flex;
    flex: 2 0 0px;
    flex-direction: column;
    padding-left: 32px;
`;
const CameraContainer = styled.div`
    position: relative;
    height: 0px;
    border-radius: 24px;
    overflow: hidden;
    background-color: rgb(17, 17, 17);
    padding-bottom: 66%;
    margin-left: 40px;
    .camBox{
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
    }
`;
const CameraSpan = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    span{
        font-weight: 600;
        font-size: 14px;
        color: rgb(255, 255, 255);
        background-color: rgba(17, 17, 17, 0.75);
        border-radius: 24px;
        padding: 8px 9px;
        text-align: center;
        line-height: 20px;
    }
`;

const DiviceIcon = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-grow: 1;
    padding-left: 8px;
    padding-right: 8px;
`;

const IconBtn = styled.div`
    display: flex;
    padding-bottom: 8px;
    button{
        background: transparent;
        border: 0px;
        outline: 0px;
        margin: 0px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        opacity: 1;
        cursor: pointer;
    }
    div{
        margin-left: 20px;
    }
`;

const Settings = styled.div`
    display: flex;
    padding-top: 24px;
    flex-direction: column;
    justify-content: center;
`;
const CameraSetting = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding-top: 4px;
    padding-bottom: 4px;
`;
const CameraIcon = styled.div`
    display: flex;
    padding-right: 16px;
`;
const CameraSelectLayout = styled.div`
    display: block;
    flex-grow: 1;
`;
const CameraSelectContainer = styled.div`
    position: relative;
    box-sizing: border-box;
    width: 100%;
`;
const CameraSelectBox = styled.div`
    -webkit-box-align: center;
    align-items: center;
    background-color: rgb(235, 240, 255);
    border-color: transparent;
    border-radius: 16px;
    border-style: solid;
    border-width: 0px;
    box-shadow: none;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    min-height: 48px;
    position: relative;
    transition: all 0.2s ease -0.1s;
    box-sizing: border-box;
    opacity: 1;
    outline: 0px !important;
`;
const CameraSingleValue = styled.div`
    padding: 10px;
    div{
        color: rgb(32, 37, 64);
        margin-left: 2px;
        margin-right: 2px;
        max-width: calc(100% - 8px);
        overflow: hidden;
        position: absolute;
        text-overflow: ellipsis;
        white-space: nowrap;
        top: 50%;
        transform: translateY(-50%);
        box-sizing: border-box;
        font-size: 15px;
        font-weight: 600;
    }
`;
const IndicatorContainer = styled.div`
    -webkit-box-align: center;
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-shrink: 0;
    box-sizing: border-box
    padding: 2px;
    div{
        color: rgb(204, 204, 204);
        display: flex;
        padding: 8px;
        transition: color 150ms ease 0s;
        box-sizing: border-box;
    }
`;

const BtnContainer = styled.div`
display: flex;
padding-top: 32px;
justify-content: center;
`;
const BtnLayout = styled.div`
    display: flex;
    max-width: 256px;
    flex-grow: 1;
`;
const JoinBtn = styled.button`
    display: flex;
    position: relative;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    cursor: pointer;
    opacity: 1;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
`;

const SettingPage = () => {
    const location = useLocation();
    // console.log(location);
    const { userData, roomId } = location.state;
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);
    const [camArrow, setCamArrow] = useState(false);

    const onMicBtn = () => {
        setMicOn(!micOn);
    }
    const onCamBtn = () => {
        setCamOn(!camOn);
    }
    const enterRoom = () => {
        console.log("hello");
        window.location.href = `http://localhost:3000/room/${roomId}`
    }
    return (
        <SettingContainer>
            <Layout>
                <div className="layout">
                    <div style={{ display: "flex" }}>
                        <BodyLeft>
                            <span> Welcome {userData?.nickname}! </span>
                            <CharacterContainer>
                                <CharacterBox>
                                    <img src={userData?.character} />
                                </CharacterBox>
                            </CharacterContainer>
                        </BodyLeft>
                        <BodyRight>
                            <CameraContainer>
                                <div className="camBox">
                                    <div>
                                        <video></video>
                                    </div>
                                </div>
                                <div className="camBox">
                                    <CameraSpan>
                                        {micOn ? null : <span> You are muted</span>}
                                        <span> Your camera is off </span>
                                    </CameraSpan>
                                </div>
                                <div className="camBox">
                                    <DiviceIcon>
                                        <IconBtn>
                                            <div onClick={onMicBtn}>
                                                {micOn ? <BsFillMicFill size={20} color="white" /> : <BsFillMicMuteFill size={20} color="red" />}
                                            </div>
                                            <div onClick={onCamBtn}>
                                                {camOn ? <BsFillCameraVideoFill size={20} color="white" /> : <BsFillCameraVideoOffFill size={20} color="red" />}
                                            </div>
                                        </IconBtn>
                                    </DiviceIcon>
                                </div>
                            </CameraContainer>
                            <Settings>
                                <CameraSetting>
                                    <CameraIcon>
                                        <BsFillCameraVideoFill size={24} />
                                    </CameraIcon>
                                    <CameraSelectLayout>
                                        <CameraSelectContainer>
                                            <CameraSelectBox>
                                                <CameraSingleValue>
                                                    <div> FaceTime HD Camera </div>
                                                </CameraSingleValue>
                                                <IndicatorContainer>
                                                    <div>
                                                        {camArrow ? <IoIosArrowUp color="rgb(32, 37, 64)" /> : <IoIosArrowDown size={24} color="rgb(32, 37, 64)" />}
                                                    </div>
                                                </IndicatorContainer>
                                            </CameraSelectBox>
                                        </CameraSelectContainer>
                                    </CameraSelectLayout>
                                </CameraSetting>
                                {/* <MikeSetting></MikeSetting>
                                <VolumeSetting></VolumeSetting> */}
                            </Settings>
                        </BodyRight>
                    </div>
                    <BtnContainer>
                        <BtnLayout>
                            <JoinBtn onClick={enterRoom}>
                                방에 참여하기
                            </JoinBtn>
                        </BtnLayout>
                    </BtnContainer>
                    {/* <Footer>

                    </Footer> */}
                </div>
            </Layout>
        </SettingContainer>
    )
}





export default SettingPage;