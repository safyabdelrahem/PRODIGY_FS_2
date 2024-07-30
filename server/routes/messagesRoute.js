const { addMsg,getAllMessages} = require("../controllers/messagesControllers");

const router= require("express").Router();
router.post("/addMsg/",addMsg);
router.post("/getMsg/",getAllMessages)
module.exports=router;