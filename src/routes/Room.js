import { useEffect } from "react";
import { Overworld } from "../game/Overworld";

const Room = () => {
  useEffect(() => {
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
    });
    overworld.init();
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
