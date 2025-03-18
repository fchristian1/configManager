const apiUrl = "http://localhost:3000/api/v1/manager";

export const fetcher = async (
    url: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error: " + response.status);
    }
    return response.json();
};
