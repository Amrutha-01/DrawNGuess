"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8001");

interface ChatProps {
  wordToGuess: string;
}

const Chat: React.FC<ChatProps> = ({ wordToGuess }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  console.log(wordToGuess);

  const handleMessage = (msg: string) => {
    const isCorrect =
      msg.trim().toLowerCase() == wordToGuess.trim().toLowerCase();
    console.log(isCorrect, wordToGuess);
    const displayMessage = isCorrect ? "You guessed the word!" : msg;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: displayMessage, isCorrect },
    ]);
  };
  console.log(message, messages);
  useEffect(() => {
    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [wordToGuess]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{ color: msg.isCorrect ? "green" : "black" }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          style={{ color: "black" }}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        {/* <button type="submit">Send</button> */}
      </form>

      <style jsx>{`
        .chat-container {
          width: 270px;
          height: 100vh;
          border-left: 1px solid #ccc;
          right: 0;
          top: 0;
          background: #fff;
        }
        .messages {
          height: calc(100% - 65px);
          overflow-y: scroll;
          padding: 10px;
        }
        .message {
          padding: 5px;
          border-bottom: 1px solid #ddd;
        }
        form {
          display: flex;
          padding: 9px;
          border-top: 1px solid #ccc;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px;
        }
        button {
          padding: 10px;
          border: none;
          background: #0070f3;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chat;
