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
  // -webkit-justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgb(0, 0, 0, 0.7);
`;

const ExhibitionGuideContainer = styled.div`

    max-width: 1200px;
    color: white;  
    margin: 80px;
    background-color: rgb(51,58,100);
    line-height: 30px;
    border-radius: 20px;
    padding: 40px;
  div {
    // width: 70%;
    font-size: 25px;
    // padding: 40px;
    margin-top: 20px;
    }
  h2 {
    font-size: 40px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    // color: white;
    width: 100%;
  }
  .drawing{
    border-top: 2px solid #e0e0e0;
  }
`;

const ExhibitionGuide = ({ title = "안녕", description = "안녕하세요.", drawing}) => {
  return (
    <ExhibitionGuideWrap>
      <ExhibitionGuideContainer>
        <h2>{title}</h2>
        {description.map((v, i) => <div key={"guide" + i}>{v}</div>)}
        {drawing ?
          <div className="drawing">
            {drawing.map((v, i) => <div key={"draw" + i}> {v}</div>)}
          </div> : null
        }
      </ExhibitionGuideContainer>
    </ExhibitionGuideWrap>
  );
};

export default ExhibitionGuide;
