import { findOne } from "../db/mongo.js"

export const getInstanceData = async (id) => {
    const data = await findOne("instances", id);
    if (!data) {
        return null;
    }
    return data;
}