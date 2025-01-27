"use client"

import { cn } from "@/lib/utils"
import React, { useCallback, useEffect, useRef } from "react"

interface Props{
  children: React.ReactNode
  exceptionRef?: React.RefObject<HTMLElement>
  onClick: () => void
  className?: string
}

const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Gère les clics en dehors du composant
  const handleMouseClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInside =
        wrapperRef.current?.contains(target) ||
        exceptionRef?.current?.contains(target);

      if (!isClickInside) {
        onClick();
      }
    },
    [exceptionRef, onClick],
  );

  // Gère la touche Échap
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClick();
      }
    },
    [onClick],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseClick, handleKeyDown]);

  return (
    <div ref={wrapperRef} className={cn(className)}>
      {children}
    </div>
  )
}

export default ClickOutside
