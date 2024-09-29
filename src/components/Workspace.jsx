import { useEffect, useState } from "react";
import { motion as framerMotion }  from "framer-motion";
const Workspace=({motions, setSpriteStore, currentSprite, isOverDropZone, setDraggedItemId})=>{
  
  useEffect(()=>{
    console.log(isOverDropZone, 'isOverDropZone')
  }, [isOverDropZone])
  const handleMove = (value) => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((sprite) => {
        if (sprite.id === currentSprite.id) {
          sprite.motions.push({ id:Date.now(), type: "move", value: value });
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
          sprite.motions.push({ id:Date.now(), type: "rotate", value: value });
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
          sprite.motions.push({ id:Date.now(), type: "goto", value: value });
        }
        return sprite;
      });
      return updatedStore;
    });
  }
  const handleDrop=(item)=>{

    if(currentSprite.motions.includes(item)){
      return;
    }

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
    <div  onDrop={(e)=>{
      console.log(e, 'dropped')
      handleDrop(JSON.parse(e.dataTransfer.getData('text/plain')))}} onDragOver={(e)=>e.preventDefault()} className="bg-blue-400 w-1/2 h-1/2 flex flex-col items-center">
        Motion stack
        <div>
            {
                motions?.map((motion,index)=>(
                    <div onDragStart={()=>setDraggedItemId(motion.id)}
                    onDrag={(e)=>e.stopPropagation()} 
                    onDragEnd={()=>setDraggedItemId(null)}
                     draggable key={motion.id} className="flex gap-2">
                        <div>{motion.type}</div>
                      {motion.type==='goto'?<div>x: {motion.value.x} y:{motion.value.y}</div>:  <div>{motion.value}</div>}
                    </div>
                ))
            }
         
        </div>
      </div>
)
}

export default Workspace;