const { Schema, model } = require("mongoose");

// Using the Schema constructor, create a new HospitalSchema object
const HospitalSchema = new Schema({
  // `name` is of type String
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// This creates our model from the above schema, using mongoose's model method

const Hospital = model("Hospital", HospitalSchema);

exports.Hospital = Hospital;
