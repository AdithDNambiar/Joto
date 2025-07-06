import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./PostTask.css";

function PostTask() {
  const [formData, setFormData] = useState({
    title: "",
    type: "Drive",
    description: "",
    date: "",
    time: "",
    price: "",
    location: "",
  });
  const [taskId, setTaskId] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [previousTasks, setPreviousTasks] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPreviousTasks(all);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (taskId) {
      const unsub = onSnapshot(doc(db, "tasks", taskId), (snap) => {
        if (snap.exists()) {
          const task = snap.data();
          setAccepted(task.accepted || false);
        }
      });
      return () => unsub();
    }
  }, [taskId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, type, description, date, time, price, location } = formData;
    if (!title || !description || !date || !time || !price || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...formData,
        accepted: false,
        messages: [],
        createdAt: new Date(),
      });
      setTaskId(docRef.id);
      setCurrentTask({ id: docRef.id, ...formData });
    } catch (error) {
      alert("Failed to upload task");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (taskId) {
      await deleteDoc(doc(db, "tasks", taskId));
      setTaskId(null);
      setCurrentTask(null);
      setFormData({
        title: "",
        type: "Drive",
        description: "",
        date: "",
        time: "",
        price: "",
        location: "",
      });
    }
  };

  const openChat = () => {
    navigate(`/chat/${taskId}/uploader`);
  };

  return (
    <div className="post-task-container">
      {!taskId ? (
        <>
          <h2 className="post-task-heading">POST TASK</h2>
          <div className="form-box">
            <div className="row">
              <input
                name="title"
                placeholder="What do you want to be done?"
                value={formData.title}
                onChange={handleChange}
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Drive</option>
                <option>Buy & Delivery</option>
                <option>Academic</option>
                <option>Home Assistance</option>
                <option>Tech (Electrical/Plumbing/etc)</option>
                <option>Event/Physical Work</option>
              </select>
              <input
                name="price"
                placeholder="Price you can give"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="description"
              placeholder="Task description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Post the task</button>
          </div>
        </>
      ) : (
        <div className="confirmation">
          <h2>
            ✅ <span style={{ color: "#007bff" }}>Task posted successfully</span>
          </h2>

          <div className="posted-box">
            <p><strong>Task:</strong> {currentTask.title}</p>
            <p><strong>Type:</strong> {currentTask.type}</p>
            <p><strong>Description:</strong> {currentTask.description}</p>
            <p><strong>Date & Time:</strong> {currentTask.date} {currentTask.time}</p>
            <p><strong>Price:</strong> ₹{currentTask.price}</p>
            <p><strong>Location:</strong> {currentTask.location}</p>
            <button className="delete-btn" onClick={handleDelete}>Delete task</button>
          </div>

          {accepted ? (
            <>
              <p style={{ color: "green", fontWeight: "bold", marginTop: "15px" }}>
                Task has been accepted ✅
              </p>
              <button className="chat-btn" onClick={openChat}>
                Chat with acceptor 💬
              </button>
            </>
          ) : (
            <p style={{ marginTop: "15px", fontStyle: "italic", color: "#555" }}>
              Please wait until your task will be accepted by someone.
            </p>
          )}

          <div className="task-list">
            <h3>Your previous tasks:</h3>
            {previousTasks.map((task) => (
              <div key={task.id} className="task-item">
                <p><strong>Task:</strong> {task.title}</p>
                <p><strong>Type:</strong> {task.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostTask;
