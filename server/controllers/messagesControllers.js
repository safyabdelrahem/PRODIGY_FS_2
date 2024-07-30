const messagesModel = require ("../model/messagesModel")


module.exports.addMsg=async(req,res,next)=>{
try{
  const {from,to,message} = req.body;
  const data = await messagesModel.create({
    message:{text:message},
    users:[from,to],
    sender:from,
  });
  if(data) return res.json({msg:"Messages added successfully."});
  return res.json ({msg:"failed to add messages to the database."})
}catch(ex){
    next(ex);
}
}
module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messagesModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 }); // corrected 'updateAt' to 'updatedAt'
    
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};
