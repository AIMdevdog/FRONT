import { useEffect } from "react";
import { useLocation } from "react-router";
import { Overworld } from "../game/Overworld";
import { Person } from "../game/Person";
import React from 'react';
const Room = () => {
  const location = useLocation();
  console.log(location);
  const charSrc = location.state || "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-sb7g6nQb3ZYxzNHryIbM.png";
  console.log(charSrc);
  useEffect(() => {
    Overworld(
      {
        config: document.querySelector(".game-container"),
        Room: {
          RoomSrc: "https://aim-image-storage.s3.ap-northeast-2.amazonaws.com/map2.png",
          id: 123,
          gameObjects: {
            player: new Person({
              id: null,
              isPlayerControlled: true,
              x: 80,
              y: 80,
              src: charSrc,
            }),
          },
        },
        otherMaps: [
          {
            x: 16,
            y: 448,
            url: 'http://localhost:3000/room1',
          }
        ]
      }
    )
    // overworld.init();
  }, []);


  useEffect(() => {
    
const getMedia = async () =>  {
  
  const myFace = document.querySelector("#myFace");
  
  const cameraConstraints = {
    audio: true,
    video: true,
  };

  try {
    const myStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
    console.log(myStream)
    // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
    myFace.srcObject = myStream;
    // myFace.muted = true;

    } catch (error) {
      console.log(error);
    }
  }

  getMedia();
  }, [])

  return (
    <>
      <div className="game-container" style={{ backgroundColor: "black", display: "block" }}>
        
        <canvas className="game-canvas"></canvas>
      </div>
      <div style={{position: "fixed", right: 0, bottom: 0, width: 200, height: 200, backgroundColor: 'white'}}>
        
        <video id="myFace" autoplay="autoplay" style={{width: 200, height: 200}}></video>
      </div>
    </>
  );
};

export default Room;
