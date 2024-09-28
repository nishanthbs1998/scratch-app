import { motion } from "framer-motion";
import { useEffect, useState } from "react";
const Sprite=({sprite, spriteStore, setSpriteStore})=>{
    const [x, setX] = useState(sprite.currentPosition.x);
  const [y, setY] = useState(sprite.currentPosition.y);
  const [degree, setDegree] = useState(sprite.currentPosition.degree);
    const playSprite = async () => {
        await manageRepeat(1);
      }
      useEffect(() => {
        setSpriteStore((prevStore) => {
          const updatedStore = prevStore.map((s) => {
            if (s.id === sprite.id) {
              s.isPlaying = false;
            }
            return s;
          });
          return updatedStore;
        
      })}, [sprite.currentPosition]);
    useEffect(()=>{
        console.log(sprite.isPlaying, "sprite.isPlaying")
        if(sprite.isPlaying)
        {
            playSprite();
        }

    },[sprite.isPlaying])

    useEffect(() => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((s) => {
        if (s.id === sprite.id) {
          s.currentPosition = { x, y, degree };
        }
        return s;
      });
      return updatedStore;
    }
    );

    }, [x, y, degree]);
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

    const manageRepeat = async (repeatCount) => {
        if (repeatCount <= 0) {
          return;
        }
        for (let i = 0; i < repeatCount; i++) {
          for (const motion of sprite.motions) {
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
    return(
        <>       
            <motion.img
             initial={{ x: 0, y: 0 }} 
             animate={{ x: x, y: y, rotate: degree }}
             transition={{ duration: 0.5, ease: 'linear'}}
             style={{ x: x, y: y }}
             onDrag={(event, info) => {
               event.preventDefault();
               console.log(info)
             }}
             key={sprite.id}
             drag
               dragMomentum={false}

              src={sprite.src}
              alt={sprite.name}
              className="absolute w-20 h-20 object-cover"
            />
           
          </>

    )
}

export default Sprite;