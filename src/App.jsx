import { useEffect, useRef, useState } from "react";
import Workspace from "./components/Workspace.tsx";
import Sprite from "./components/Sprite.tsx";
import sprite1 from "./assets/sprite1.svg";
import trashCan from "./assets/trash-can.png";

function App() {
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [spriteStore, setSpriteStore] = useState([
    {
      id: 1,
      name: "sprite_1",
      src: sprite1,
      currentPosition: { x: 100, y: 100, degree: 0 },
      motions: [],
      isPlaying: false,
      isCollided: false,
    },
  ]);
  const [currentSprite, setCurrentSprite] = useState(spriteStore[0]);
  const [move, setMove] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [goto, setGoto] = useState({ x: 0, y: 0 });

  const [repeat, setRepeat] = useState(0);

  const spriteRefs = useRef({});

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  };

  const checkIntersections = () => {
    const sprites = spriteStore.map((sprite) => {
      const element = document.getElementById(`sprite-${sprite.id}`);
      return { ...sprite, element };
    });

    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        if (sprites[i].isPlaying || sprites[j].isPlaying) continue;

        const collisionDetected = checkCollision(
          sprites[i].element.getBoundingClientRect(),
          sprites[j].element.getBoundingClientRect()
        );

        if (
          !collisionDetected &&
          sprites[i].isCollided &&
          sprites[j].isCollided
        ) {
          sprites[i].isCollided = false;
          sprites[j].isCollided = false;

          setSpriteStore((prevStore) => {
            return prevStore.map((sprite) => {
              if (sprite.id === sprites[i].id) {
                return { ...sprite, isCollided: false };
              }
              if (sprite.id === sprites[j].id) {
                return { ...sprite, isCollided: false };
              }
              return sprite;
            });
          });
        }

        if (collisionDetected) {
          if (!sprites[i].isCollided && !sprites[j].isCollided) {
            const tempMotions = sprites[i].motions;
            sprites[i].motions = sprites[j].motions;
            sprites[j].motions = tempMotions;

            sprites[i].isCollided = true;
            sprites[j].isCollided = true;
          }
        } else {
          // If they are not colliding, reset their collided state
          if (sprites[i].isCollided || sprites[j].isCollided) {
            sprites[i].isCollided = false;
            sprites[j].isCollided = false;
          }
        }
      }
    }

    setSpriteStore((prevStore) => {
      return prevStore.map((sprite) => {
        const updatedSprite = sprites.find((s) => s.id === sprite.id);
        return updatedSprite
          ? {
              ...sprite,
              motions: updatedSprite.motions,
              isCollided: updatedSprite.isCollided,
            }
          : sprite;
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(checkIntersections, 500);
    return () => clearInterval(interval);
  }, [spriteStore]);

  const handlePlay = () => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        sprite.isPlaying = !sprite.isPlaying;
        return sprite;
      });
      return updatedStore;
    });
  };

  const fileInputRef = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpriteStore((prevStore) => {
          const newSprite = {
            id: Date.now(),
            name: file.name,
            src: reader.result,
            motions: [],
            currentPosition: { x: 0, y: 0, degree: 0 },
            isPlaying: false,
            isCollided: false,
          };
          const updatedStore = [...prevStore, newSprite];
          setCurrentSprite(newSprite);
          return updatedStore;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteSprite = (id) => () => {
    setSpriteStore((prevStore) =>
      prevStore.filter((sprite) => sprite.id !== id)
    );
  };

  const handleDeleteMotion = (id) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions = sprite.motions.filter((motion) => motion.id !== id);
        }
        return sprite;
      });
      return updatedStore;
    });
  };

  useEffect(() => {
    // Find the updated current sprite from the spriteStore
    const updatedSprite = spriteStore.find(
      (sprite) => sprite.id === currentSprite.id
    );
    if (updatedSprite) {
      setCurrentSprite(updatedSprite);
    }
  }, [spriteStore]);

  return (
    <div className="flex flex-col bg-[#E6F0FF] gap-2">
      <button
        className="bg-[#4CBF56] rounded flex self-end mr-2 py-1 px-4 text-white mt-1"
        onClick={handlePlay}
      >
        Play
      </button>

      <div className="bg-[#E6F0FF] flex gap-2 h-screen">
        <div
          className="bg-white w-1/4 rounded-r-lg border"
          onDragEnter={() => handleDeleteMotion(draggedItemId)}
        >
          <p className="m-2 font-semibold text-slate-600">Motion</p>
          <div
            className="flex gap-2 bg-[#4C97FF] p-2 w-2/3 m-2 rounded items-center"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ id: Date.now(), type: "move", value: move })
              )
            }
          >
            <span className="text-white">move</span>
            <input
              type="text"
              className="w-3/12 h-5 rounded-full p-2"
              value={move}
              onChange={(e) => setMove(e.target.value)}
            />
            <span className=" text-white">steps</span>
          </div>
          <div
            className="flex gap-2 bg-[#4C97FF] p-2 w-2/3 m-2 rounded items-center"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  id: Date.now(),
                  type: "turn",
                  value: rotate,
                })
              )
            }
          >
            <span className="text-white">turn</span>
            <input
              className="w-3/12 h-5 rounded-full p-2"
              type="text"
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
            />
            <span className="text-white">degrees</span>
          </div>
          <div
            className="flex gap-2 bg-[#4C97FF] p-2 w-2/3 m-2 rounded items-center"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ id: Date.now(), type: "goto", value: goto })
              )
            }
          >
           <span className="text-white">go to x:</span> 
            <input
              className="w-3/12 h-5 rounded-full p-2"
              type="text"
              value={goto.x}
              onChange={(e) =>
                setGoto((prev) => ({
                  ...prev,
                  x: e.target.value,
                }))
              }
            />
           <span className="text-white">y:</span> 
            <input
              className="w-3/12 h-5 rounded-full p-2"
              type="text"
              value={goto.y}
              onChange={(e) =>
                setGoto((prev) => ({
                  ...prev,
                  y: e.target.value,
                }))
              }
            />
          </div>
          <p className="m-2 font-semibold text-slate-600 mt-5">Control</p>
          <div
            className="flex gap-2 bg-[#FFAB19] p-2 w-2/3 m-2 rounded items-center"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                  id: Date.now(),
                  type: "repeat",
                  value: repeat,
                })
              )
            }
          >
            <span className="text-white">repeat</span>
            <input
            className="w-3/12 h-5 rounded-full p-2"
              type="text"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            />
            <span className="text-white">times</span>
          </div>
        </div>
        <div className="w-1/3 bg-white rounded-lg">
          <Workspace
            setDraggedItemId={setDraggedItemId}
            motions={currentSprite?.motions}
            currentSprite={currentSprite}
            setSpriteStore={setSpriteStore}
          />
        </div>
        <div className="flex flex-col w-2/5 mr-2">
          <div className="bg-white relative rounded-lg overflow-hidden h-2/3">
            {spriteStore?.map((sprite) => (
              <Sprite
                key={sprite.id}
                sprite={sprite}
                setSpriteStore={setSpriteStore}
                spriteRefs={spriteRefs}
              />
            ))}
          </div>
          <div className="bg-white flex border border shadow-lg flex-col mt-2 h-1/5 rounded-lg">
            <div className="flex gap-10 items-center justify-center p-1">
              <span>X: {Math.trunc(currentSprite.currentPosition.x)}</span>
              <span>Y: {Math.trunc(currentSprite.currentPosition.y)}</span>
              <span>
                Direction: {Math.trunc(currentSprite.currentPosition.degree)}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex p-2 gap-4 overflow-x-scroll bg-[#E6F0FF]">
                {spriteStore?.map((sprite) => (
                  <div
                    key={sprite.id}
                    className={`cursor-pointer relative flex flex-col rounded-lg w-20 h-auto shadow-[#855CD6] ${
                      sprite.id === currentSprite.id
                        ? "border-4 border-[#855CD6] bg-white"
                        : "bg-[#E9F1FC] border-2 border-slate-400"
                    }`}
                    onClick={() => setCurrentSprite(sprite)}
                  >
                    {currentSprite.id === sprite.id && (
                      <div
                        onClick={handleDeleteSprite(sprite.id)}
                        className="flex rounded-full bg-[#855CD6] p-2 absolute -top-3 -right-4 self-end"
                      >
                        <img src={trashCan} alt={"delete icon"} />
                      </div>
                    )}
                    <img
                      src={sprite.src}
                      alt={sprite.name}
                      className="w-10 h-10 my-2 mx-4"
                    />
                    <p
                      className={`text-center overflow-hidden ${
                        sprite.id === currentSprite.id
                          ? "bg-[#855CD6] text-white"
                          : "text-black"
                      }`}
                    >
                      {sprite.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2 flex justify-end bg-[#E6F0FF]">
                <div className="bg-[#4CBF56] text-white py-1 px-4 rounded-md">
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
        </div>
      </div>
    </div>
  );
}

export default App;
