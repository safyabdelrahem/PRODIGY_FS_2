const User = require("../model/userModel");
const bcrypt= require("bcrypt");

// Register
module.exports.register= async(req,res,next)=>{
// console.log(req.body);
try{
    const {username,email,password} = req.body;
const usernameCheck= await User.findOne({username});
if (usernameCheck){
    return res.json({msg:"username already used",status:false})
}
const emailCheck= await User.findOne({email});
if (emailCheck){
    return res.json({msg:"email already used",status:false});
}
const hashedPassword = await bcrypt.hash(password,10);
const user=await User.create({
    email,
    username,
    password:hashedPassword,
});
delete user.password;
return res.json({status:true,user});
}catch(ex){
next(ex);
}
}

// Login
module.exports.login= async(req,res,next)=>{

    try{
        const {username,password} = req.body;
    const user= await User.findOne({username});
    if (!user){
        return res.json({msg:"Incorrect username or password",status:false})
    }
   const isPasswordVaild= await bcrypt.compare(password,user.password)
   if(!isPasswordVaild){
    return res.json({msg:"Incorrect username or password",status:false})
   }
   delete user.password;
    return res.json({status:true,user});
    }catch(ex){
    next(ex);
    }
    }
    // setAvatar
    module.exports.setAvatar = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const avatarImage = req.body.image;
            console.log("Received avatarImage:", avatarImage);  // Debugging line
            const userData = await User.findByIdAndUpdate(userId, {
                isAvatarImageSet: true,
                avatarImage
            }, { new: true });
            
            console.log("Updated userData:", userData);  // Debugging line
            return res.json({
                isSet: userData.isAvatarImageSet,
                image: userData.avatarImage
            });
        } catch (ex) {
            next(ex);
        }
    };

    
    // allUsers
    module.exports.getAllUsers=async(req,res,next)=>{
    try{
     const users = await User.find({_id:{$ne:req.params.id}}).select([
        "email",
        "username",
        "avatarImage",
        "_id",
     ]);
     return res.json(users)
    }catch(ex){
        next(ex);
    }
    }
    
    
