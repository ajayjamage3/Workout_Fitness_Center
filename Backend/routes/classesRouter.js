const {ClassesModel} = require("../models/classesModel");
const {UserModel} = require("../models/userModel");
const express = require("express");
require('dotenv').config()
let {get_date,get_time}=require("../utils/utils")


const classesRouter = express.Router();

// class Page
classesRouter.get("/",(req,res)=>{
    res.status(200).send({message:"classes Page"})
})

// class - Get All class
classesRouter.get("/all", async (req,res)=>{
    try{
        let classes = await ClassesModel.find();
        res.status(200).send({message:"classes Data Fetched",classes})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// class - Get All classes by user id
classesRouter.get("/searchByUserID/:id", async (req,res)=>{
    let userID=req.params.id
    try{
        let classes = await ClassesModel.find(({ clients : { $in : userID }}));
        res.status(200).send({message:"classes Data Fetched",classes})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// class - Single class Detail
classesRouter.get("/:id", async (req,res)=>{
    let classesID= req.params.id;
    try{
        let classes = await ClassesModel.findById(classesID);
        res.status(200).send({message:"class Data Fetched",classes})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// classes creation
classesRouter.post("/create", async (req,res)=>{
    let payload = req.body;
    console.log(payload)
    payload.createdDate=get_date();
    payload.createdTime=get_time();
    payload.trainerID=payload.userID;
    payload.trainerName=payload.username;
    payload.seatOccupied=0;

    // res.send({message:"Class created",classes:payload})

    try{
        let classes = new ClassesModel(payload);
        await classes.save();
        await UserModel.findByIdAndUpdate({_id:payload.userID},{ $push: { classes: classes._id } });
        res.status(200).send({message:"Class created",classes})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})


// class Update
classesRouter.patch("/update/:id", async (req,res)=>{
    let classesID= req.params.id;
    let payload = req.body;
    try{
        let classes = await ClassesModel.findByIdAndUpdate(classesID,payload);        
        res.status(200).send({message:"class data updated"})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// class Delete
classesRouter.delete("/delete/:id", async (req,res)=>{
    let classesID= req.params.id;

    try{
        let classes = await ClassesModel.findByIdAndDelete(classesID);        
        res.status(200).send({message:"class data deleted"})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})


// class Update - TESTING ONLY
classesRouter.patch("/updateTest", async (req,res)=>{
    try{
        let classes = await ClassesModel.updateMany({venue:"online"},{locationOrLink:"https://us06web.zoom.us/j/9314210793"});        
        res.status(200).send({message:"class data updated"})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})


module.exports= {classesRouter}

