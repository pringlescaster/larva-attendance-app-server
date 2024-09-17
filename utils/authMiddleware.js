import jwt from "jsonwebtoken";

//middleware function to decode token
export const authenticateToken = (req,res,next) =>{ 
    // const accessToken = req.cookies.accessToken
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ msg: 'No token provided'})
    }
        
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = { id: decodedToken.id }
        next()
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }
}