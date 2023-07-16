const express=require('express');
const cors = require('cors');
const axios=require('axios');
const helmet=require('helmet');
const mongoose=require('mongoose');
const userModel =require('./models/userModel.js')
const PostModel =require('./models/postModel.js')
const multer = require('multer');
const mongan=require('morgan');
const path = require('path');
const { info } = require('console');

mongoose.connect('mongodb+srv://custom_tan:varun_123@cluster0.epypnho.mongodb.net/Blog_Site?retryWrites=true&w=majority')
    .then((res)=>{
        console.log("Data base connection successful..");
    })
    .catch((err)=>{
        console.log("Data base connection failed :=> ",err);
    })

const app=express();

app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use('/posts', express.static('PostImages'));
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

// app.post('/upload-post/image',SavePostImg.single('image'),(req,res)=>{
//   console.log("Post image");
//   return res.status(201).json({'message':'Post image saved'});
  
// })
app.post('/manage/follow',(req,res)=>{
  const Info=req.body;
  const uniqueID_= Info['uniqueID'];
  const newFollowing=Info['newFollowing']
  userModel.findOne({"uniqueID":uniqueID_})
   .then((foundInfo)=>{
    if(foundInfo.length===0)
    {
      console.log("not found");
      res.status(404).json({'message':'user not found'});
    }
    else{
      userModel.findOneAndUpdate(
        { "uniqueID": uniqueID_ }, // Filter for the document to update
        { $push: { following: newFollowing } }, // Update operation to add newFollowing to the following array
        { new: true } // Options: return the updated document
      )
      .then((updatedInfo) => {
        // Handle the updated document
        //console.log((updatedInfo));
        change_Followers(uniqueID_,newFollowing);
        res.status(200).json({ 'message': 'Unfollow successful','data':updatedInfo});
      })
      .catch((error) => {
        // Handle errors
        res.status(500).json({ message: 'Internal server error_2', error });
      }); 
    }
   })
})

const change_Followers=(uniqueID_,newFollowing)=>
{
  userModel.findOneAndUpdate(
    { "uniqueID" : newFollowing},
    { $push: { followers: uniqueID_ } },
    {new : true}
  )
  .then((updatedInfo) => {
    // Handle the updated document
    //console.log((updatedInfo));

   // return.status(200).json({ message: 'Following added in my Other', updatedInfo });
  })
  .catch((error) => {
    console.log("error_12:",error);
    // Handle errors
   // return.status(500).json({ message: 'Internal server error_1', error });
  })
}

//-----

app.delete('/manage/Unfollow', (req, res) => {
  const Info = req.body;
  const uniqueID_ = Info['uniqueID'];
  const unfollowing = Info['unfollowing'];

  userModel.findOneAndUpdate(
    { "uniqueID": uniqueID_ }, // Filter for the document to update
    { $pull: { following: unfollowing } }, // Update operation to remove unfollowing from the following array
    { new: true } // Options: return the updated document
  )
    .then((updatedInfo) => {
      // Handle the updated document
      if (!updatedInfo) {
        console.log("not found");
        res.status(404).json({ 'message': 'User not found' });
        return;
      }

      change_UnFollowers(uniqueID_, unfollowing);
      res.status(200).json({ 'message': 'Unfollow successful','data':updatedInfo});
    })
    .catch((error) => {
      // Handle errors
      res.status(500).json({ message: 'Internal server error', error });
    });
});

const change_UnFollowers=(uniqueID_,UnFollowing)=>
{
  userModel.findOneAndUpdate(
    { "uniqueID" : UnFollowing},
    { $pull: { followers: uniqueID_ } },
    {new : true}
  )
  .then((updatedInfo) => {
    // Handle the updated document
    //console.log((updatedInfo));

   // return.status(200).json({ message: 'Following added in my Other', updatedInfo });
  })
  .catch((error) => {
    console.log("error_12:",error);
    // Handle errors
   // return.status(500).json({ message: 'Internal server error_1', error });
  })
}




//-----

app.post('/GetUserInfo', (req, res) => {
  const Info = req.body;
  const uniqueID = Info;
 // console.log(uniqueID)
  userModel.findOne(uniqueID )
    .select('-password')
    .then((foundCreds) => {
      if (foundCreds.length === 0) {
        return res.status(404).json(foundCreds);
      } 
      else {
        return res.status(200).json(foundCreds);
      }
    })
    .catch((err) => {
      console.log("Error finding credentials:", err);
      return res.status(500).json({ error: 'Failed to find credentials.' });
    });
});


