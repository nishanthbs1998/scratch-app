import { useEffect } from "react";

const Workspace=({motions, setSpriteStore, currentSprite})=>{
  
  const handleMove = (value) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ type: "move", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
  
  };

  const handleRotate = (value) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ type: "rotate", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
  };

  const handleGoto = (value) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ type: "goto", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
  }
  const handleDrop=(item)=>{

    if(item.type==='move'){
      handleMove(item.value);
    }
    if(item.type==='rotate'){
      handleRotate(item.value);
    }
    if(item.type==='goto'){
      handleGoto(item.value);
    }
  }

return (
    <div  onDrop={(e)=>handleDrop(JSON.parse(e.dataTransfer.getData('text/plain')))} onDragOver={(e)=>e.preventDefault()} className="bg-blue-400 w-1/2 h-1/2 flex flex-col items-center">
        Motion stack
        <div>
            {
                motions?.map((motion,index)=>(
                    <div key={index} className="flex gap-2">
                        <div>{motion.type}</div>
                      {motion.type==='goto'?<div>x: {motion.value.x} y:{motion.value.y}</div>:  <div>{motion.value}</div>}
                    </div>
                ))
            }
          {/* <div>motion</div>
          <div>motion</div>
          <div>motion</div>
          <div>motion</div> */}
        </div>
      </div>
)
}

export default Workspace;