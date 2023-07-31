const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token provided in headers');

    try {
        const validToken = jwt.verify(token, process.env.jwtKey);
        req.user = validToken;
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }

}


module.exports = verifyToken;