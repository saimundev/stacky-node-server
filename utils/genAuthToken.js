import jwt from "jsonwebtoken"
const genAuthToken = (user) => {
    const token = jwt.sign({
        userId: user._id,
        name: user.name,
        email: user.email
        
    }, process.env.SECRET);

    return token;
    
}

export default genAuthToken;