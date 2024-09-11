import jwt from 'jsonwebtoken';

export const headerAuth = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    // Extract token from the Authorization header (format: Bearer <token>)
    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: Malformed token' });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = { id: decodedToken.id }; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
    }
};
