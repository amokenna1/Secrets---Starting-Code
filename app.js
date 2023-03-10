//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1/userDB');
    console.log('Db Connected');
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,  {secret: process.env.SECRET, encryptedFields:['password']});


const User = mongoose.model("User", userSchema);

app.get("/", async(req, res)=>{
    res.render("home");
});

app.get("/login", async(req, res)=>{
    res.render("login");
});

app.get("/register", async(req, res)=>{
    res.render("register");
});


app.post("/register", async(req, res)=>{
   const newUser = new User({
    email: req.body.username,
    password: req.body.password
   }); 
    newUser.save()
    try {
     res.render("secrets");
    } catch (err){
        console.log(err);
    }
});

app.post("/login", async(req, res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;

        const foundUser = await User.findOne({email: username});
            if (foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
    } catch (err){
        res.send(err);
    }
});



app.listen(3000, function(){
    console.log("Server started on port 3000");
});