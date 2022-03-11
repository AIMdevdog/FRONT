import React, { Suspense } from "react";
import styled from "styled-components";
import Gallery1 from "./Gallery1";

const CanvasContainer = styled.div`
  position: fixed;
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;
const ThreeCanvas = ({ isImageLoad, images, cameraAngle, setCameraAngle, cameraPosition, yCameraPosition }) => {
  return (
    <>
      {isImageLoad ?
        <CanvasContainer className="gallery">
          <Suspense fallback={null}>
            <Gallery1 images={images} cameraAngle={cameraAngle} setCameraAngle={setCameraAngle} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
          </Suspense>
        </CanvasContainer>
        : null}

    </>

  );
}

export default ThreeCanvas;