"use client";
import React from "react";

interface ILeftPanel {
  usersInRoom: string[];
}
function LeftPanel({ usersInRoom }: ILeftPanel) {
  const clockStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e4dfe8",
  };

  const timerStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
  };

  return (
    <div className="flex flex-col w-[20vw] bg-[#260640] items-center ">
      <div className="flex justify-between items-center px-[2vw] py-[1vw] w-[18vw]">
        <div className="clock w-[50px] h-[50px] rounded-[50%] relative flex justify-center items-center bg-[#e4dfe8]">
          <div id="timer" style={timerStyle}>
            80
          </div>
        </div>
        <p>Round 1 of 3</p>
      </div>

      <div className=" border-t-[1px] border-white w-[18vw]"></div>
      {usersInRoom.length > 0 &&
        usersInRoom.map((user) => <div key={user}>{user}</div>)}
    </div>
  );
}

module.exports = LeftPanel;
