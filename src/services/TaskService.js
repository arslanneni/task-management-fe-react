// ===============================
//          This File Includes All API Helper Functions
// ===============================

const BASE_URL = "http://localhost:3000/tasks";

/**
 * Fetches all tasks from the API.
 * @returns {Promise<Array>} A promise resolving to an array of tasks.
 */
export const loadTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getAllTasks`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
};
export const createTasks = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/createTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error.message);
    throw error;
  }
};

export const getTaskByIDAPI = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/getTaskByID/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
};
export const updateTaskAPI = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/updateTask/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Error updating task");
  }
};
export const deleteTaskAPI = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteTask/${id}`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    throw new Error("Error deleting task");
  }
};
