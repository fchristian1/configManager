import jwt from 'jsonwebtoken';

const secret = process.env.SECRET ?? "secret";

export const userFromToken = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.userId;
    return userId;
}