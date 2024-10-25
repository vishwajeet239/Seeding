import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    countryCode: {
        type:String
    },
    countryName: {
        type: String
    },
    costRating: {
        type: Number
    },
    peakSeasonStart: {
        type: String
    },
    peakSeasonEnd: {
        type: String
    }
});

const Country = mongoose.model('Country', countrySchema);

export default Country;