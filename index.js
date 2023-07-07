const express=require('express');
const cors = require('cors');
const axios=require('axios');
const helmet=require('helmet');
const mongoose=require('mongoose');
const userModel =require('./models/userModel.js')
const PostModel =require('./models/postModel.js')
const multer = require('multer');
const mongan=require('morgan');
const path = require('path')

mongoose.connect('mongodb+srv://custom_tan:varun_123@cluster0.epypnho.mongodb.net/Blog_Site?retryWrites=true&w=majority')
    .then((res)=>{
        console.log("Data base connection successful..");
    })
    .catch((err)=>{
        console.log("Data base connection failed :=> ",err);
    })

const app=express();

app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use('/posts', express.static(path.join(__dirname, 'PostImages')));
app.use(helmet());
app.use(mongan("common"));

app.use(express.json());
app.use(cors({
    origin : true
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload  = multer({storage : storage});
//--------------------------------------------------

const postStorage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null, 'PostsImages');
  },
  filename: (req,file,cb)=>{
    cb(null , file.originalname);
  }
})
const SavePostImg = multer({ storage : postStorage});
//---------------------------------------------------------

app.post('/upload-post/image',SavePostImg.single('image'),(req,res)=>{
  return res.status(201).json({'message':'Post image saved'});
  
})


app.post('/upload-post',(req,res)=>{
  const post_info=req.body;
  PostModel.create(post_info)
    .then((newPost)=>{
      console.log(newPost);
      return res.status(201).json(newPost);
    })
    .catch((err)=>{
      console.log("Error Posting: ",err);
      return res.status(401).json({'message':'Unable to POST'});
    })
});

app.post('/update/likes', (req, res) => {
  const response = req.body;
  const postId = response['postID'];
  const changed = response['likes'];

  PostModel.findOne({ 'postID': postId })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      } else {
        post.likes = changed; // Update the likes field with the new data

        post.save()
          .then(() => {
            res.status(200).json({ message: 'Updated' });
            console.log('Updated');
          })
          .catch((error) => {
            console.log('Updating Error:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.log('Finding Post Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});



app.post('/update/comments', (req, res) => {
  const response = req.body;
  const postId = response['postID'];
  const changedComments = response['comments'];

  PostModel.findOne({ 'postID': postId })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      } else {
        // Update specific comments in the existing comments field
        post.comments= changedComments;

        post.save()
          .then(() => {
            res.status(200).json({ message: 'Updated' });
            console.log('Updated');
          })
          .catch((error) => {
            console.log('Updating Error:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.log('Finding Post Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
//---------------------------------------------------------
app.post('/newUser',(req,res)=>{
    const info=req.body;
    userModel.create(info)
    .then((newUser) => {
      //console.log(newUser);
      return res.status(201).json(newUser);
    })
    .catch((err) => {
      console.log("Error creating user:", err);
      return res.status(401).json({'message':'Duplication found'});
    });
})


app.post('/newUser/AddProfile', upload.single('image'), (req, res) => {
    return res.status(201).json({'message' : 'profileSaved'});
});


app.post('/logIn', (req, res) => {
    const logDATA = req.body;
    userModel.find(logDATA)
      .then((foundCreds) => {
        if (foundCreds.length === 0) {
          return res.status(404).json("Invalid credentials");
        } 
        else {
          return res.status(200).json({ "UserInfo": foundCreds });
        }
      })
      .catch((err) => {
        console.log("Error finding credentials:", err);
        return res.status(500).json({ error: 'Failed to find credentials.' });
      });
  });


  app.get('/GetUsernames', (req, res) => {
    userModel.find({}, { username: 1, uniqueID: 1, _id: 0 })
      .then((docs) => {
        console.log(docs);
        return res.status(200).json({ document: docs });
      })
      .catch((err) => {
        console.log("Error", err);
        return res.status(400).json({ error: err });
      });
  });

app.get('/',(req,res)=>{
  return res.status(200).json({'status':'online'});
})

app.listen(1232,()=>{
    console.log("Server running on 1232..");
})