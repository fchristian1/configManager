import { userFromToken } from "../common/token.js";
import { deleteOne, find, findFilter, findOne, insertOne } from "../db/mongo.js";



export const controllerData = {
    async getAll(req, res) {
        const collectionName = req.params.collection;
        const data = await find(userFromToken(req), collectionName);
        res.json(data);
    },
    async getAllParentId(req, res) {
        const collectionName = req.params.collection;
        const parentId = req.params.parentId;
        const data = await findFilter(userFromToken(req), collectionName, { parentId });
        res.json(data);
    },
    async getOne(req, res) {
        const collectionName = req.params.collection;
        const id = req.params.id;
        const data = await findOne(userFromToken(req), collectionName, id);
        res.json(data);
    },
    async addOne(req, res) {
        try {
            const collectionName = req.params.collection;
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
        const collectionName = req.params.collection;
        insertOne(userFromToken(req), collectionName, req.params.id, req.body);
        res.json({ message: "updateOne" });
    },
    async deleteOne(req, res) {
        const collectionName = req.params.collection;
        deleteOne(userFromToken(req), collectionName, req.params.id);
        res.json({ message: "deleteOne" });
    }
};
