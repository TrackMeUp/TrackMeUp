const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

export const getStudentPerformance = async (studentId, subjectId = null) => {
  try {
    let url = `${API_URL}/performance/student/${studentId}`;
    if (subjectId) {
      url += `?subjectId=${subjectId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching student performance");
    }

    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getAccessibleStudents = async (userId, role) => {
  try {
    const response = await fetch(
      `${API_URL}/performance/accessible-students?userId=${userId}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching accessible students");
    }

    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getSubjectPerformanceComparison = async (subjectId) => {
  try {
    const response = await fetch(
      `${API_URL}/performance/subject-comparison/${subjectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error fetching subject comparison");
    }

    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
