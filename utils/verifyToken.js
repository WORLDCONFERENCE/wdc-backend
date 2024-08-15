const {CreateError}=require('./CreateError.js');


 const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_token;

    if(!token){
        return next(CreateError(401,"you are not authenticated"));
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err){
            return next(CreateError(400,"Token is not valid"));
        }

        req.user=user;
        next();
    })
};


 const verifyUser=(req,res,next)=>{
    verifyToken(req,res,next,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }
        else{
         return next(CreateError(403,"You are not authorized"))
        }

    })
}


 const verifyAdmin=(req,res,next)=>{
    verifyToken(req,res,next,()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
            return next(CreateError(401,"you are not authorized"))
        }
    })
}

module.exports={verifyUser,verifyAdmin,verifyToken}