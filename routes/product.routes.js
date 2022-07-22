const express = require('express')
const proSchema = require('../models/product.model')
const multer = require('multer')
const fs = require('fs')



const router = express.Router()

//file upload

const filepath = "assets/images/product"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filepath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage }).single("picture")



//get all product
router.get('/', (req, res) => {
  proSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
    if (!data) res.status(500).json({ status: 500, msg: "No data found" })
    res.status(200).json({ status: 500, msg: data })
  })
})


//add new product

router.post('/add',(req,res)=>{  
  upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.status(500).json({status:500,msg:"something wrong in uploading1"})
        } else if (err) {
          // An unknown error occurred when uploading.
          res.status(500).json({status:500,msg:"something wrong in uploading"})
        }
    const {name,description,addedBy,category,price}=req.body
   
    const picture=req.file.filename
    let insPro=new proSchema({name,description,picture,addedBy,category,price});

    insPro.save().then(result=>{
        if(!result)
        return  res.status(500).json({status:500,msg:"something wrong"})
        if(result) res.status(200).json({status:200,msg:"Added"})
    }).catch(err=>{
        res.status(400).json({status:400,msg:"something wrong in uploading"})
    })
    // Everything went fine.
      })
})


//delete product

router.delete("/del/:_id", (req, res) => {
  const { _id } = req.params;
  proSchema.findByIdAndDelete(_id, (err, valid) => {
    if (err) { res.status(500).json({ status: 500, msg: "Something wronng" }) }
    else {
      fs.unlink("./assets/images/product/" + valid.picture, (err) => {
        if (err) console.log(err)
        res.status(200).json({ status: 200, msg: "deleted Successfully" })
      })
    }

  })
})




module.exports = router