import React, { Suspense } from "react";
import styled from "styled-components";
import Gallery1 from "./Gallery1";

const CanvasContainer = styled.div`
  position: fixed;
  opacity: ${(props) => props.angleCheck};
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const ThreeCanvas = ({ idx, images, cameraAngle, setCameraAngle, cameraPosition, yCameraPosition }) => {
    return (
        <CanvasContainer angleCheck={idx === cameraAngle ? 0 : 1} className="gallery">
            <Suspense fallback={null}>
                <Gallery1 images={images} cameraAngle={cameraAngle} setCameraAngle={setCameraAngle} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
            </Suspense>
        </CanvasContainer>
    );
}

export default ThreeCanvas;