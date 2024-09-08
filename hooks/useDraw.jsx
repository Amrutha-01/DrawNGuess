import React, { useEffect, useRef, useState } from "react";

export const useDraw = (drawLine) => {
  const [mouseDown, setMouseDown] = useState(false);
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);

  const onMouseDown = () => setMouseDown(true);
  const mouseUpHandler = () => {
    setMouseDown(false);
    prevPoint.current = null;
  };

  useEffect(() => {
    const handler = (e) => {
      if (!mouseDown) return;
      const currPoint = pointInCanvas(e);
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currPoint) return;
      drawLine(prevPoint.current, currPoint, ctx);
      prevPoint.current = currPoint;
    };

    const pointInCanvas = (e) => {
      const canvas = canvasRef.current;
      // console.log(canvas)
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [drawLine]);
  return { canvasRef, onMouseDown };
};
