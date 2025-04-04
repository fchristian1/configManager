import { getInstanceData } from "../common/data.js";

export const outputController = async (req, res) => {
    const { id } = req.params;
    const data = await getInstanceData(id);
    if (!data) {
        res.status(404).json({ message: "Instance not found" });
        return Error(`Instance ${id} not found`);
    }
    let state = data.state;
    let output = state.output
    res.json({ type: "instance:output", time: Date.now(), output });
}