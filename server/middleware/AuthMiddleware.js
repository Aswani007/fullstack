import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];

    if (!token || token === undefined || token === null) {
      return res.status(401).send({
        message: "Please Send Proper Token",
        error: true,
      });
    }
    //verify user token
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
      if (err)
        return res.status(403).json({
          message: "Token is not valid",
          error: true,
        });
      //get userId from token
      req.userId = payload.userId;
      next();
    });
  } catch (error) {
    return res.status(500).send({
      message: "User Verification Error - Server Error",
      error: error.message,
    });
  }
};
