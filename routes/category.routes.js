const express = require('express')
const catSchema = require('../models/category.model')
const multer = require('multer')
const fs = require('fs')



const router = express.Router()

//file upload

const filepath = "assets/images/category"

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



//get all category
router.get('/', (req, res) => {
  catSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: "something wrong" })
    if (!data) res.status(500).json({ status: 500, msg: "No data found" })
    res.status(200).json({ status: 500, msg: data })
  })
})


//add new category

router.post('/add', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).json({ status: 500, msg: "something wrong in uploading1" })
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).json({ status: 500, msg: "something wrong in uploading" })
    }
    const { name, addedBy, description } = req.body

    const picture = req.file.filename
    let insCat = new catSchema({ name, description, picture, addedBy });

    insCat.save().then(result => {
      if (!result)
        return res.status(500).json({ status: 500, msg: "something wrong" })
      if (result) res.status(200).json({ status: 200, msg: "Added" })
    }).catch(err => {
      res.status(400).json({ status: 400, msg: "something wrong in uploading" })
    })
    // Everything went fine.
  })
})


//delete category

router.delete("/del/:_id", (req, res) => {
  const { _id } = req.params;
  catSchema.findByIdAndDelete(_id, (err, valid) => {
    if (err) { res.status(500).json({ status: 500, msg: "Something wronng" }) }
    else {
      fs.unlink("./assets/images/category/" + valid.picture, (err) => {
        if (err) console.log(err)
        res.status(200).json({ status: 200, msg: "deleted Successfully" })
      })
    }

  })
})




module.exports = router