"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import words from "./components/words";
// import { headers } from "next/headers";
export default function Home() {
  const [username, setUsername] = useState("");
  const [roomToJoin, setRoomToJoin] = useState<string | null>(null); // State for the room ID to join
  const [isJoinRoomClicked, setIsJoinRoomClicked] = useState(false);
  const router = useRouter();

  const index = Math.floor(Math.random() * words.length);

  const handleCreateRoom = () => {
    const roomId = Math.floor(1000 + Math.random() * 9000).toString(); // Generate random room ID
    router.push(`/components/ChatRoom/${roomId}/${index}?username=${username}`);
  };

  const handleJoinRandomRoom = () => {
    const roomId = Math.floor(1000 + Math.random() * 9000).toString();
    router.push(`/components/ChatRoom/${roomId}/${index}?username=${username}`);
  };
  const handleJoinRoom = () => {
    setIsJoinRoomClicked(true);
    if (roomToJoin && roomToJoin.trim() !== "") {
      router.push(
        `/components/ChatRoom/${roomToJoin}/${index}?username=${username}`
      );
    } else {
      alert("Please enter a room ID to join.");
    }
  };
  return (
    <div className="flex flex-col items-center bg-[#212020] h-[100vh]">
      <h1>Drawing Gamee</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="input"
      />
      <div>
        <button onClick={handleJoinRandomRoom} className="join-button">
          Join Random Room
        </button>
        <button onClick={handleCreateRoom} className="join-button">
          Create Room
        </button>
      </div>
      <div>
        <input
          type="text"
          value={roomToJoin || ""}
          onChange={(e) => setRoomToJoin(e.target.value)}
          placeholder="Enter your username"
          className={isJoinRoomClicked ? "input visible" : "input hidden"}
        />
        <button onClick={handleJoinRoom} className="join-button">
          Join Room
        </button>
      </div>
      <style jsx>{`
        .input {
          color: black;
          padding: 10px;
          margin: 20px 0;
          border-radius: 5px;
          border: 1px solid #7f36ba;
        }
        .join-button {
          padding: 10px 20px;
          margin: 10px 30px;
          width: 200px;
          background-color: #7f36ba;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
