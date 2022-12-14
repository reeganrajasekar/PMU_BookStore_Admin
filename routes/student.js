const express = require('express');
const router = express.Router();
const Student = require("../models/Student")


router.use((req, res, next) => {
   if(req.cookies['auth']=='true'){
      next()
   }else{
      res.redirect("/")
   }
})

router.get('/', async (req, res)=>{
   var students = await Student.find({access:false})

   if(req.query.student_id){
      var studentsList = await Student.find({access:true,student_id:req.query.student_id}).sort({"timestamp":-1});
   }else if(req.query.student_name){
      var studentsList = await Student.find({access:true,student_name:{ "$regex": req.query.student_name , "$options": "i" }}).sort({"timestamp":-1});
   }else{
      var studentsList = await Student.find({access:true}).sort({"timestamp":-1});
   }
   var total = await Student.find({access:true}).count();
   res.render("student/index" , {students:students , studentsList:studentsList , total:total})
});

router.post('/access',async (req,res)=>{
   var student= await Student.findByIdAndUpdate(req.body.id , {access:true })
   res.redirect("/student")
})

router.post('/delete',async (req,res)=>{
   var student = await Student.findByIdAndRemove(req.body.id)
   res.redirect("/student")
})


module.exports = router;