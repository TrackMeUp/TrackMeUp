const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

export const getSubjects = async () => {
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching subjects");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getSubjectById = async (subjectId) => {
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching subject");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const createSubject = async (subjectData) => {
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error creating subject");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error updating subject");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error deleting subject");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const assignUserToSubject = async (subjectId, userId, role) => {
  try {
    const response = await fetch(
      `${API_URL}/subjects/${subjectId}/assignuser`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id: userId, role: role }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error assigning user to subject");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
