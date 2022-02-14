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

  return (
    <>
      <div className="game-container" style={{ backgroundColor: "black", display: "block" }}>
        <canvas className="game-canvas"></canvas>
      </div>
    </>
  );
};

export default Room;
