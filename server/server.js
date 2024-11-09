require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

//routes
const authroutes = require('./user/routers/authRoutes');

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

app.use('/api/users', authroutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})