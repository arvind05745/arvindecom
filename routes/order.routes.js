const { json } = require('express')
const express=require('express')
const orderSchema=require('../models/order.model')
const router=express.Router()

// router.get('/',(req,res)=>{
//     res.send('order Routes')
// })

// get all routes
router.get('/',(req,res)=>{
    orderSchema.find({},(err,data)=>{
          if(err) return res.status(500).json({status:500,msg:err.message})
          res.status(200).json({status:200,msg:data})
    })
})

//place order

router.post('/place',(req,res)=>{
    const {name,email,price,pid,quantity,address}=req.body
    let placeOrder=new orderSchema({name,email,price,pid,quantity,address})

   placeOrder.save((err,data)=>{
    if(err)return  res.status(500),json({status:500,msg:err.message})
    res.status(200).json({status:200,msg:"order palcesuccessfully"})
   })
})

//status change

router.put('/update-status/:_id',(req,res)=>{
    const {status}=req.body
    const {_id}=req.params

    orderSchema.findByIdAndUpdate(_id,{status},(err,data)=>{
    if(err)return res.status(500).json({status:500,msg:err.message})
    res.status(200).json({status:200,msg:"Order updated successfully"})
    })
})

module.exports=router