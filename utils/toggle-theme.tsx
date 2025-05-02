"use client";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  console.log("Current theme:", theme);
  return (
    <div>
      {theme === "light" ? (
        <motion.button
          whileHover={{ scale: 1.2, rotate: 45 }}
          key={"sun"}
          onClick={() => setTheme("dark")}
        >
          <Icon icon="si:sun-line" className="text-2xl" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.2, rotate: -8 }}
          key={"moon"}
          onClick={() => setTheme("light")}
        >
          <Icon icon="line-md:moon-alt-loop" className="text-2xl" />
        </motion.button>
      )}
    </div>
  );
}