import jwt from 'jsonwebtoken';

export const getAuthHandler = function (req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw { message: 'Le token JWT est manquant' };
        }
        const decodedToken = jwt.verify(token, '.ssl/private_key.pem');
        const userInfo = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role
        };
        return res.send({ message: 'Accès autorisé', userInfo: userInfo });
    } catch (err) {
        return res.status(401).send({ message: 'Utilisateur non-identifié', error: err });
    }
};

export const getHomeHandler = (req, res) => {
    return res.send({'hello': 'world'});
};
