const { Hospital } = require("./Hospital");
const { Ward } = require("./Ward");
const { Room } = require("./Room");
const { Bed } = require("./Bed");
const { Device } = require("./Device");

module.exports = function() {
  return { Hospital, Ward, Room, Bed, Device };
};
