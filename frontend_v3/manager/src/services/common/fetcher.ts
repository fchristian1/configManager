const REACT_APP_API_URL = "http://localhost:3000/api/v1/";
export async function fetcher<T>(
    path: string,
    body: any,
    method: string,
    token?: string
): Promise<T> {
    console.log("fetching projects2");
    token =
        token && token.length > 0 ? `Bearer ${token}` : "";
    if (method === "GET" || method === "HEAD") {
        const response = await fetch(
            `${REACT_APP_API_URL + path}`,
            {
                method: method,
                headers: {
                    Authorization: token,
                },
            }
        );
        const data = await response.json();
        console.log(data);
        return data as T;
    } else {
        const response = await fetch(
            `${REACT_APP_API_URL + path}`,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(body),
            }
        );
        const data = await response.json();
        console.log(data);
        return data as T;
    }
}
