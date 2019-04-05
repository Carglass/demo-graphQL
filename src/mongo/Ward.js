const { Schema, model } = require("mongoose");

// Using the Schema constructor, create a new WardSchema object
const WardSchema = new Schema({
  // `name` is of type String
  name: {
    type: Schema.Types.String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method

const Ward = model("Ward", WardSchema);

exports.Ward = Ward;
