const express = require('express')
const userSchema = require('../models/user.model')
const bcrypt = require('bcrypt')

const router = express.Router()

//Routes


//get all users
router.get("/", (req, res) => {
   userSchema.find({}, (err, data) => {
      if (err) return res.status(500).json({ status: 500, msg: "Something went wrong" })
      if (!data) return res.status(400).json({ status: 400, msg: "Something went wrong" })
      res.status(200).json({ status: 200, msg: data })
   })
})


//add users
router.post('/add', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ status: 404, msg: "Please enter all the fields" })
    }
    bcrypt.hash(password, 12, (err, hashPass) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        if (!hashPass) return res.status(502).json({ status: 502, msg: "Password Try Again" })

        let insUser=new userSchema({email,password:hashPass})
        insUser.save({email,password})
        .then(result=>{
             res.status(200).json({ status: 200, msg:"Uses Added Successfully" })
              
        })
        .catch(err=>{
       res.status(501).json({status:501,msg:err.message})
        })

    })
})


//login 

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ status: 404, msg: "Please enter all the fields" })
    }
    userSchema.findOne({ email }, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        if (!data) return res.status(502).json({ status: 502, msg: "Something wrong" })

        let dbPass = data.password

        bcrypt.compare(password, dbPass, (err, valid) => {
            if (err) return res.status(500).json({ status: 500, msg: err.message })
            if (!valid) return res.status(501).json({ status: 501, msg: "Something wrong" })
            res.status(200).json({status:200,msg:{email}})
        })
    })
})

//get all users

router.get("/",(req,res)=>{
    userSchema.find({},(err,data)=>{
        if(err) return res.status(501).json({status:501,msg:"Something wrong"})
        if(!data) return res.status(400).json({status:400,msg:"Something wrong"})
         res.status(200).json({status:200,msg:"Something wrong"})
    })
})

module.exports = router