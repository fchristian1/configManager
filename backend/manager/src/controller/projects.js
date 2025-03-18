import { userFromToken } from "../common/token.js";
import { deleteOne, find, findOne, insertOne } from "../db/mongo.js";

const collectionName = "projects";

export const controllerProjects = {
    async getAll(req, res) {
        const data = await find(userFromToken(req), collectionName);
        res.json(data);
    },
    async getOne(req, res) {
        const id = req.params.id;
        const data = await findOne(userFromToken(req), collectionName, id);
        res.json(data);
    },
    async addOne(req, res) {
        try {
            const body = req.body;
            const id = crypto.randomUUID();
            insertOne(userFromToken(req), collectionName, id, body);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "error" });
            return;
        }
        res.json({ message: "addOne" });
    },
    async updateOne(req, res) {
        insertOne(userFromToken(req), collectionName, req.params.id, req.body);
        res.json({ message: "updateOne" });
    },
    async deleteOne(req, res) {
        deleteOne(userFromToken(req), collectionName, req.params.id);
        res.json({ message: "deleteOne" });
    }
};
