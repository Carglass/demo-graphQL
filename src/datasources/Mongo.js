const { DataSource } = require("apollo-datasource");

const LEVELS_ARRAY = ["Hospital", "Ward", "Room", "Bed", "Device"];

class MongoAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */

  /**
   * @returns {Array} returns an Hospital Array from Mongo
   */
  async getHospitals() {
    const hospitals = this.store.Hospital.find();
    return hospitals;
  }

  /**
   * @param  {string} hospitalName
   * @returns {Object} returns an Hospital Object from Mongo
   */
  async getOneHospital(hospitalName) {
    const hospital = await this.store.Hospital.findOne({ name: hospitalName });
    return hospital;
  }

  /**
   * @param  {string} wardName
   * @returns {Object} returns a Ward Object from Mongo
   */
  async getOneWard(wardName) {
    const ward = await this.store.Ward.findOne({ name: wardName });
    return ward;
  }

  async getWards(hospitalId) {
    const wards = this.store.Ward.find(
      // if there is no parent precised, returns all wards
      hospitalId ? { parent: hospitalId } : null
    );
    return wards;
  }

  async getRooms(wardId) {
    // see getWards
    const rooms = this.store.Room.find(wardId ? { parent: wardId } : null);
    return rooms;
  }

  async getBeds(roomId) {
    // see getWards
    const beds = this.store.Bed.find(roomId ? { parent: roomId } : null);
    return beds;
  }

  async getDevices(bedId) {
    // see getWards
    const devices = this.store.Device.find(bedId ? { parent: bedId } : null);
    return devices;
  }

  /**
   * @param  {string} name
   * @returns  {Promise|Error} returns the promise of the creation of the Hospital or an Error
   */
  createHospital(name) {
    if (name) {
      return this.store.Hospital.create({ name });
    } else {
      return new Error("Hospital must have a name");
    }
  }

  /**
   * @param  {string} name
   * @param  {string} parent - the name of the parent (not the id)
   * @returns  {Promise|Error} - returns the promise of the creation of the Ward or an Error
   */
  async createWard(name, parent) {
    if (name && parent) {
      // TODO: here find returned an array (of size 1), but bot in the other funcitons, why? maybe because it was not defined as unique in mongoose
      const hospitalId = await this.store.Hospital.findOne({ name: parent });
      return this.store.Ward.create({ name, parent: hospitalId._id });
    } else {
      return new Error("Ward must have a name");
    }
  }

  /**
   * @param  {string} name
   * @param  {string} parent - the name of the parent (not the id)
   * @returns  {Promise|Error} - returns the promise of the creation of the Ward or an Error
   */
  async createRoom(name, parent) {
    if (name && parent) {
      const wardId = await this.store.Ward.findOne({ name: parent });
      return this.store.Room.create({ name, parent: wardId._id });
    } else {
      return new Error("Room must have a name");
    }
  }

  /**
   * @param  {string} name
   * @param  {string} parent - the name of the parent (not the id)
   * @returns  {Promise|Error} - returns the promise of the creation of the Ward or an Error
   */
  async createBed(name, parent) {
    if (name && parent) {
      const roomId = await this.store.Room.findOne({ name: parent });
      return this.store.Bed.create({ name, parent: roomId._id });
    } else {
      return new Error("Bed must have a name");
    }
  }

  /**
   * @param  {string} deviceType
   * @param  {string} parent - the name of the parent (not the id)
   * @returns  {Promise|Error} - returns the promise of the creation of the Ward or an Error
   */
  async createDevice(deviceType, parent) {
    if (deviceType && parent) {
      const bedId = await this.store.Bed.findOne({ name: parent });
      return this.store.Device.create({ deviceType, parent: bedId._id });
    } else {
      return new Error("Device must have a device type and a parent");
    }
  }

  /**
   * @param  {string} wardId is the mongo ID of the ward for which to generate the summary
   * @returns {Array} an array of summaries by device type
   */
  async getWardDeviceSummaries(wardId) {
    // TODO: remove useless prime declaration ?
    let deviceSummaries = [];
    const beds = await this.getBedsFromWard(wardId);
    deviceSummaries = await this.getSummariesFromBeds(beds);
    return deviceSummaries;
  }

  /**
   * @param  {string} wardId
   * @returns {Array} beds - an array of ids of all the beds in the ward
   */
  async getBedsFromWard(wardId) {
    // retrieve all rooms in the ward
    const rooms = await this.store.Room.find({ parent: wardId });
    // retrieve all beds in the rooms
    const beds = await this.store.Bed.find()
      .where("parent")
      .in(rooms.map(room => room._id));
    return beds;
  }

  /**
   * @param  {ID} locationID
   * @param  {locationType} sourceLocationType
   * @param  {locationType} finalLevelType
   * @returns  {Object} listOfChildrenIds
   */
  async getAllChildrenLocations(
    locationID,
    sourceLocationType,
    finalLevelType
  ) {
    // getting the levels, to enable a cursor move in the levels
    const startLevel = this.getLevelIndex(sourceLocationType);
    const finalLevel = this.getLevelIndex(finalLevelType);
    if (finalLevel - startLevel <= 0) {
      throw new Error("there is a wrong location Type somewhere");
    }
    // this cursor will mode to point to the next level
    let cursor = startLevel;
    // that's the number of levels to go in the tree
    let numberOfLevelsToGo = finalLevel - startLevel;
    // the object that will eventually be returned, with all the indexes classed by type
    const listOfChildrenIds = { [sourceLocationType]: locationID };
    while (numberOfLevelsToGo > 0) {
      // get the list of the locations for which we want the children
      const idsToSearch = listOfChildrenIds[this.getLevelType(cursor)];
      // get all the childrens (full document)
      const locations = await this.store[this.getLevelType(cursor + 1)]
        .find()
        .where("parent")
        .in(idsToSearch);
      // convert into an array of ids and update the listOfChildrenIds
      listOfChildrenIds[this.getLevelType(cursor + 1)] = locations.map(
        location => location._id
      );
      // move to next step
      cursor++;
      numberOfLevelsToGo--;
    }
    return listOfChildrenIds;
  }

  getLevelIndex(locationType) {
    return locationType === "Hospital"
      ? 0
      : locationType === "Ward"
      ? 1
      : locationType === "Room"
      ? 2
      : locationType === "Bed"
      ? 3
      : locationType === "Device"
      ? 4
      : new Error("One Location Type is wrong");
  }

  getLevelType(locationIndex) {
    return locationIndex === 0
      ? "Hospital"
      : locationIndex === 1
      ? "Ward"
      : locationIndex === 2
      ? "Room"
      : locationIndex === 3
      ? "Bed"
      : locationIndex === 4
      ? "Device"
      : new Error("One Location Index is wrong");
  }

  /**
   * @param  {Array} bedList
   * @returns  {Array} summaries, an array of {deviceType, number}
   */
  async getSummariesFromBeds(bedList) {
    // TODO: could be refactored into an object? maybe more idiomatic
    // would need to change the schema as well then
    let summaries = [
      { deviceType: "VP", number: 0 },
      { deviceType: "SP", number: 0 }
    ];
    summaries[0].number = await this.store.Device.find({ deviceType: "VP" })
      .where("parent")
      .in(bedList)
      .count();
    summaries[1].number = await this.store.Device.find({ deviceType: "SP" })
      .where("parent")
      .in(bedList)
      .count();
    return summaries;
  }

  async deleteHospital(hospitalName) {
    const status = await this.store.Hospital.deleteOne({
      name: hospitalName
    });
    return status.ok && status.n;
  }

  async moveChildren(name, locationType, moveTarget) {
    // check that moveTarget and name are of the good location type
    // TODO: as I need the IDs from those two, (see below), I should optimize to reduce the number of calls to mongo
    const doLocationsExist = await Promise.all([
      this.store[locationType].find({ name }).count(),
      this.store[locationType].find({ name: moveTarget }).count()
    ]);
    if (doLocationsExist[0] && doLocationsExist[1]) {
      // get the ID of the moveTarget to do the update
      const moveTargetMongoDoc = await this.store[locationType].findOne({
        name: moveTarget
      });
      const targetID = moveTargetMongoDoc._id;
      // get the ID of the hospital to delete
      // TODO: refactor to take the ID as an input
      const moveSourceMongoDoc = await this.store[locationType].findOne({
        name
      });
      const sourceID = moveSourceMongoDoc._id;
      // look for all the children
      const inter = await this.getAllChildrenLocations(
        sourceID,
        locationType,
        this.getLevelType(this.getLevelIndex(locationType) + 1)
      );
      const childrenList =
        inter[this.getLevelType(this.getLevelIndex(locationType) + 1)];
      // get the length of the list
      const numberOfChildrenToUpdate = childrenList.length;
      // update all the children so they have a new parent
      const mongoStatus = await this.store[
        this.getLevelType(this.getLevelIndex(locationType) + 1)
      ].updateMany(
        { _id: { $in: childrenList } },
        {
          parent: targetID
        }
      );
      // check that all were updated (from the result of updateMany)
      if (mongoStatus.nModified === numberOfChildrenToUpdate) {
        return true;
      } else {
        throw new Error("Something went wrong in the updateMany");
      }
    } else {
      return new Error("one or both locations do not exist");
    }
  }

  async deleteChildren(name, locationType) {
    // TODO: refactor the function to take the ID directly as an input
    // get the ID of the hospital to delete
    const MongoDoc = await this.store[locationType].findOne({
      name
    });
    let sourceID;
    if (MongoDoc) {
      sourceID = MongoDoc._id;
    } else {
      throw new Error("This ressource does not exist");
    }
    // look for all the children
    const inter = await this.getAllChildrenLocations(
      sourceID,
      locationType,
      "Device"
    );
    // TODO: iterate on inter keys to get the list at each level
    // set a status Boolean
    let statusToReturn = true;
    Object.keys(inter).forEach(async locationTypeIter => {
      // the origin deletion shall not be deleted at this point
      if (locationTypeIter === locationType) return;
      // getting the list of nodes to delete at this level
      const childrenToDeleteForThisLevel = inter[locationTypeIter];
      // delete them in Mongo
      const mongoStatus = await this.store[locationTypeIter].deleteMany({
        _id: { $in: childrenToDeleteForThisLevel }
      });
      // check that all were deleted (from the result of deleteMany) and set statusToReturn to false if something went wrong
      if (mongoStatus.n !== childrenToDeleteForThisLevel.length) {
        statusToReturn = false;
      }
    });
    // returns true if all children were correctly deleted, else false
    return statusToReturn;
  }
}

module.exports = MongoAPI;
