import moment from "moment";
import React, { useEffect, useState } from "react";
import { GiBroom } from "react-icons/gi";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { room } from "../config/api";
import LoadingComponent from "./Loading";

const VisitorBookWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
`;

const VisitorBookContainer = styled.div`
  max-width: 1024px;
  min-width: 1024px;
  height: 60vh;
  display: flex;
`;

const VisitorBookListContainer = styled.div`
  width: 70%;
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  background-color: rgb(40, 45, 78);
  overflow-y: scroll;

  &:nth-child(2) {
    width: 30%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    p {
      width: 100%;
      height: 100%;

      textarea {
        width: 100%;
        min-height: 70%;
        border-radius: 10px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 16px;
        resize: none;
        background-color: rgb(40, 45, 78);
        color: white;
        font-family: "Source Sans Pro", sans-serif;

        &:focus {
          outline: none;
        }

        &::placeholder {
          font-size: 16px;
        }
      }
    }

    button {
      width: 100%;
      padding: 12px 10px;
      border: none;
      background-color: rgb(84, 92, 143);
      border-radius: 10px;
      color: white;
      font-weight: 600;
    }
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    color: white;
    width: 100%;
  }
`;

const VisitorContentItemContainer = styled.li`
  position: relative;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;

  &:last-child {
    border: none;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
  }
`;

const VisitorEditDeleteBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 0;
  top: 12px;

  span {
    color: rgb(202, 216, 255);
    font-size: 12px;
  }
`;

const VisitorContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;

  div {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    p {
      text-align: right;

      span {
        color: rgb(202, 216, 255);
        font-size: 12px;
      }

      img {
        object-fit: none;
        object-position: 0px -20px;
        margin-right: 6px;
        width: 32px;
        height: 36px;
        image-rendering: pixelated;
        -webkit-transform: scale(1.25);
        -ms-transform: scale(1.25);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        transform: scale(1);
      }
    }
  }
`;

const VisitorContentTextBox = styled.p`
  width: 100%;
  padding: 20px;
  background-color: rgb(84, 92, 143);
  border-radius: 10px;

  span {
    color: white;
  }
`;

const VisitorContentTimestamp = styled.p`
  margin-top: 10px;
  text-align: right;

  span {
    color: #adadad;
    font-size: 12px;
  }
`;

const EmptyContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  div {
    margin-left: 20px;
    line-height: 22px;
    color: rgb(202, 216, 255);
  }
`;

const VisitorsBook = (props) => {
  const { isUser } = props;
  const {
    location: { pathname },
  } = window;

  const pathSplit = pathname?.split("/");
  const roomId = pathSplit[pathSplit?.length - 1];

  const [isAllVisitBookContent, setIsAllVisitBookContent] = useState([]);
  const [isContent, setIsContent] = useState("");
  const [isVisitorComment, setIsVisitorComment] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // TODO: get  visitor's book item list
  const isGetVisitorsBookList = async () => {
    try {
      setIsLoading(true);
      const requestResult = await room.getVisitorBookComment(roomId);
      const {
        data: { data },
      } = requestResult;
      setIsAllVisitBookContent(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isGetVisitorsBookList();
  }, []);

  const onContentChange = (e) => {
    const {
      target: { value },
    } = e;
    setIsContent(value);
  };

  const onSubmitVisitorBookComment = async () => {
    if (!isContent) return alert("글을 입력해주세요.");
    try {
      setIsLoading(true);
      await room.createVisitorBookComment(roomId, isContent);
    } catch (e) {
      console.log(e);
    } finally {
      alert("완료되었습니다.");
      setIsContent("");
      setIsLoading(false);
      isGetVisitorsBookList();
    }
  };

  const onContentDelete = async (boardId) => {
    try {
      setIsLoading(true);
      await room.deleteVisitorBookComment(boardId);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      isGetVisitorsBookList();
    }
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <VisitorBookWrap>
        <VisitorBookContainer>
          <VisitorBookListContainer>
            <h2>방명록</h2>
            <ul style={{ height: "100%" }}>
              {isAllVisitBookContent?.length > 0 ? (
                <>
                  {isAllVisitBookContent?.map((content, idx) => {
                    const {
                      Aim_user_info: { nickname, character, id: userId },
                      contents,
                      createdAt,
                      id,
                    } = content;
                    return (
                      <VisitorContentItemContainer key={idx}>
                        {userId === isUser?.id && (
                          <VisitorEditDeleteBox>
                            {/* <button style={{ marginRight: 10 }}>
                          <span
                            style={{ color: "rgb(202,216,255)", fontSize: 12 }}
                          >
                            수정
                          </span>
                        </button> */}
                            <button onClick={() => onContentDelete(id)}>
                              <span>삭제</span>
                            </button>
                          </VisitorEditDeleteBox>
                        )}

                        <VisitorContentBox>
                          <div>
                            <p>
                              <img src={character} alt="character" />
                            </p>
                            <p>
                              <span>{nickname}</span>
                            </p>
                          </div>
                        </VisitorContentBox>
                        <VisitorContentTextBox>
                          <span>{contents}</span>
                        </VisitorContentTextBox>
                        <VisitorContentTimestamp>
                          <span>{moment(createdAt).fromNow()}</span>
                        </VisitorContentTimestamp>
                      </VisitorContentItemContainer>
                    );
                  })}
                </>
              ) : (
                <EmptyContentContainer
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <GiBroom color="white" size="40" />
                  <div>
                    <span>방명록이 없습니다.</span>
                    <br />
                    <span>방명록을 작성해주세요.</span>
                  </div>
                </EmptyContentContainer>
              )}
            </ul>
          </VisitorBookListContainer>
          <VisitorBookListContainer>
            <h2>방명록 작성</h2>
            <p>
              <textarea
                placeholder={"찾아주셔서 감사합니다.\n방명록을 작성해주세요."}
                style={{ fontSize: 16 }}
                value={isContent}
                onChange={onContentChange}
              />
            </p>
            <button onClick={onSubmitVisitorBookComment}>작성 완료</button>
          </VisitorBookListContainer>
        </VisitorBookContainer>
      </VisitorBookWrap>
    </>
  );
};

export default VisitorsBook;
