import { getInstanceData } from "../common/data.js";
import { insertOne } from "../db/mongo.js";


export const activeController = async (req, res) => {
    const { id } = req.params;
    const data = await getInstanceData(id);
    if (!data) {
        res.status(404).json({ message: "Instance not found" });
        return Error(`Instance ${id} not found`);
    }
    let state = data.state;
    if (state?.commander == "running") {
        res.status(405).json({ error: "01", message: "commander is running, wait for ready state" });
        return Error(`commander is running, wait for ready state`);
    }
    const { commanderToggle } = data;
    const responseInsertOne = await insertOne("instances", id, { commanderToggle: !commanderToggle, status: "Active" });
    res.json({ type: "instance:controll", time: Date.now(), controll: "active" });
}
export const inactiveController = async (req, res) => {
    const { id } = req.params;
    const data = await getInstanceData(id);
    if (!data) {
        res.status(404).json({ message: "Instance not found" });
        return Error(`Instance ${id} not found`);
    }
    let state = data.state;
    if (state?.commander == "running") {
        res.status(405).json({ error: "01", message: "commander is running, wait for ready state" });
        return Error(`commander is running, wait for ready state`);
    }
    const { commanderToggle } = data;
    const responseInsertOne = await insertOne("instances", id, { commanderToggle: !commanderToggle, status: "Inactive" });
    res.json({ type: "instance:controll", time: Date.now(), controll: "inactive" });
}
export const restartController = async (req, res) => {
    const { id } = req.params;
    const data = await getInstanceData(id);
    if (!data) {
        res.status(404).json({ message: "Instance not found" });
        return Error(`Instance ${id} not found`);
    }
    let state = data.state;
    if (state?.commander == "running") {
        res.status(405).json({ error: "01", message: "commander is running, wait for ready state" });
        return Error(`commander is running, wait for ready state`);
    }
    const { commanderToggle } = data;
    const responseInsertOne = await insertOne("instances", id, { commanderToggle: !commanderToggle, commanderCommand: "restart" });
    res.json({ type: "instance:controll", time: Date.now(), controll: "restart" });
}