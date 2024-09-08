"use client";
import { useState, useEffect, useReducer, use } from "react";
import io from "socket.io-client";
import DrawingBoard from "../../../DrawingBoard/DrawingBoard";
import Chat from "../../../Chat/Chat";
import { useParams, useSearchParams } from "next/navigation";
import { LeftPanel } from "@/app/components/LeftPanel/page";
const socket = io("http://localhost:8001");

export default function ChatRoom() {
  const params = useParams();
  const searchParams = useSearchParams();

  const roomId = params.roomId;
  const username = searchParams.get("username");

  const [wordToGuess, setWordToGuess] = useState<string>("magic");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  console.log(usersInRoom);
  // useEffect(() => {}, [roomId, username]);

  useEffect(() => {
    if (roomId && username) {
      console.log(`Joined Room ID: ${roomId} as ${username}`);

      // Join the room
      socket.emit("joinRoom", { roomId, username });

      // Listen for the receiveWord event from the server
      socket.on("receiveWord", (word) => {
        console.log("Random word received:", word);
        setWordToGuess(word);
      });

      socket.emit("startSendingWords", roomId);

      socket.on("receiveWord", (word) => {
        console.log("Random word received:", word);
        setWordToGuess(word);
      });

      // setInterval(() => {
      //   socket.on("receiveWord", (word) => {
      //     console.log("Random word received:", word);
      //     setWordToGuess(word);
      //   });
      // }, 80000);
      // Listen for the updateUsersInRoom event from the server
      socket.on("updateUsersInRoom", (users) => {
        console.log("Updated users in room:", users);
        setUsersInRoom(users);
      });

      // Clean up the socket listeners on component unmount
      return () => {
        socket.off("receiveWord");
        socket.off("updateUsersInRoom");
      };
    }
  }, [roomId, username]);

  return (
    <main className="flex justify-between h-[100vh] !bg-[#f2eeff]">
      <LeftPanel usersInRoom={usersInRoom} />
      <DrawingBoard wordToGuess={wordToGuess} />
      <Chat wordToGuess={wordToGuess} />
    </main>
  );
}
