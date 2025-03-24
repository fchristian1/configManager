const apiUrl = "http://localhost:3000/api/v1/manager/";

export const fetcher = async (url: string, options: RequestInit = {}) => {
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
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error("Error: " + response.status);
    }
    const res = await response.json();
    return res;
};
