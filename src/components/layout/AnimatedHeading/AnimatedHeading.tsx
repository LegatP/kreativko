import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const items = [
  "prijateljev rojstni dan.",
  "svojo ekipo.",
  "posebno priložnost.",
  "športni dogodek.",
  "družinski izlet.",
  "službeno zabavo.",
];

export default function AnimatedHeading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2400); // 5 seconds for readability
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.h1
      layout="position"
      transition={{
        type: "decay",
      }}
      className="tracking-tight inline font-semibold lg:text-5xl"
    >
      Kreiraj unikatno majico za{" "}
      <span
        className="from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-linear-to-b"
        style={{
          position: "relative",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {items.map((item, i) => (
          <motion.div
            layout={false}
            key={item}
            initial={{ opacity: 0, y: -40 }}
            animate={
              i === index
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 40, animationDelay: 0.2 }
            }
            transition={{ duration: 0.85, ease: "easeInOut" }}
            style={{
              position: i !== index ? "absolute" : "relative",
              left: 0,
              right: 0,
              width: "100%",
              pointerEvents: i === index ? "auto" : "none",
            }}
          >
            {item}
          </motion.div>
        ))}
      </span>
    </motion.h1>
  );
}
