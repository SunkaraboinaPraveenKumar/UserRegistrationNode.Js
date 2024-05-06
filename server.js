import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { User } from './Models/User.js';
import path from 'path';
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'db3dlkpaj', 
  api_key: '154872567442557', 
  api_secret: 'Deafq-CDlVhgbjN2kRTLlD6OPAQ' 
});
  
const app=express();

app.use(express.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
  });
  
const upload = multer({ storage: storage })

const port=1000;

//show register page
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

//create user
app.post('/register',upload.single('file'), async (req,res)=>{
    const file=req.file.path;
    const {name,email,password}=req.body;

    try{
        const cloudinaryRes=await cloudinary.uploader.upload(file,{
            folder:'NodeJs _Authentication_App'
        });
        let user=await User.create({
            profileImg:cloudinaryRes.secure_url,
            name,email,password
        })
        res.redirect("/")
        console.log(cloudinaryRes,name,email,password);
    }
    catch(error){
        res.send("Error Occurred")
    }
});

//login user
// Show login page (GET)
app.get("/", (req, res) => {
    res.render("login.ejs", { msg: '' }); // default msg to an empty string
});

// Handle login (POST)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login.ejs', { msg: 'User Not Found' });
        } else if (user.password !== password) {
            return res.render('login.ejs', { msg: 'Invalid Password' });
        } else {
            return res.render('profile.ejs', { user });
        }
    } catch (error) {
        res.render('login.ejs', { msg: 'An error occurred' });
    }
});


//all users
app.get("/users", async(req,res)=>{
   let users=await User.find();
   res.render("users.ejs",{users});
});

// show  login page
app.get("/",(req,res)=>{
    res.render("login.ejs")
})

mongoose.connect("mongodb+srv://kumarsunkaraboina27:fdXBa3tmhtU5830Y@cluster0.1rbur86.mongodb.net/",
{"dbName":"NodeJsExpressAPISeries"})
.then(()=>console.log("MongoDb Connected"))
.catch((error)=>console.log(error));






app.listen(port,()=>console.log(`Server is Running on port ${port}`))

