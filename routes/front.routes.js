const express = require('express')
const catSchema = require('../models/category.model')
const proSchema = require('../models/product.model')
const AddressSchema = require('../models/address.model')
const FrontUserSchema = require('../models/frontUser.model')
const orderSchema = require('../models/order.model')
const bcrypt = require('bcrypt')




const router = express.Router()

//get all category
router.get('/category', (req, res) => {
    catSchema.find({}, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
        if (!data) res.status(500).json({ status: 500, msg: "No data found" })
        res.status(200).json({ status: 500, msg: data })
    })
})


router.get('/category/:_id', (req, res) => {
    const _id = req.params
    catSchema.findOne(_id, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
        if (!data) res.status(500).json({ status: 500, msg: "No data found" })
        res.status(200).json({ status: 500, msg: data })
    })
})

// fetch product by category Id

router.get('/products/:categoryId', (req, res) => {
    const { categoryId } = req.params
    proSchema.find({ category: categoryId }, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
        if (!data) res.status(500).json({ status: 500, msg: "No data found" })
        res.status(200).json({ status: 500, msg: data })
    })
})

router.get("/product/:_id", (req, res) => {
    const { _id } = req.params
    proSchema.findOne({ _id }, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
        if (!data) return res.status(501).json({ status: 200, msg: "no data found" })
        res.status(200).json({ status: 200, msg: data })
    })
});


//User Registration

router.post('/registration', (req, res) => {
    const { email, password, name } = req.body

    bcrypt.hash(password, 12, (err, hashpass) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        if (!hashpass) return res.status(501).json({ status: 501, msg: "Not hashing" })

        let insUser = new FrontUserSchema({ name, password: hashpass, email })
        insUser.save().then(user => {
            if (!user) return res.status(501).json({ status: 501, msg: "Something Wrong" })
            res.status(200).json({ status: 200, msg: "User Added SUccessfully" })
        }).catch(err => {
            return res.status(500).json({ status: 500, msg: "not registering user" })
        })
    })
})


// LOGIN

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ status: 404, msg: "Please enter all the fields" })
    }
    FrontUserSchema.findOne({ email }, (err, data) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        if (!data) return res.status(501).json({ status: 501, msg: "Something wrong" })
        console.log(err)
        let dbPass = data.password

        bcrypt.compare(password, dbPass, (err, valid) => {
            if (err) return res.status(500).json({ status: 500, msg: err.message })
            if (!valid) return res.status(501).json({ status: 501, msg: "Something wrong" })
            res.status(200).json({ status: 200, msg: { email } })
        })
    })
})


//Add Address

router.post('/add-address', (req, res) => {
    const {address,email} = req.body

    let insAddress = new AddressSchema({ address, email })

    insAddress.save().then(result => {
        if (!result) return res.status(501).json({ status: 501, msg: "Something wrong" })
        res.status(200).json({ status: 200, msg: "Address added successfully" })

    }).catch(err => {
        if (err) return res.status(502).json({ status: 502, msg: err.message })
        console.log(err.message)

    })
})


// get address

router.get('/address/:email', (req, res) => {
    const { email } = req.params;

    AddressSchema.find({ email }, (err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        res.status(200).json({ status: 200, msg: result })

    })
})

//place-order

router.post('/place-order', (req, res) => {
    const { email, name, address, product } = req.body

    let insOrder = new orderSchema({ email, name, address, product })
    insOrder.save((err, result) => {
        if (err) return res.status(500).json({ status: 500, msg: err.message })
        if (!result) return res.status(501).json({ status: 501, msg: "Something Wrong" })
        res.status(200).json({ status: 200, msg: "Place order successfully" })
    })
})


module.exports = router