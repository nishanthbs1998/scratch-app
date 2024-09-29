import { useEffect, useRef, useState } from "react";
import Workspace from "./components/Workspace";
import Sprite from "./components/Sprite";
function App() {
  const [draggedItemId, setDraggedItemId] = useState(null);
  // State to store available sprites
  const [spriteStore, setSpriteStore] = useState([
    {
      id: 1,
      name: "sprite_1",
      src: "https://via.placeholder.com/100x100.png?text=Sprite+1",
      currentPosition: { x: 0, y: 0, degree: 0 },
      motions: [],
      isPlaying: false,
    },
  ]);
  const [currentSprite, setCurrentSprite] = useState(spriteStore[0]);
  const [move, setMove] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [goto, setGoto] = useState({ x: 0, y: 0 });

  const [repeat, setRepeat] = useState(1);

  const handlePlay = () => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
         
          sprite.isPlaying = !sprite.isPlaying;
        return sprite;
      });
      return updatedStore;
    });
  };
  useEffect(()=>{
    console.log(currentSprite, 'currentSprite')
  }, [currentSprite])
useEffect(()=>{
  console.log(spriteStore, 'spriteStore')
}, [spriteStore])
  // useEffect(() => {
  //   setCurrentSprite(spriteStore[spriteStore.length - 1]);
  // }, [spriteStore.length]);

  const fileInputRef = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpriteStore((prevStore) => {
          const newSprite={
            id: Date.now(),
            name: file.name,
            src: reader.result,
            motions: [],
            currentPosition: { x: 0, y: 0, degree: 0 },
          }
          const updatedStore=[
          ...prevStore,
          newSprite
        ]
      setCurrentSprite(newSprite)
      return updatedStore
      });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
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
    const updatedSprite = spriteStore.find((sprite) => sprite.id === currentSprite.id);
    if (updatedSprite) {
      setCurrentSprite(updatedSprite);
    }
  }, [spriteStore]);

  return (
    <div className="flex flex-col gap-2">
      <button className="bg-blue-400" onClick={handlePlay}>
        Play
      </button>
      <div className="bg-black flex gap-5 h-screen">
        <div
          className="bg-blue-400 w-1/2"
          onDragEnter={() => handleDeleteMotion(draggedItemId)}
        >
          <div
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ id:Date.now(), type: "move", value: move })
              )
            }
          >
            move x
            <input
              type="text"
              value={move}
              onChange={(e) => setMove(e.target.value)}
            />
          </div>
          <div
            className="mt-2"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({id:Date.now(), type: "rotate", value: rotate })
              )
            }
          >
            rotate
            <input
              type="text"
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
            />
          </div>
          <div
            className="mt-2"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({id:Date.now(), type: "goto", value: goto })
              )
            }
          >
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
          </div>
          <div
            className="mt-2"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({id:Date.now(), type: "repeat", value: repeat })
              )
            }
          >
            repeat
            <input
              type="text"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            />
          </div>
        </div>

        <Workspace
          setDraggedItemId={setDraggedItemId}
          motions={currentSprite?.motions}
          currentSprite={currentSprite}
          setSpriteStore={setSpriteStore}
        />
        <div className="flex flex-col w-1/2  h-screen">
          <div className="bg-white relative overflow-hidden h-1/2">
            {
              //  console.log(spriteStore)
              spriteStore?.map((sprite) => (
                <Sprite
                  key={sprite.id}
                  sprite={sprite}
                  spriteStore={spriteStore}
                  setSpriteStore={setSpriteStore}
                />
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
