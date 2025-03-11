export const getAll = async () => {
    const response = await fetch("http://localhost:3010/todos");
    return response.json();
};

export const saveAll = async (data: any) => {
    await fetch("http://localhost:3010/todos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
};
