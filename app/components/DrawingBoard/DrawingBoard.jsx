"use client";
import React, { useState, useEffect } from "react";
import { useDraw } from "../../../hooks/useDraw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";
import ThicknessButtons from "./ThicknessButtons";
import { ColorPalette } from "./ColorPalette";

export default function DrawingBoard({ wordToGuess }) {
  const { canvasRef, onMouseDown } = useDraw(drawLine);

  const [colorPointerValue, setColorPointerValue] = useState(0);
  const [lineColor, setLineColor] = useState("hsl(0, 0%, 0%)");
  const [lineThickness, setLineThickness] = useState(5);
  const [modes, setModes] = useState({
    eraserMode: false,
    clearMode: false,
  });

  function drawLine(prevPoint, currPoint, ctx) {
    const { x: currX, y: currY } = currPoint;
    const color = modes.eraserMode ? "white" : lineColor;
    const linewidth = modes.eraserMode ? 20 : lineThickness;

    let startpoint = prevPoint ?? currPoint;
    ctx.beginPath();
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startpoint.x, startpoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startpoint.x, startpoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    const radius = Math.floor(linewidth / 2);
    ctx.arc(currX, currY, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  const handleColorChange = (colorOrEvent) => {
    let color;
    let hue;
    console.log(colorOrEvent);
    if (typeof colorOrEvent === "string") {
      color = colorOrEvent;
      if (colorOrEvent == "hsl(0, 0%, 0%)") {
        setLineColor("hsl(0, 0%, 0%)");
      } else {
        hue = parseInt(color.match(/hsl\((\d+),/)[1], 10);
        setLineColor(`hsl(${hue}, 100%, 50%)`);
      }
    } else {
      const value = colorOrEvent.target.value;
      color = `hsl(${value}, 100%, 50%)`;
      setColorPointerValue(value);
      setLineColor(color);
      hue = value;
    }

    setModes((prevModes) => ({
      ...prevModes,
      eraserMode: false,
    }));
    setColorPointerValue(hue);

    setModes((prevModes) => ({
      ...prevModes,
      clearMode: false,
    }));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setModes((prevModes) => ({
      ...prevModes,
      clearMode: true,
    }));
  };

  useEffect(() => {
    clearCanvas();
  }, [wordToGuess]);

  const [displayedWord, setDisplayedWord] = useState("");
  const createDashedWord = (word) => "_ ".repeat(word.length).trim();

  // Function to reveal a random letter in the dashed word
  const revealRandomLetter = (dashedWord, originalWord) => {
    const dashArray = dashedWord.split(" ");
    const indicesToReveal = [];

    // Get indices of dashes
    for (let i = 0; i < dashArray.length; i++) {
      if (dashArray[i] === "_") indicesToReveal.push(i);
    }

    if (indicesToReveal.length > 0) {
      const randomIndex =
        indicesToReveal[Math.floor(Math.random() * indicesToReveal.length)];
      dashArray[randomIndex] = originalWord[randomIndex];
    }

    return dashArray.join(" ");
  };

  useEffect(() => {
    // Initialize the displayed word as dashes
    setDisplayedWord(createDashedWord(wordToGuess));

    let revealedLettersCount = 0;
    const totalLettersToReveal = Math.ceil(wordToGuess.length / 2); // Reveal up to half the letters

    // Start revealing after 50 seconds
    const initialRevealTimeout = setTimeout(() => {
      const revealInitialLetters = setInterval(() => {
        if (revealedLettersCount < totalLettersToReveal) {
          setDisplayedWord((prevDisplayedWord) =>
            revealRandomLetter(prevDisplayedWord, wordToGuess)
          );
          revealedLettersCount++;
        } else {
          clearInterval(revealInitialLetters);
        }
      }, 2000); // Reveal all initial letters quickly
    }, 40000); // 50 seconds delay

    return () => {
      clearTimeout(initialRevealTimeout);
    };
  }, [wordToGuess]);

  return (
    <div className="flex flex-col justify-center w-[700px] text-center ">
      <div className="word-display text-[#7f36ba] text-lg mr-[250px]">
        {displayedWord}
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={450}
        onMouseDown={onMouseDown}
        className="border border-[#7f36ba] rounded-md border-2 max-w-[700px] h-[450px] bg-white mb-[20px]"
      />
      <div className="custom flex mx-2">
        <div className="color-selectors flex">
          <div
            className="selected-color h-[60px] w-[60px] mr-[10px] border-2 border-[#7f36ba] rounded-sm"
            style={{ backgroundColor: lineColor }}
          ></div>
          <div className="flex-col">
            <ColorPalette onSelectColor={handleColorChange} />
            <input
              type="range"
              min="0"
              max="360"
              onChange={handleColorChange}
              className="w-60 h-3"
              style={{
                background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), 
              hsl(60, 100%, 50%), 
              hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), 
              hsl(240, 100%, 50%), 
              hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%)
            )`,
                WebkitAppearance: "none",
                outline: "none",
                borderRadius: "100px",
                cursor: "pointer",
              }}
              value={colorPointerValue}
            />
          </div>
        </div>
        <div className="option-buttons mx-4">
          <button
            onClick={() => {
              setModes((prevModes) => ({
                // ...prevModes,
                eraserMode: !prevModes.eraserMode,
                clearMode: false,
              }));
            }}
            className={`bg-white border rounded-md mx-2 w-[40px] h-[30px] ${
              modes.eraserMode ? "border-[#7f36ba]" : "border-black"
            }`}
          >
            <FontAwesomeIcon
              icon={faEraser}
              className={`${
                modes.eraserMode ? "text-[#7f36ba]" : "text-black"
              }`}
            />
          </button>
          <button
            onClick={clearCanvas}
            className={`bg-white border border-[#7f36ba] rounded-md w-[40px] h-[30px] mx-2 ${
              modes.clearMode ? "border-[#7f36ba]" : "border-black"
            }`}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className={`${modes.clearMode ? "text-[#7f36ba]" : "text-black"}`}
            />
          </button>
          <div className="thickness-buttons">
            <ThicknessButtons
              onSelectThickness={setLineThickness}
              selectedThickness={lineThickness}
              setModes={setModes}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${lineColor};
          cursor: pointer;
          border: 2px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${lineColor};
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
