const mongoose = require('mongoose');

const routi = '/Images'// def  : ${routi}/
const userSchema = new mongoose.Schema(
    {
        firstname:{
            type : String,
            required : true,
            min : 2,
            max : 20
        },
        lastname:{
            type : String,
            required : true,
            min : 2,
            max : 20
        },
        username:{
            type :String,
            min : 5,
            max : 15,
            required: true,
            unique : true
        },
        password:{
            type :String,
            min : 5,
            max : 15,
            required: true,
            unique : true
        },
        uniqueID :{
            type : String,
            required : true,
            unique : true 
        },
        phonenumber:{
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            required : true,
            max : 50,
            unique : true
        },
        profile :{
            type : String,
            default : `defaultProfile.png`
        },
        following : {
            type : Array,
            default: [' ']
        },
        BlogPoints : {
            type : Number,
            default : 0
        },
        Posts:{
            type :Array,
            default : [' '],

        },
        private:{
            type : Boolean,
            default : false
        }
        
    }
    ,
    {
        timestamps : true 
    }
);


 const userModel = new mongoose.model('user_info',userSchema);
//const userModel = new mongoose.model('user_info_1',userSchema);


module.exports=userModel;