// src/TakeTasks.js
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./TakeTasks.css";

function TakeTasks() {
  const [selectedType, setSelectedType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [viewingTask, setViewingTask] = useState(null);

  const taskTypes = [
    "Buy & Delivery",
    "Drive",
    "Academic",
    "Home Assistance",
    "Tech (Electrical/Plumbing/etc)",
    "Event/Physical Work",
    "Booking/Online",
    "Others",
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const allTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(allTasks);
    };
    fetchTasks();
  }, []);

  const handleAccept = async () => {
    if (viewingTask) {
      const ref = doc(db, "tasks", viewingTask.id);
      await updateDoc(ref, { accepted: true });
      alert("Task accepted!");
      setViewingTask(null);
      setSelectedType(null);
    }
  };

  const filteredTasks = selectedType
    ? tasks.filter((t) => t.type === selectedType && !t.accepted)
    : [];

  return (
    <div className="take-tasks-container">
      {!selectedType && !viewingTask && (
        <>
          <h2>TAKE TASKS</h2>
          <div className="task-type-box">
            <p>Type of tasks you are looking for</p>
            <div className="grid">
              {taskTypes.map((type) => (
                <button key={type} onClick={() => setSelectedType(type)}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedType && !viewingTask && (
        <>
          <h3>{selectedType}</h3>
          <div className="tasks-grid">
            {filteredTasks.length === 0 ? (
              <p>No tasks available</p>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <p><strong>{task.title}</strong></p>
                  <p>{(task.description || "").slice(0, 30)}...</p>
                  <button onClick={() => setViewingTask(task)}>View Task</button>
                </div>
              ))
            )}
            <button className="back-btn" onClick={() => setSelectedType(null)}>⬅ Back</button>
          </div>
        </>
      )}

      {viewingTask && (
        <div className="task-details">
          <h2>DETAILS ON TASK</h2>
          <div className="task-box">
            <p><strong>Task:</strong> {viewingTask.title}</p>
            <p><strong>Type:</strong> {viewingTask.type}</p>
            <p><strong>Description:</strong> {viewingTask.description}</p>
            <p><strong>Date & Time:</strong> {viewingTask.date} {viewingTask.time}</p>
            <p><strong>Price:</strong> ₹{viewingTask.price}</p>
            <p><strong>Location:</strong> {viewingTask.location}</p>
          </div>
          <button className="accept-btn" onClick={handleAccept}>Accept the task</button>
          <button className="back-btn" onClick={() => setViewingTask(null)}>⬅ Back</button>
        </div>
      )}
    </div>
  );
}

export default TakeTasks;
