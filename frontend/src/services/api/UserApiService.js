// Copiar archivo frontend/.env.example a frontend/.env
const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching users");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error creating user");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error updating user");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error deleting user");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error loginUser");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
