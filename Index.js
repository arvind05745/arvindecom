const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
var cors = require('cors')
 


//veriables
const app = express()
const { PORT, DB_USER, DB_PASS } = process.env
const port = PORT || 8000


//middleware
app.use(express.json())
app.use(cors())
app.use('/',express.static('public'))
app.use('/images', express.static('assets/images'))


//DB connection
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.o77l9eg.mongodb.net/ecom?retryWrites=true&w=majority`, (err) => {
    if (err) return console.log(err)

    //listen
    app.listen(port, () => {

        console.log(`server is running at ${port}`)
        console.log(`DB is Connected`)
    })
})

//routes

app.use('/api/admin/user', require('./routes/user.routes'))

app.use('/api/admin/category',require('./routes/category.routes'))

app.use('/api/admin/product',require('./routes/product.routes'))

app.use('/api/front',require('./routes/front.routes'))

app.use('/api/admin/orders',require('./routes/order.routes'))

app.get('/', (req, res) => {
    res.send("working")
})
