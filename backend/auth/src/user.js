import { getAll, saveAll } from "./data.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as UUID } from 'uuid';

const SECRET = 'secret';

let users = getAll();

export const createUser = (email, password) => {
    if (getUser(email)) {
        return;
    }
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const user = {
        userId: UUID(),
        email,
        passwordHash: hashPassword(password, createdAt, SECRET),
        createdAt,
        updatedAt
    };
    users.push(user);
    saveAll(users);
    return user;
}

export const getUser = (email) => {
    return users.find(user => user.email === email);
}

export const hashPassword = (password, salt, secret) => {
    return crypto.createHmac('sha256', secret)
        .update(salt + password)
        .digest('hex');
}

export const checkPassword = (email, password) => {
    const user = getUser(email);
    if (!user) {
        return false;
    }
    return user.passwordHash === hashPassword(password, user.createdAt, SECRET);
}

export const createJWT = (email, userId) => {
    // Create a new token with the email in the payload and the secret
    return jwt.sign({ email, userId }, SECRET);
}

export const verifyJWT = (token) => {
    try {
        // Verify the token and return the payload
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}
