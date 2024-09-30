import { animate, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const Sprite = ({ sprite, spriteStore, setSpriteStore, spriteRefs }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Separate refs for the animation to avoid intermediate re-renders
  const xRef = useRef(sprite.currentPosition.x);
  const yRef = useRef(sprite.currentPosition.y);
  const degreeRef = useRef(sprite.currentPosition.degree);

  // Update DOM reference on initial render
  useEffect(() => {
    spriteRefs.current[sprite.id] = document.getElementById(`sprite-${sprite.id}`);
  }, [sprite.id, spriteRefs]);

  const playSprite = async () => {
    let actions = [];

    for (let i = 0; i < sprite.motions.length; i++) {
      const motion = sprite.motions[i];
      if (motion.type === "move") {
        actions.push(() => animateMove(motion.value));
      } else if (motion.type === "rotate") {
        actions.push(() => animateRotate(motion.value));
      } else if (motion.type === "goto") {
        actions.push(() => animateGoto(motion.value));
      } else if (motion.type === "repeat") {
        const toRepeat = actions.slice();
        actions = [];
        const repeatAction = manageRepeat(async () => {
          for (const action of toRepeat) {
            await action();
          }
        }, motion.value);

        actions.push(repeatAction);
      }
    }

    for (const action of actions) {
      await action();
    }
  };

  useEffect(() => {
    if (sprite.isPlaying) {
      setIsAnimating(true);
      playSprite().then(() => {
        setIsAnimating(false);
        // Update the state after animation finishes
        setSpriteStore((prevStore) =>
          prevStore.map((s) =>
            s.id === sprite.id
              ? {
                  ...s,
                  currentPosition: {
                    x: xRef.current,
                    y: yRef.current,
                    degree: degreeRef.current,
                  },
                  isPlaying: false,
                }
              : s
          )
        );
      });
    }
  }, [sprite.isPlaying]);

  // Animate move
  const animateMove = (value) => {
    return new Promise((resolve) => {
      xRef.current += Number(value);
      setTimeout(resolve, 500); // Animation duration
    });
  };

  // Animate rotate
  const animateRotate = (value) => {
    return new Promise((resolve) => {
      degreeRef.current += Number(value);
      setTimeout(resolve, 500); // Animation duration
    });
  };

  // Animate goto
  const animateGoto = (value) => {
    return new Promise((resolve) => {
      xRef.current = Number(value.x);
      yRef.current = Number(value.y);
      setTimeout(resolve, 500); // Animation duration
    });
  };

  // Manage repeat logic
  const manageRepeat = (repeatFn, times) => {
    return async () => {
      for (let i = 0; i < times; i++) {
        await repeatFn();
      }
    };
  };

  return (
    <div className="relative">
      <motion.img
        onAnimationComplete={() => {
          // On animation complete, we update state
          setIsAnimating(false);
          setSpriteStore((prevStore) =>
            prevStore.map((s) =>
              s.id === sprite.id
                ? {
                    ...s,
                    currentPosition: {
                      x: xRef.current,
                      y: yRef.current,
                      degree: degreeRef.current,
                    },
                    isPlaying: false,
                  }
                : s
            )
          );
        }}
        id={`sprite-${sprite.id}`}
        initial={{ x: 0, y: 0 }}
        animate={{ x: xRef.current, y: yRef.current, rotate: degreeRef.current }}
        transition={{ duration: 0.5, ease: "linear" }}
        onDragEnd={(event, info) => {
          event.preventDefault();
          xRef.current += info.offset.x;
          yRef.current += info.offset.y;

          // Update state after dragging ends
          setSpriteStore((prevStore) =>
            prevStore.map((s) =>
              s.id === sprite.id
                ? {
                    ...s,
                    currentPosition: { ...s.currentPosition, x: xRef.current, y: yRef.current },
                  }
                : s
            )
          );
        }}
        key={sprite.id}
        drag
        dragMomentum={false}
        src={sprite.src}
        alt={sprite.name}
        className="absolute w-20 h-20 object-cover"
      />
    </div>
  );
};

export default Sprite;
