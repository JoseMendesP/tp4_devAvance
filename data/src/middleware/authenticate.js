import jwt from 'jsonwebtoken';

export async function getAuthenticate(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            throw { message: 'Le jeton JWT est manquant' };
        }

        const decodedToken = jwt.verify(token, '.ssl/private_key.pem');
        req.userData = decodedToken;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Utilisateur non-identifié', error: err });
    }
}
