import React from "react";
import styled from "styled-components";

const ExhibitionGuideWrap = styled.div`
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

const ExhibitionGuideContainer = styled.div`
  max-width: 1024px;
  min-width: 1024px;
  height: 60vh;

  display: flex;

  div {
    width: 70%;
    background-color: white;
    border-radius: 20px;
    padding: 40px;
    background-color: white;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
      // color: white;
      width: 100%;
    }
  }
`;

const ExhibitionGuide = ({ title = "안녕", description = "안녕하세요." }) => {
  return (
    <ExhibitionGuideWrap>
      <ExhibitionGuideContainer>
        <div>
          <h2>{title}</h2>
          <ul>{description}</ul>
        </div>
      </ExhibitionGuideContainer>
    </ExhibitionGuideWrap>
  );
};

export default ExhibitionGuide;
