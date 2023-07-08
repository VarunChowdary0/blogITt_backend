const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
            uniqueID :{
                type : String,
                required : true,
                unique : true 
            },
            postID:{
                type : String,
                required : true,
                unique : true
            },
            fullname:{
                type :String,
                min : 5,
                max : 15,
                required: true,
                unique : true
            },
            postImage:{
                type : String,
                unique : true
            },
            blog:{
                type : String,
            },
            private_Post:{
                type : Boolean ,
                default : false
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