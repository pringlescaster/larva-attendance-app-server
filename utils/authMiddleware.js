import jwt from "jsonwebtoken";

// Middleware to authenticate token and attach user to req.user
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach the decoded user to req.user
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};
