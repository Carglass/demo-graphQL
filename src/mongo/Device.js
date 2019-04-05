const { Schema, model } = require("mongoose");

// Using the Schema constructor, create a new DeviceSchema object
const DeviceSchema = new Schema({
  // `name` is of type String
  deviceType: {
    type: Schema.Types.String,
    required: true,
    enum: ["VP", "SP"]
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method

const Device = model("Device", DeviceSchema);

exports.Device = Device;
