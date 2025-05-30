const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

export const getCourses = async () => {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching courses");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error creating course");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error updating course");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error deleting course");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
