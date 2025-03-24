// Copiar archivo frontend/.env.example a frontend/.env
const API_URL = import.meta.env.VITE_TMU_API_URL || "http://localhost:3000/api";

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
