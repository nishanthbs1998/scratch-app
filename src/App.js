import { useEffect, useRef, useState, useTransition } from "react";
import Workspace from "./components/Workspace";
import Sprite from "./components/Sprite";
import { s } from "framer-motion/client";
function App() {
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [isPending, startTransition] = useTransition();
  // State to store available sprites
  const [spriteStore, setSpriteStore] = useState([
    {
      id: 1,
      name: "sprite_1",
      src: "https://via.placeholder.com/100x100.png?text=Sprite+1",
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

  const spriteRefs = useRef({}); // Ref to store sprite DOM elements

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  };

  // const checkIntersections = () => {
  //   const rects = Object.entries(spriteRefs.current).map(([id, ref]) => {
  //     return { id, rect: ref.getBoundingClientRect() };
  //   });
  //   collidedPairs.current = [];
  //   const uniquePairsSet = new Set();
  //   for (let i = 0; i < rects.length; i++) {
  //     for (let j = i + 1; j < rects.length; j++) {
  //       if (intersect(rects[i].rect, rects[j].rect)) {
  //        console.log(`Sprites ${rects[i].id} and ${rects[j].id} are intersecting!`);
  //        const pair = [rects[i].id, rects[j].id].sort().join(",");
  //        if (!uniquePairsSet.has(pair)) {
  //         collidedPairs.current.push([rects[i].id, rects[j].id]);
  //         uniquePairsSet.add(pair); // Mark this pair as recorded
  //         console.log(collidedPairs.current, "collidedPairs")
  //       }
  //       }
  //     }
  //   }

  //   collidedPairs.current.forEach(([spriteId1, spriteId2]) => {
  //     console.log(`Processing collided sprites ${spriteId1} and ${spriteId2}`);
  //     const sprite1 = spriteStore.find((s) => s.id == spriteId1);
  //     const sprite2 = spriteStore.find((s) => s.id == spriteId2);
  //     console.log(spriteStore, "spriteStore")
  // console.log(sprite1, sprite2, "sprite1, sprite2") 
  //     // Check if both sprites are not playing
  //     if (sprite1 && sprite2 && !sprite1.isPlaying && !sprite2.isPlaying) {
  //       // Exchange motions
  //       console.log(`Exchanging motions of sprites ${sprite1.id} and ${sprite2.id}`);
  //       const tempMotions = sprite1.motions;
  //       sprite1.motions = sprite2.motions;
  //       sprite2.motions = tempMotions;
  
  //       // Update the spriteStore
  //       setSpriteStore((prevStore) =>
  //         prevStore.map((s) => (s.id === sprite1.id || s.id === sprite2.id ? { ...s } : s))
  //       );
  //     }
  //   });
  
  //   // Clear the collidedPairs after processing
  //  // collidedPairs.current = [];
    
  // };

  // useEffect(() => {
  //   if(collidedPairs.current.length>0){
  //     checkIntersections();
  //   }
  // }, [spriteStore, collidedPairs]);

  const checkIntersections = () => {

    const sprites = spriteStore.map((sprite) => {
      const element = document.getElementById(`sprite-${sprite.id}`);
      return { ...sprite, element };
    });

    // Check collisions between sprites
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        if(sprites[i].isPlaying || sprites[j].isPlaying) continue;
       // if(sprites[i].isCollided || sprites[j].isCollided) continue;
        const collisionDetected = checkCollision(
          sprites[i].element.getBoundingClientRect(),
          sprites[j].element.getBoundingClientRect()
        );

        if(!collisionDetected && sprites[i].isCollided && sprites[j].isCollided) {
          sprites[i].isCollided = false;
          sprites[j].isCollided = false;

          setSpriteStore(prevStore => {
            return prevStore.map(sprite => {
              if(sprite.id === sprites[i].id) {
                return { ...sprite, isCollided: false };
              }
              if(sprite.id === sprites[j].id) {
                return { ...sprite, isCollided: false };
              }
              return sprite;
              //const updatedSprite = sprites.find(s => s.id === sprite.id);
              //return updatedSprite ? { ...sprite, motions: updatedSprite.motions, isCollided: updatedSprite.isCollided } : sprite;
            });
          });
        }

        // Handle collision logic
        if (collisionDetected) {
          console.log(`Sprites ${sprites[i].id} and ${sprites[j].id} are colliding!`);
          // If they collide and were not previously marked as collided
          if (!sprites[i].isCollided && !sprites[j].isCollided) {
            // Exchange motions
            const tempMotions = sprites[i].motions;
            sprites[i].motions = sprites[j].motions;
            sprites[j].motions = tempMotions;

            // Set collided status to true
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

    // Update the spriteStore after processing collisions
    // startTransition(() => {
    setSpriteStore(prevStore => {
      return prevStore.map(sprite => {
        const updatedSprite = sprites.find(s => s.id === sprite.id);
        return updatedSprite ? { ...sprite, motions: updatedSprite.motions, isCollided: updatedSprite.isCollided } : sprite;
      });
    });
  // })
  };

  useEffect(() => {
    // if(!currentSprite.isPlaying)
    //   checkIntersections();
     //checkIntersections()
     const interval = setInterval(checkIntersections, 500); // Check for collisions every 100 ms
     return () => clearInterval(interval);
  }, [spriteStore]);
  
  // const intersect = (rectA, rectB) => {
  //   return !(
  //     rectA.right < rectB.left ||
  //     rectA.left > rectB.right ||
  //     rectA.bottom < rectB.top ||
  //     rectA.top > rectB.bottom
  //   );
  // };

  // useEffect(() => {
  //   checkIntersections(); // Check for intersections whenever sprite positions change
  // }, [spriteStore]);

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
          const newSprite={
            id: Date.now(),
            name: file.name,
            src: reader.result,
            motions: [],
            currentPosition: { x: 0, y: 0, degree: 0 },
            isPlaying: false,
            isCollided: false
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
                  spriteRefs={spriteRefs}
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
