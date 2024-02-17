import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken';

const users = []; // Simule BDD pour le stockage des utilisateurs
const roles = ['admin', 'utilisateur'];

export const addUser = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = createHash("sha256").update(password).digest().toString("hex");
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(401).send({
            message: "Utilisateur déjà enregistré",
            user: existingUser
        });
    }

    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const newUser = {
        email,
        password: hashedPassword,
        role: randomRole
    };
    users.push(newUser);
    return res.status(201).send({
        message: "Utilisateur créé avec succès",
        user: newUser
    });
};

export const loginUser = async function (req, res) {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (user && user.password === createHash("sha256").update(password).digest().toString("hex")) {
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, '.ssl/private_key.pem', { expiresIn: '1h' });

        return res.status(200).send({
            message: "Connexion réussie",
            token: token
        });
    } else {
        return res.status(401).send({
            message: "Échec de la connexion. Utilisateur non-identifié."
        });
    }
};
