import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
const Sprite=({sprite, spriteStore, setSpriteStore})=>{
    const [x, setX] = useState(sprite.currentPosition.x);
  const [y, setY] = useState(sprite.currentPosition.y);
  const [degree, setDegree] = useState(sprite.currentPosition.degree);
    const playSprite = async () => {
        //await manageRepeat(1);
        let actions=[]

        for(let i=0;i<sprite.motions.length;i++){
          const motion=sprite.motions[i]
          if (motion.type === "move") {
                // const action= async()=> await animateMove(motion.value);
                 actions.push(()=>animateMove(motion.value));
                } else if (motion.type === "rotate") {
                //  const action= async()=> await animateRotate(motion.value);
                  actions.push(()=>animateRotate(motion.value));
                } else if (motion.type === "goto") {
                 // const action= async()=> await animateGoto(motion.value);
                  actions.push(()=>animateGoto(motion.value));
                } else if (motion.type === "repeat") {
                  const toRepeat=actions.slice();
                  actions=[]
                  const repeatAction = manageRepeat(async() => {
                    // Execute each stored action
                   // toRepeat.forEach((action) =>void action());
                   for(const action of toRepeat){
                    
                      await action();
                    }
                  }, motion.value);
            
                  actions.push(repeatAction);
                }


        }
        for (const action of actions) {
          console.log(action, "action")
           action();
        }
      }


     
    useEffect(()=>{
        console.log(sprite.isPlaying, "sprite.isPlaying")
        playSprite();

    },[sprite.isPlaying])

    useEffect(() => {
    setSpriteStore((prevStore) => {
      const updatedStore = prevStore.map((s) => {
        if (s.id === sprite.id) {
          s.currentPosition = {...s.currentPosition, x };
        }
        return s;
      });
      return updatedStore;
    }
    );

    }, [x]);

    useEffect(() => {
      setSpriteStore((prevStore) => {
        const updatedStore = prevStore.map((s) => {
          if (s.id === sprite.id) {
            s.currentPosition = {...s.currentPosition, y };
          }
          return s;
        });
        return updatedStore;
      }
      );
  
      }, [y]);

      useEffect(() => {
        setSpriteStore((prevStore) => {
          const updatedStore = prevStore.map((s) => {
            if (s.id === sprite.id) {
              s.currentPosition = {...s.currentPosition, degree };
            }
            return s;
          });
          return updatedStore;
        }
        );
    
        }, [degree]);
  const animateMove = (value) => {
    return new Promise((resolve) => {
      setX((prevX) => {
        const newX = sprite.currentPosition.x + Number(value);
        setTimeout(() => resolve(), 500); // Animation duration
        return newX;
      });
    });
  };

  const animateRotate = (value) => {
    return new Promise((resolve) => {
      setDegree((prevDegree) => {
        const newDegree = sprite.currentPosition.degree + Number(value);
        setTimeout(() => resolve(), 500); // Animation duration
        return newDegree;
      });
    });
  };

  const animateGoto = (value) => {
    return new Promise((resolve) => {
      setX((prev)=>sprite.currentPosition.x+Number(value.x));
      setY((prev)=>sprite.currentPosition.y+Number(value.y));
      setTimeout(() => resolve(), 500); // Animation duration
    });
  };

    const manageRepeat =  (repeatFn, times) => {

      return async()=>{
        for(let i=0; i<times; i++){
          console.log('called')
          await repeatFn();
        }
      }

      

      };
    return(
        <div className="relative">       
            <motion.img
             initial={{ x: 0, y: 0 }} 
             animate={{ x: sprite.currentPosition.x, y: sprite.currentPosition.y, rotate: sprite.currentPosition.degree }}
             transition={{ duration: 0.5, ease: 'linear'}}
             onDragEnd={(event, info) => {
               event.preventDefault();
               setSpriteStore((prevStore) => {
                return prevStore.map((s) => {
                  if (s.id === sprite.id) {
                    return {
                      ...s,
                      currentPosition: {
                        ...s.currentPosition,
                        x: Number(s.currentPosition.x)+Number(info.offset.x),  // Use offset for absolute positioning
                        y: Number(s.currentPosition.y)+Number(info.offset.y),
                      },
                    };
                  }
                  return s;
                });
              });
              console.log(info)
             }}
             key={sprite.id}
             drag
               dragMomentum={false}

              src={sprite.src}
              alt={sprite.name}
              className="absolute w-20 h-20 object-cover"
            />
           
          </div>

    )
}

export default Sprite;