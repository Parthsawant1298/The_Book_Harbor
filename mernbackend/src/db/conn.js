const e = require("express");
const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/", {


}).then(() => {
    console.log('Connection successful');
}).catch((e) => {
    console.error('no connection',e);
})

