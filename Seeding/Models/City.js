import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    cityName : {
        type: String,
    },
    alternateNames : {
        typeof: Array,
    },
    latitude : {
        type: Number,
    },
    longitude : {
        type: Number,
    },
    countryNameEN : {
        type: String,
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }
});

const City = mongoose.model('City',citySchema);
export default City;