app.post('/edit/userInfo/location',(req,res)=>{
  const info=req.body;
  const uniqueID=info['uniqueID'];
  const location = info['location'];
  userModel.findOneAndUpdate({uniqueID : uniqueID},
                { location : location },
                {new : true})
                .then((resp)=>{
                  console.log(resp)
                  return res.status(200).json({'message':'location changed','data':resp})
                })
                .catch((err)=>{
                  return res.status(500).json({'message':'some thing went wrong'})
                })
})

app.post('/edit/userInfo/Bio',(req,res)=>{
  const info=req.body;
  const uniqueID=info['uniqueID'];
  const Bio = info['Bio'];
  userModel.findOneAndUpdate({uniqueID : uniqueID},
                { Bio : Bio },
                {new : true})
                .then((resp)=>{
                  //console.log(resp)
                  return res.status(200).json({'message':'Bio changed','data':resp})
                })
                .catch((err)=>{
                  return res.status(500).json({'message':'some thing went wrong'})
                })
})


app.post('/edit/userInfo/password',(req,res)=>{
   const info = req.body;
   const uniqueID=info['uniqueID'];
   const old_pw = info['pswd_old'];
   const new_pw = info['pswd_new'];
   userModel.find({uniqueID : uniqueID , password : old_pw})
      .then((foundCreds) => {
        if (foundCreds.length === 0) {
          return res.status(404).json("Invalid credentials");
        } 
        else {
            userModel.findOneAndUpdate(
              { uniqueID: uniqueID, password: old_pw },
              { password: new_pw },
              { new: true })
                .then((resp) => {
                  return res.status(200).json({ message: 'Password updated successfully','data':resp });
                  })
                .catch((err) => {
                  console.log("Error updating password:", err);
                  return res.status(500).json({ 'message ': 'password weak .' });
              });
        }
      })
      .catch((err) => {
        console.log("Error finding credentials:", err);
        return res.status(500).json({ error: 'Failed to find credentials.' });
      });
})


app.post('/upload-post', (req, res) => {
  const post_info = req.body;
  console.log(post_info);

  PostModel.create(post_info)
    .then((newPost) => {
      console.log("saved post :", newPost['postID'])
      return res.status(200).json(newPost);
    })
    .catch((err) => {
      console.log("Error Posting:", err);
      return res.status(401).json({ 'message': 'Unable to POST' });
    });
});


app.post('/GetUserPosts',(req,res)=>{
    const uniqueID_p = req.body;
    PostModel.find(uniqueID_p)
     .then((data)=>{
     // console.log(data);
      return res.status(200).json(data);
     })
     .catch((err)=>{
      console.log("Error: ",err);
      return res.status(400).json({"message":err});
     })
})
app.post('/update/profile/path', (req, res) => {
  const info = req.body;
  const uniqueID = info['uniqueID'];
  const profile = info['profile'];

  userModel.findOneAndUpdate(
    { uniqueID: uniqueID }, // Find the user with the specified uniqueID
    { $set: { profile: profile } }, // Update the profile field with the new value
    { new: true } // Return the updated document
  )
    .then(updatedUser => {
      if (updatedUser) {
      //  console.log("updtaed:",updatedUser);
        res.status(200).json({'data':updatedUser});
      } else {
      //  console.log(updatedUser);
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
     // console.log(error)
      res.status(500).json({ message: 'Internal server error' });
    });
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


app.post('/User/Image', upload.single('image'), (req, res) => {
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

  app.post('/GetUserData',(req,res)=>{
    const Info=req.body;
    userModel.findOne(Info)
      .then((data)=>{
        if(data.length!==0)
        {
          res.status(200).json(data);
        }
        else{
          res.status(404).json({"message":'not found'});
        }
      })
      .catch((err)=>{
        console.log("error: ",err);
        res.status(500).json({"message":"Internal server Error"});
      })
  })


  app.get('/GetUsernames', (req, res) => {
    userModel.find({}, { username: 1, uniqueID: 1,firstname: 1,lastname:1,profile: 1, _id: 0 })
      .then((docs) => {
       // console.log(docs);
        return res.status(200).json({ document: docs });
      })
      .catch((err) => {
        console.log("Error", err);
        return res.status(400).json({ error: err });
      });
  });

  app.get('/AllUserData', (req, res) => {
    PostModel.find({})
      .then((docs) => {
       // console.log(docs);
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