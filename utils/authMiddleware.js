import jwt from "jsonwebtoken";

// Middleware function to authenticate the token
export const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Ensure this matches your secret
        req.user = { id: decodedToken.id }; // Use 'id' from the payload
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ msg: 'Unauthorized' });
    }
};
