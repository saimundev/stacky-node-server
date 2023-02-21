import jwt from "jsonwebtoken";
const auth = (req,res,next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET, (error,user) => {
            if (error) {
                res.status(400).json({ message: "token is not valid" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(400).json({ message: "You are not authorize" });
    }
}


export default auth;