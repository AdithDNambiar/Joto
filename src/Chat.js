import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot
} from "firebase/firestore";
import "./Chat.css";

function Chat() {
  const { taskId, role } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "tasks", taskId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
      }
    });

    return () => unsub();
  }, [taskId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgObj = {
      text: message,
      sender: role,
      timestamp: new Date(),
    };

    await updateDoc(doc(db, "tasks", taskId), {
      messages: arrayUnion(msgObj),
    });

    setMessage("");
  };

  const markAsDone = async () => {
    await updateDoc(doc(db, "tasks", taskId), {
      status: "done",
    });
    alert("Task marked as done!");
  };

  const cancelTask = async () => {
    await updateDoc(doc(db, "tasks", taskId), {
      accepted: false,
      messages: [],
    });
    alert("Task cancelled.");
  };

  return (
    <div className="chat-container">
      <h2>Chat with the {role === "uploader" ? "acceptor" : "uploader"}</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === role ? "msg self" : "msg"}>
            {msg.text}
          </div>
        ))}
        <input
          placeholder="type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
      <div className="buttons">
        <button className="done-btn" onClick={markAsDone}>
          Got task done
        </button>
        {role === "uploader" && (
          <button className="cancel-btn" onClick={cancelTask}>
            Cancel task
          </button>
        )}
      </div>
    </div>
  );
}

export default Chat;
