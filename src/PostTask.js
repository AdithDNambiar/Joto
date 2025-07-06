import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
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
  const navigate = useNavigate();

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
        createdAt: new Date(),
        accepted: false,
      });
      setTaskId(docRef.id);

      // Check if accepted every 3s
      const checkAccepted = async () => {
        const snap = await getDoc(doc(db, "tasks", docRef.id));
        if (snap.exists() && snap.data().accepted) {
          navigate(`/chat/${docRef.id}/uploader`);
        }
      };
      const interval = setInterval(checkAccepted, 3000);
      setTimeout(() => clearInterval(interval), 180000);
    } catch (error) {
      alert("Failed to upload task");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (taskId) {
      await deleteDoc(doc(db, "tasks", taskId));
      setTaskId(null);
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

  return (
    <div className="post-task-container">
      {!taskId ? (
        <>
          <h2 className="post-task-heading">POST TASK</h2>
          <div className="form-box">
            <div className="row">
              <input name="title" placeholder="What do you want to be done?" value={formData.title} onChange={handleChange} />
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="row">
              <select name="type" value={formData.type} onChange={handleChange}>
                <option>Drive</option>
                <option>Buy & Delivery</option>
                <option>Academic</option>
                <option>Home Assistance</option>
                <option>Tech (Electrical/Plumbing/etc)</option>
                <option>Event/Physical Work</option>
              </select>
              <input name="price" placeholder="Price you can give" value={formData.price} onChange={handleChange} />
            </div>
            <textarea name="description" placeholder="Task description" value={formData.description} onChange={handleChange} />
            <input name="time" type="time" value={formData.time} onChange={handleChange} />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
            <button onClick={handleSubmit}>Post the task</button>
          </div>
        </>
      ) : (
        <div className="confirmation">
          <h2>✅ <span style={{ color: "#007bff" }}>Task posted successfully</span></h2>
          <p>Please wait until your task is accepted.</p>
          <div className="posted-box">
            <p><strong>Task to be done:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {formData.type}</p>
            <p><strong>Description:</strong> {formData.description}</p>
            <p><strong>Time:</strong> {formData.date} {formData.time}</p>
            <p><strong>Price:</strong> ₹{formData.price}</p>
            <p><strong>Location:</strong> {formData.location}</p>
          </div>
          <button className="delete-btn" onClick={handleDelete}>Delete task</button>
        </div>
      )}
    </div>
  );
}

export default PostTask;
