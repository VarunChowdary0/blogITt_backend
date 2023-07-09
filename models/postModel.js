const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
            uniqueID_p :{
                type : String,
                required : true
            },
            postID:{
                type : String,
                unique: true,
                required : true
            },
            fullname:{
                type :String,
                min : 5,
                max : 15,
                required: true,
            },
            postImage:{
                type : String,
                default : ''
            },
            blog:{
                type : String,
                required : true
            },
            private_Post:{
                type : Boolean ,
                default : false
            },
            location : {
                type : String
            }
            ,
            likes:{
                type : Object,
                default : {},
                likedBy:{
                    type : Array
                },
                count: {
                    type : Number,
                    default : 0
                }
            },
            comments:{
                type : Object,
                default : {},
                count:{
                    type : Number,
                    default : 0
                },
                commentBLOCK:{
                    type : Array,
                    default : [],
                    blocks:{
                        type : Object,
                        username : {
                            type : String
                        },
                        comment : {
                            type : String
                        }
                    }
                }
            }
        },
        {
            timestamps : true 
        }
    );


const PostModel = new mongoose.model('posts',PostSchema);

module.exports = PostModel;