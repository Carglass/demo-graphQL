const { Schema, model } = require("mongoose");

// Using the Schema constructor, create a new RoomSchema object
const RoomSchema = new Schema({
  // `name` is of type String
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method

const Room = model("Room", RoomSchema);

exports.Room = Room;
