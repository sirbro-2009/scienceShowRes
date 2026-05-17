const mongoose = require("mongoose")
const schema = mongoose.Schema

const studentsShema = new schema({
    name:String,
    password:String,
    gender:String,
    theClass:String,
    note:{type:Number,default:null},
    mark:String,
    token:Number,

})
const students = mongoose.model("student",studentsShema)
module.exports = students