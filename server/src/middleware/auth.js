const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next)=>{

    try{
        const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({message : "no token provided"})
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.pId = decoded.pId;
    req.pemail = decoded.pemail;

    next();
    }
    catch(err){
        return re.status(401).json({message : "invalid token"})
    }
    
}

