import jwt from 'jsonwebtoken';


//ensured Authenticaticated To confirm that a user is logged in and has a valid session when accessing protected routes or pages on the web application.
export const ensureAuthenticated = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = { id: decodedToken.id }; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
    }
};
