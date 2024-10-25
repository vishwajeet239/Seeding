import express from "express";
import mongoose from "mongoose";
import City from "./Models/City.js";
import Country from "./Models/Country.js";

const app = express();
mongoose.connect("mongodb://localhost:27017/CityDB", {
}).then(()=>{
    console.log("MongoDB connected successfully");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:",err);
})

app.use(express.json());

app.post('/search', async (req, res) => {
    console.log(req.body);
    const {Name,page=1}= req.body;
    console.log(Name);

    const pageSize =10;
    const skipCount = (page-1)*pageSize;
    const result = await Country.aggregate([
        {$match:{countryName:Name}},
        {$lookup:{
            from: 'cities',
            localField: 'countryName',
            foreignField: 'countryNameEN',
            as: 'cities'
        }},
        {$unwind:'$cities'},
        {$skip:skipCount},
        {$limit:pageSize},
        {$group: {
            _id:'$_id',
            countryName:{$first:'$countryName'},
            peakSeasonStart:{$first:'$peakSeasonStart'},
            peakSeasonEnd:{$first:'$peakSeasonEnd'},
            costRating:{$first:'$costRating'},
            cities:{$push:'$cities'}
        }}
    ]);

    res.json(result);
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})



