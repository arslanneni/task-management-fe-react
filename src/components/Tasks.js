// ===============================
//          This File Includes UI And Logic
// ===============================

import React, { useEffect, useState } from "react";
import {
  createTasks,
  updateTaskAPI,
  getTaskByIDAPI,
  deleteTaskAPI,
  loadTasks,
} from "../services/TaskService"; // Ensure this points to the correct path for `api.js`
import { toast } from "react-toastify";

const Tasks = () => {
  const initialTaskState = {
    TITLE: "",
    DESCRIPTION: "",
  };

  const [task, setTask] = useState(initialTaskState);
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null); // To track the task being edited

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await loadTasks();
      if (response && response.status === "SUCCESS") {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (task.TITLE.trim() && task.DESCRIPTION.trim()) {
      const payload = {
        title: task.TITLE,
        description: task.DESCRIPTION,
      };

      try {
        if (isEdit) {
          // Update logic
          const updatedTask = await updateTaskAPI(editTaskId, payload);
          if (updatedTask.status === "SUCCESS") {
            setTasks(
              tasks.map((t) =>
                t.id === editTaskId ? { ...t, ...updatedTask.data } : t
              )
            );
            toast.success("Task updated successfully!");
          } else {
            toast.error(updatedTask.message);
          }
        } else {
          // Create logic
          const createdTask = await createTasks(payload);
          if (createdTask.status === "SUCCESS") {
            setTasks([...tasks, createdTask.data]);
            toast.success(createdTask.message);
          } else {
            toast.error(createdTask.message);
          }
        }

        // Reset the form
        setTask(initialTaskState);
        setIsEdit(false);
        setEditTaskId(null);
      } catch (error) {
        console.error("Failed to add/update task:", error.message);
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await deleteTaskAPI(id); // Call the delete API
      if (response.status === "SUCCESS") {
        setTasks(tasks.filter((task) => task.id !== id)); // Remove the task from the state
        toast.success("Task deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete the task.");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("An error occurred while deleting the task.");
    }
  };

  const handleEditTask = async (id) => {
    try {
      const task = await getTaskByID(id); // Fetch the task by ID
      if (task) {
        setTask({
          TITLE: task.title,
          DESCRIPTION: task.description,
        });
        setIsEdit(true);
        setEditTaskId(id);
      } else {
        toast.error("Task not found.");
      }
    } catch (error) {
      console.error("Error fetching the task:", error);
      toast.error("Failed to fetch task details.");
    }
  };

  const getTaskByID = async (id) => {
    try {
      const response = await getTaskByIDAPI(id);
      if (response.status === "SUCCESS") {
        return response.data[0];
      } else {
        toast.error(response.message || "Task not found.");
        return null;
      }
    } catch (err) {
      console.error("Error fetching task by ID:", err);
      toast.error("An error occurred while fetching the task.");
      return null;
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Task Manager</h1>

      <form onSubmit={handleAddTask}>
        {/* Title Input */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="TITLE"
            id="title"
            placeholder="Add Task Title"
            value={task.TITLE}
            onChange={handleInputChange}
          />
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            name="DESCRIPTION"
            id="description"
            placeholder="Add Task Description"
            value={task.DESCRIPTION}
            onChange={handleInputChange}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          {isEdit ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div
        className="list-container mt-3"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <ul className="list-group">
          {tasks.map((tasksss) => (
            <li
              key={tasksss.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {tasksss.title + " " + tasksss.description}
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditTask(tasksss.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTask(tasksss.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
