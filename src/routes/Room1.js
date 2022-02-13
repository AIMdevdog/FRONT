import { useEffect } from "react";
import { Overworld } from "../game/Overworld";
import { Person } from "../game/Person";

const Room = () => {
  const charSrc = "https://dynamic-assets.gather.town/sprite/avatar-M8h5xodUHFdMzyhLkcv9-IJzSdBMLblNeA34QyMJg-qskNbC9Z4FBsCfj5tQ1i-KqnHZDZ1tsvV3iIm9RwO-g483WRldPrpq2XoOAEhe-MPN2TapcbBVMdbCP0jR6.png";
  useEffect(() => {
    Overworld(
      {
        config: document.querySelector(".game-container"),
        Room: {
          RoomSrc: "https://raw.githubusercontent.com/gathertown/mapmaking/master/maps/templates/All%20Hands%20Room%20Medium/med_thumbnail2.png",
          id: 123,
          gameObjects: {
            player: new Person({
              id: null,
              isPlayerControlled: true,
              x: 400,
              y: 400,
              src: charSrc,
            }),
          },
        },
        otherMaps:[
          {
            x: 96,
            y: 336,
            url: 'http://localhost:3000/room',
          }
        ]
      }
    )
    // overworld.init();
  }, []);

  return (
    <>
      <div className="game-container">
        <canvas className="game-canvas"></canvas>
      </div>
    </>
  );
};

export default Room;
