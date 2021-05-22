const express= require('express');
const router = express.Router();

const{
    getUser,
    scheduleMail
}=require('./controller/index')

router.post("/getUserDetails",getUser);
router.post("/sendEmail",scheduleMail);

module.exports=router;