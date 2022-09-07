const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:'String',
    required:true
    },
username:{
    type:'String',
    required:true
},
password:{
    type:'String',
    required:true
},
token:{
    type:'String',  
},
isAdmin:{
    type:Boolean,
    default:false
}
},{timeseries:true});

const User=mongoose.model('User',userSchema);
module.exports = User;
