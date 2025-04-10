const express = require("express");
const StatusValue = require("../model/status_value.model");

const app = express();

app.get("/get_status_value", async(req, res)=>{
    try{
        StatusValue.findAll().then((values)=>{
            res.json(values);
        });
    }
    catch(err){
        res.status(500).json({message: err })
    }
})

module.exports = app;