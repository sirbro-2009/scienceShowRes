const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected succes")
}).catch((e)=>{
    console.log(e)
})
const students = require("./Data/students")
const app = express()
app.use(express.static("./front-end"))
app.use(express.json())
app.post("/signIn",(req,res)=>{
    let {name,password} = req.body
    if(name === "Roumissa" && password === "Roumissa1448"){return res.json({state:true,token:"123456789"})}
    else{res.json({state:false})}
})
app.post("/addStudent",async(req,res)=>{
    let {name,gender,theClass,note,mark} = req.body
    let token = Date.now()
    try{
    const newStudents = new students({...req.body,token:token,note:null,mark:null})
    await newStudents.save()
    res.json({
        state:true,
        name:name,
        token:token,
    })
    }
    catch{
        res.json({state:false})
    }
})
app.get("/studentList",async(req,res)=>{
let {name,token,password} = req.query
if(token){
let fr = await students.find({token:token},{})
res.json(fr)
}
if(name && password){
try{
let reqEx = new RegExp(name)
let fr = await students.find({name:{$regex:name},password:password})
if(fr.length === 1){
return res.json(fr)}
else if(fr.length===0 || fr.length >1){return res.json({state:false})}
}
catch{
return res.json({state:false})
}
}
if(name && !password ){
try{
let reqEx = new RegExp(name)
let fr = await students.find({name:{$regex:name}})
return res.json(fr)
}
catch(e){
return res.json({state:false})
}
}
})
app.put("/setNote",async(req,res)=>{
let {note,mark,token} = req.body
try{
await students.updateOne({token:token},{$set:{mark:mark,note:note}})
return res.json({state:true})
}
catch(e){
return res.json({state:false})
}
})

app.listen(3000,()=>{
    console.log("app working in port 3000")
})