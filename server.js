const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//testing
app.get('/', (req, res)=> {
    res.send('Hello Node API')
})

app.get('/blog', (req, res)=> {
    res.send('Hello blog')
})

// view all products
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// view product by id
app.get('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

// create product
app.post('/product', async(req, res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update product
app.put('/product/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: `cannot find any product ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//delete product
app.delete('/product/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({message: `cannot find any product with id ${id}`})
        }
        res.status(200).json(product);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// connect to database
mongoose.
connect('mongodb://admin:admin123@ac-s12eqrs-shard-00-00.atoml3y.mongodb.net:27017,ac-s12eqrs-shard-00-01.atoml3y.mongodb.net:27017,ac-s12eqrs-shard-00-02.atoml3y.mongodb.net:27017/?ssl=true&replicaSet=atlas-wi662s-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(()=> {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log('Node API app is running on port 3000')
    });
}).catch((error) => {
    console.log(error)
})