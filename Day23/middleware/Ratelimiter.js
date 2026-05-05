const {redisClient} = require("../config/redis");


const Ratelimiter = async(req,res,next)=> {

 try{

    const ip = req.ip;

    // increments value of ip by one
   const count = await redisClient.incr(ip);
   
   if(count>60){
    throw new Error("User Limit Exceeded");
   }

   // jab count ki value 1 hogi tab uske baad 1 hr mein redisclient 
   if(count==1){
     redisClient.expire(ip,3600);
   }

 }
catch(err){
    res.send("Error"+err.message);
}

}

module.exports=Ratelimiter;