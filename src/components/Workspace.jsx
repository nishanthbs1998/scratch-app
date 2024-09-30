import { div } from "framer-motion/client";

const Workspace = ({
  motions,
  setSpriteStore,
  currentSprite,
  setDraggedItemId,
}) => {
  const handleRepeat = (item) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({
            id: item.id,
            type: "repeat",
            value: item.value,
          });
        }
        return sprite;
      });
      return updatedStore;
    });
  };

  const handleMove = (item) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ id: item.id, type: "move", value: item.value });
        }
        return sprite;
      });
      return updatedStore;
    });
  };

  const handleRotate = (item) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({
            id: item.id,
            type: "turn",
            value: item.value,
          });
        }
        return sprite;
      });
      return updatedStore;
    });
  };

  const handleGoto = (item) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ id: item.id, type: "goto", value: item.value });
        }
        return sprite;
      });
      return updatedStore;
    });
  };
  const handleDrop = (item) => {
    if (
      currentSprite.motions.filter((motion) => motion.id === item.id).length > 0
    ) {
      return;
    } else if (item.type === "move") {
      handleMove(item);
    } else if (item.type === "turn") {
      handleRotate(item);
    } else if (item.type === "goto") {
      handleGoto(item);
    } else if (item.type === "repeat") {
      handleRepeat(item);
    }
  };

  return (
    <div
      onDrop={(e) => {
        if(e.dataTransfer.getData("text/plain"))
        handleDrop(JSON.parse(e.dataTransfer.getData("text/plain")));
      }}
      onDragOver={(e) => e.preventDefault()}
      className="h-1/2 flex flex-col items-center"
    > 
      <div>
        {motions?.map((motion, index) => (
          <div
            onDragStart={() => setDraggedItemId(motion.id)}
            onDrag={(e) => e.stopPropagation()}
            onDragEnd={() => setDraggedItemId(null)}
            draggable
            key={motion.id}
            className={`flex gap-2 ${motion.type==='repeat'?'bg-[#FFAB19]':'bg-[#4C97FF]'} p-2 w-full m-2 rounded items-center`}
          >
            <div className="text-white">{motion.type==='goto'?'go to':motion.type}</div>
            {motion.type === "goto" ? (
              <div className="text-white">
                x: {motion.value.x} y: {motion.value.y}
              </div>
            ) : (
              <>
              <div className="text-white">{motion.value}</div>
              {motion.type === "move" ? <div className="text-white">steps</div> 
              : motion.type==='turn' ? <div className="text-white">degrees</div> 
              : <div className="text-white">times</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;
