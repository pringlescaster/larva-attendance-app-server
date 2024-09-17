export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer

  console.log("Received token:", token); // Debugging line

  if (token == null) {
      console.log("Token not provided");
      return res.sendStatus(401); // No token
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.log("Token verification failed:", err.message);
          return res.sendStatus(403); // Invalid token
      }
      console.log("Token verified, user:", user);
      req.user = user;
      next();
  });
};
