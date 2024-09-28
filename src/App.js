import { useEffect, useRef, useState } from "react";
import Workspace from "./components/Workspace";

import { motion } from "framer-motion";
import Sprite from "./components/Sprite";
function App() {
  const [motionStack, setMotionStack] = useState({
    sprite1: [],
  });

  
  // State to store available sprites
  const [spriteStore, setSpriteStore] = useState([ 
    {
      id: 1,
      name: "sprite_1",
      src: "https://via.placeholder.com/100x100.png?text=Sprite+1",
      currentPosition: { x: 0, y: 0, degree: 0 },
      motions:[],
      isPlaying: false,
    },
  ]);
  const [currentSprite, setCurrentSprite] = useState(spriteStore[0]);
  const [move, setMove] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [goto, setGoto] = useState({ x: 0, y: 0 });
  
  const [repeat, setRepeat] = useState(1);
  
  const handleMove = (value) => {
    console.log(currentSprite, "currentSprite");
    // currentSprite.motions.push({ type: "move", value: value });
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ type: "move", value: value });
          // return currentSprite;
        }
        return sprite;
      });
      return updatedStore;
    });
    // setMotionStack({
    //   ...motionStack,
    //   sprite1: [...motionStack["sprite1"], { type: "move", value: value }],
    // });
  };
  const handleRotate = (value) => {
  //  currentSprite.motions.push({ type: "rotate", value: value });
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ type: "rotate", value: value });
        //  return currentSprite;
        }
        return sprite;
      });
      return updatedStore;
    });
    // setMotionStack({
    //   ...motionStack,
    //   sprite1: [...motionStack["sprite1"], { type: "rotate", value: value }],
    // });
  };

  
const handlePlay=()=>{
  setSpriteStore((prevStore) => {
    const updatedStore = prevStore.map((sprite) => {
      sprite.isPlaying=true;
      return sprite;
    });
    return updatedStore;
  });
}

  const handleGoto = (value) => {
   // currentSprite.motions.push({ type: "goto", value: value });
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
        //  return currentSprite;
          sprite.motions.push({ type: "goto", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
    // setMotionStack({
    //   ...motionStack,
    //   sprite1: [...motionStack["sprite1"], { type: "goto", value: value }],
    // });
  };
  const handleRepeat = (value) => {
   // currentSprite.motions.push({ type: "repeat", value: value });
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
        //  return currentSprite;
          sprite.motions.push({ type: "repeat", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
    // setMotionStack({
    //   ...motionStack,
    //   sprite1: [...motionStack["sprite1"], { type: "repeat", value: value }],
    // });
    setRepeat(value);
  };
 

  // State to store sprites on the screen
  // const [screenSprites, setScreenSprites] = useState([]);
  const fileInputRef = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpriteStore((prevStore) => [
          ...prevStore,
          { id: Date.now(), name: file.name, src: reader.result, motions:[], currentPosition: { x: 0, y: 0, degree: 0 } },
        ]);
      };
      reader.readAsDataURL(file);

    }
  };
 
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };
  useEffect(() => {
    console.log(spriteStore, 'spriteStore updated')
  }, [spriteStore]);
  return (
    <div className="flex flex-col gap-2">
      <button className="bg-blue-400" onClick={handlePlay}>
        Play
      </button>
      <div className="bg-black flex gap-5 h-screen">
        <div className="bg-blue-400 w-1/2">
          <div draggable>
            move x
            <input
              type="text"
              value={move}
              onChange={(e) => setMove(e.target.value)}
            />
            <button onClick={() => handleMove(move)}>add move</button>
          </div>
          <div className="mt-2">
            rotate
            <input
              type="text"
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
            />
            <button onClick={() => handleRotate(rotate)}>add rotate</button>
          </div>
          <div className="mt-2">
            goto x
            <input
              className="w-1/12"
              type="text"
              value={goto.x}
              onChange={(e) =>
                setGoto((prev) => ({
                  ...prev,
                  x: e.target.value,
                }))
              }
            />
            y
            <input
              className="w-1/12"
              type="text"
              value={goto.y}
              onChange={(e) =>
                setGoto((prev) => ({
                  ...prev,
                  y: e.target.value,
                }))
              }
            />
            <button onClick={() => handleGoto(goto)}>add goto</button>
          </div>
          <div className="mt-2">
            repeat
            <input
              type="text"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            />
            <button onClick={() => handleRepeat(repeat)}>add repeat</button>
          </div>
        </div>

        <Workspace motionStack={currentSprite.motions} />
        <div className="flex flex-col w-1/2  h-screen">
          <div className="bg-white relative overflow-hidden h-1/2">
          {
          //  console.log(spriteStore)
            spriteStore?.map((sprite) => (
              <Sprite key={sprite.id} sprite={sprite} spriteStore={spriteStore} setSpriteStore={setSpriteStore} />
            ))
          }

         
          </div>
          <div className="bg-white">
            currentX: {Math.trunc(currentSprite.currentPosition.x)}
            currentY: {Math.trunc(currentSprite.currentPosition.y)}
            degree: {Math.trunc(currentSprite.currentPosition.degree)}
          </div>
          <div className="flex gap-2 mt-4">
            {spriteStore?.map((sprite) => (
              <div
                key={sprite.id}
                className="cursor-pointer"
                onClick={() => setCurrentSprite(sprite)}
              >
                <img
                  src={sprite.src}
                  alt={sprite.name}
                  className="w-20 h-20 object-cover"
                />
                <p className="text-center">{sprite.name}</p>
              </div>
            ))}
          </div>
          <div className="bg-yellow-400">
            <button onClick={handleUploadClick}>add sprite</button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
