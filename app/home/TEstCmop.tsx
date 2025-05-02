'use client'

import { useToast } from "@/hooks/use-toast";

export const OnToast = () => {
  const {toast} = useToast()
  return (
    <button
      onClick={() => {
        toast({
          title: "Check your email 📬",
          description: "A new confirmation email has been sent.",
          duration: 3500,
        });
      }}
      className="bg-green-500 text-white px-4 py-2 rounded mt-4"
    >
      Test Toast
    </button>
  );
};
