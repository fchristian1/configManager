export const getAll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return [];
    }
    try {
        const response = await fetch("http://localhost:3000/api/v1/todos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.status.toString().startsWith("2")) {
            throw new Error("Error: " + response.status);
        }
        return response.json();
    } catch (error) {
        console.error("Error:", error);
    }
    return [];
};

export const saveAll = async (data: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return [];
    }
    await fetch("http://localhost:3000/api/v1/todos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};
