const { DataSource } = require("apollo-datasource");

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
}

module.exports = MongoAPI;
