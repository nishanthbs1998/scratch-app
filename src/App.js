import { useEffect, useState } from "react";
import Workspace from "./components/Workspace";

import { motion } from "framer-motion";
function App() {
  
  const [motionStack, setMotionStack] = useState({
    "sprite1":[]
  });
  const handleMove=(value)=>{
    setMotionStack({
      ...motionStack,
      "sprite1":[...motionStack["sprite1"],{type:'move',value:value}]
    })
  }
  const handleRotate=(value)=>{
    setMotionStack({
      ...motionStack,
      "sprite1":[...motionStack["sprite1"],{type:'rotate',value:value}]
    })
  }

  const manageRepeat = async (repeatCount) => {
    if (repeatCount <= 0) {
      return;
    }
    for (let i = 0; i < repeatCount; i++) {
      for (const motion of motionStack.sprite1) {
        if (motion.type === "move") {
          await animateMove(motion.value);
        } else if (motion.type === "rotate") {
          await animateRotate(motion.value);
        } else if (motion.type === "goto") {
          await animateGoto(motion.value);
        }
      }
    }
  };

  const animateMove = (value) => {
    return new Promise((resolve) => {
      setX((prevX) => {
        const newX = prevX + Number(value);
        setTimeout(() => resolve(), 500); // Animation duration
        return newX;
      });
    });
  };

  const animateRotate = (value) => {
    return new Promise((resolve) => {
      setDegree((prevDegree) => {
        const newDegree = prevDegree + Number(value);
        setTimeout(() => resolve(), 500); // Animation duration
        return newDegree;
      });
    });
  };

  const animateGoto = (value) => {
    return new Promise((resolve) => {
      setX(Number(value.x));
      setY(Number(value.y));
      setTimeout(() => resolve(), 500); // Animation duration
    });
  };

  const handlePlay = async () => {
    await manageRepeat(repeat);
  };

  // const manageRepeat=(repeat)=>{
  //   console.log('reached')
  //   if(repeat<=0){
  //     return
  //   }
  //   for(let i=0;i<repeat-1;i++){
  //     motionStack["sprite1"].forEach((motion,index)=>{
  //       if(motion.type==='move'){
  //         console.log(motion, 'move')
  //         setX((prev)=>prev+Number(motion.value))
  //       }
  //       if(motion.type==='rotate'){
  //         setDegree((prev)=>prev+Number(motion.value))
  //       }
  //       if(motion.type==='goto'){
  //         setX((prev)=>prev+Number(motion.value.x))
  //         setY((prev)=>prev+Number(motion.value.y))
  //       }
  //       // if (motion.type === 'repeat') {
  //       //   setMotionStack((prev) => {
  //       //     // Find the specific sprite's motion stack
  //       //     const updatedSpriteStack = prev["sprite1"].map((motionItem, idx) => {
  //       //       if (idx === index && motionItem.type === 'repeat') {
  //       //         // Decrement the repeat value
  //       //         return {
  //       //           ...motionItem,
  //       //           value: Math.max(Number(motionItem.value) - 1, 0), // Ensure repeat doesn't go below 0
  //       //         };
  //       //       }
  //       //       return motionItem;
  //       //     });
        
  //       //     // Return updated motionStack
  //       //     return {
  //       //       ...prev,
  //       //       sprite1: updatedSpriteStack,
  //       //     };
  //       //   });
  //       //   manageRepeat(repeat-1, index)
  //       // }
        
  //     })
  //   }
  // }

//   const handlePlay=()=>{
// for(let i=0;i<repeat-1;i++)
// {
//     manageRepeat(repeat)
// }
//   // manageRepeat(repeat)
//     console.log(motionStack, 'mstack')
//     motionStack["sprite1"].forEach((motion,index)=>{
//         if(motion.type==='move'){
//           console.log(motion, 'move')
//           setX((prev)=>prev+Number(motion.value))
//         }
//         if(motion.type==='rotate'){
//           setDegree((prev)=>prev+Number(motion.value))
//         }
//         if(motion.type==='goto'){
//           setX((prev)=>prev+Number(motion.value.x))
//           setY((prev)=>prev+Number(motion.value.y))
//         }
//         if(motion.type==='repeat'){
//          // manageRepeat(motion.value, index)
//           // while(repeat>0){
//           //   handlePlay(repeat)
//           //   setRepeat((prev)=>prev-1)
//           // }
//         }
//       })

//     // for(let i=0;i<repeat;i++){
//     //   motionStack["sprite1"].forEach((motion,index)=>{
//     //     if(motion.type==='move'){
//     //       console.log(motion, 'move')
//     //       setX((prev)=>prev+Number(motion.value))
//     //     }
//     //     if(motion.type==='rotate'){
//     //       setDegree((prev)=>prev+Number(motion.value))
//     //     }
//     //     if(motion.type==='goto'){
//     //       setX((prev)=>prev+Number(motion.value.x))
//     //       setY((prev)=>prev+Number(motion.value.y))
//     //     }
//     //     if(motion.type==='repeat'){
//     //       manageRepeat(motion.value, index)
//     //       // while(repeat>0){
//     //       //   handlePlay(repeat)
//     //       //   setRepeat((prev)=>prev-1)
//     //       // }
//     //     }
//     //   })
//     // }
    
//   }
  const handleGoto=(value)=>{
    setMotionStack({
      ...motionStack,
      "sprite1":[...motionStack["sprite1"],{type:'goto',value:value}]
    })
  }
  const handleRepeat=(value)=>{
    setMotionStack({
      ...motionStack,
      "sprite1":[...motionStack["sprite1"],{type:'repeat',value:value}]
    })
    setRepeat(value)
  }
  const [move, setMove] = useState(0)
  const [rotate,setRotate]=useState(0)
  const [goto,setGoto]=useState({x:0,y:0})
  const [x,setX]=useState(0)
  const [y,setY]=useState(0)
  const [degree, setDegree]=useState(0)
  const [repeat, setRepeat]=useState(1)
  return (
    <div className="flex flex-col gap-2">
            <button className="bg-blue-400" onClick={handlePlay}>Play</button>
            <div className="bg-black flex gap-5 h-screen">
      <div className="flex flex-col w-1/2  h-screen">
      <div className="bg-white relative h-1/2">
      <motion.div
      drag={true}
      dragMomentum={false}
      onDrag={
        (event, info)=>{
          setX(info.point.x)
          setY(info.point.y)
        }
      } 
      className="h-[100px] flex absolute justify-center items-center w-[100px] bg-blue-400"
      initial={{ x: x, y: y }}
      animate={{ x: x, y: y, rotate: degree }}
      transition={{ duration: 0.5, ease: 'linear'}}
      // onAnimationComplete={() => {
      //   setX((prev)=>prev+10)
      //   setY((prev)=>prev+10)
      //   setDegree((prev)=>prev+10)
      // }}
      >
        sprite
      </motion.div>
      </div>
      <div className="bg-white">
      currentX: {x}
      currentY: {y}
      degree: {degree}  
      </div>
      </div>
      

      <Workspace motionStack={motionStack}/>
      <div className="bg-blue-400 w-1/2">
      <div>
        move x
        <input type="text" value={move} onChange={(e)=>setMove(e.target.value)}/>
        <button onClick={
          ()=>handleMove(move)
        }>add move</button>
      </div>
      <div className="mt-2">
        rotate
        <input type="text" value={rotate} onChange={(e)=>setRotate(e.target.value)}/>
        <button onClick={
          ()=>handleRotate(rotate)
        }>add rotate</button>
      </div>
      <div className="mt-2">
        goto x
        <input className="w-1/12" type="text" value={goto.x} onChange={(e)=>setGoto((prev)=>({
          ...prev,
          x:e.target.value
        }))}/>
        y
        <input className="w-1/12" type="text" value={goto.y}  onChange={(e)=>setGoto((prev)=>({
          ...prev,
          y:e.target.value
        }))}/>
        <button onClick={
          ()=>handleGoto(goto)
        }>add goto</button>
      </div>
      <div className="mt-2">
        repeat
        <input type="text" value={repeat} onChange={(e)=>setRepeat(e.target.value)}/>
        <button onClick={
          ()=>handleRepeat(repeat)
        }>add repeat</button>
      </div>
      </div>
    </div>
    </div>
    
  );
}

export default App;
