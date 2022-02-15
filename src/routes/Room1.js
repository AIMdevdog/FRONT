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
          RoomSrc: "https://www.comedywildlifephoto.com/images/wysiwyg/images/2020_winners/arthur-telle-thiemann_smiley_00000091.jpg",
          id: 123,
          roomNum: 1,
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
        adjust: {
          axios: 220,
          ratio: 1.70,
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
      <div className="game-container" style={{ backgroundColor: "black" }}>
        <canvas className="game-canvas"></canvas>
      </div>
    </>
  );
};

export default Room;
