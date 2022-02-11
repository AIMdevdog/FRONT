import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Overworld } from "../game/Overworld";

const Room = () => {
  useEffect(() => {
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
    });
    overworld.init();
  });

  return (
    <>
      <div className="game-container">
        <canvas className="game-canvas"></canvas>
      </div>
      {/* <Helmet> */}
      {/* <script src="/src/game/init.js" type="text/javascript" /> */}
      {/* <script src="/Overworld.js"></script> */}
      {/* </Helmet> */}
    </>
  );
};

export default Room;
