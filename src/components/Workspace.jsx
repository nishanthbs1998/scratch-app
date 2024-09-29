import { useEffect, useState } from "react";
import { motion as framerMotion } from "framer-motion";
const Workspace = ({
  motions,
  setSpriteStore,
  currentSprite,
  setDraggedItemId,
}) => {
  
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
          sprite.motions.push({ id: item.id, type: "rotate", value: item.value });
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
    }

    if (item.type === "move") {
      handleMove(item);
    }
    if (item.type === "rotate") {
      handleRotate(item);
    }
    if (item.type === "goto") {
      handleGoto(item);
    }
  };

  return (
    <div
      onDrop={(e) => {
        console.log(JSON.parse(e.dataTransfer.getData("text/plain")), "dropped");
        handleDrop(JSON.parse(e.dataTransfer.getData("text/plain")));
      }}
      onDragOver={(e) => e.preventDefault()}
      className="bg-blue-400 w-1/2 h-1/2 flex flex-col items-center"
    >
      Motion stack
      <div>
        {motions?.map((motion, index) => (
          <div
            onDragStart={() => setDraggedItemId(motion.id)}
            onDrag={(e) => e.stopPropagation()}
            onDragEnd={() => setDraggedItemId(null)}
            draggable
            key={motion.id}
            className="flex gap-2"
          >
            <div>{motion.type}</div>
            {motion.type === "goto" ? (
              <div>
                x: {motion.value.x} y:{motion.value.y}
              </div>
            ) : (
              <div>{motion.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;
