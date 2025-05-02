"use client"
import { useState } from "react";

function useShowPassword() {
  const [showPassword, setShowPassword] = useState(false);
  return { showPassword, setShowPassword };
}

function useLoadingState() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return { isSubmitting, setIsSubmitting };
}

export { useShowPassword, useLoadingState };
