const express=require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app= express();
const mongoose = require('mongoose');
const User = require('./models/User');
const auth = require('./adminMiddleware/adminMiddleWare');

// connecting to database
mongoose.connect('mongodb://localhost:27017/TestTask',{useUnifiedTopology:true,
    useNewUrlParser:true,
           },
        err=>{
        if(err)throw err;
        console.log('Database connected');
    });

app.use(express.json());

//Register 
app.post('/api/register',async(req,res)=>{
 //   console.log(req.body);
const {username,password,name}=req.body;

   
    if(!username || !password){
        return res.json('Please provide username and password');
    }
    const user= await User.findOne({username: username});
    if(user){
        return res.json(`User already exist with username: ${user.username} `);
    }
    try {
        //securing the password
        const salt = await bcrypt.genSalt(10);
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const user=await new User(req.body).save();
        console.log(user);
        const token = jwt.sign({ id: user._id }, 'SecretKey', {
            expiresIn: '24d',
        });
        res.json({token,user});

    } catch (error) {
        return res.json(error);
    }
});


app.post('/api/login',async(req,res)=>{

        const {username,password}=req.body;
        const user=await User.findOne({ username});
       if(!user){
        return res.json('Wrong username or password');
       }
       const authenticUser=await bcrypt.compare(password,user.password);
    if(!authenticUser){
        return res.json('Wrong username or password');
    }
    const token= jwt.sign({id:user._id},'SecretKey',{expiresIn:'24d'})
    res.json({token,user});
    });

app.get('/api/users',auth,async(req,res)=>{
//see wether he or she is admin or not 
const user=await User.findById(req.user.id);
//console.log(user);
if(!user.isAdmin){
 return res.json('Please Login as admin');
}
const users=await User.find({});
res.json(users);
});


app.listen(8080);