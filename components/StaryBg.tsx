'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 3,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden bg-black">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.y}vh`,
            left: `${star.x}vw`,
          }}
          animate={{ opacity: [0, 1, 0], y: [star.y, star.y - 10] }}
          transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
