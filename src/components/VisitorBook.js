import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
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

  div {
    width: 70%;
    background-color: white;
    border-radius: 20px;
    padding: 40px;
    background-color: rgb(40, 45, 78);

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
          border: 1px solid #e0e0e0;
          padding: 10px;
          resize: none;
          background-color: rgb(40, 45, 78);
          color: white;
          font-family: "Source Sans Pro", sans-serif;

          &:focus {
            outline: none;
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
      border-bottom: 1px solid #e0e0e0;
      color: white;
      width: 100%;
    }
  }
`;

const VisitorsBook = (props) => {
  const { isUser } = props;
  const {
    location: { pathname },
  } = window;

  const pathSplit = pathname?.split("/");
  const roomId = pathSplit[pathSplit?.length - 1];

  const [isVisitorComment, setIsVisitorComment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: get  visitor's book item list
  const isGetVisitorsBookList = async () => {
    try {
      setIsLoading(true);
      // const requestResult = await
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isGetVisitorsBookList();
  }, []);

  const onSubmitVisitorBookComment = async () => {
    try {
      setIsLoading(true);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        alert("완료되었습니다.");
        isGetVisitorsBookList();
      }, 3000);
    }
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <VisitorBookWrap>
        <VisitorBookContainer>
          <div>
            <h2>방명록</h2>
            <ul>{/* list */}</ul>
          </div>
          <div>
            <p>
              <h2>방명록 작성</h2>
              <textarea />
            </p>
            <button onClick={onSubmitVisitorBookComment}>작성 완료</button>
          </div>
        </VisitorBookContainer>
      </VisitorBookWrap>
    </>
  );
};

export default VisitorsBook;
