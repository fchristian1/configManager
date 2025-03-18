import { fetcher } from "./common/fetcher";

export async function getAll(system: string) {
    return fetcher(`/${system}`);
}
export async function getOne(system: string, id: string) {
    return fetcher(`/${system}/${id}`);
}
export async function addOne(system: string, data: any) {
    return fetcher(`/${system}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export async function updateOne(
    system: string,
    id: string,
    data: any
) {
    return fetcher(`/${system}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export async function deleteOne(
    system: string,
    id: string
) {
    return fetcher(`/${system}/${id}`, {
        method: "DELETE",
    });
}
