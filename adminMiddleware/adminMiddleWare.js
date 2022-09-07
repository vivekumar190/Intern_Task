const User=require('../models/User');
const jwt=require('jsonwebtoken');
const auth= async(req,res,next)=>{
        if(req?.headers?.authorization?.startsWith('Bearer')){
        const token=req.headers.authorization.split(' ')[1];
        const verify=jwt.verify(token,'SecretKey');
        const  user=await User.findById(verify.id);
        req.user=user;
        next();
        }
else {
    return res.json('Token Not Attached or invalid token');
}
};
module.exports=auth;