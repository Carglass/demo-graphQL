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
  // async getLaws() {
  //   const laws = await this.store.Law.find();
  //   return laws;
  // }

  async getHospitals() {
    const hospitals = this.store.Hospital.find();
    return hospitals;
  }

  async getWards(hospitalId) {
    const wards = this.store.Ward.find(
      hospitalId ? { parent: hospitalId } : null
    );
    return wards;
  }

  async getRooms(wardId) {
    const rooms = this.store.Room.find(wardId ? { parent: wardId } : null);
    return rooms;
  }

  async getBeds(roomId) {
    const beds = this.store.Bed.find(roomId ? { parent: roomId } : null);
    return beds;
  }

  async getDevices(bedId) {
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
      // TODO: here find returned an array (of size 1), but bot in the other funcitons, why?
      const hospitalId = await this.store.Hospital.findOne({ name: parent });
      return this.store.Ward.create({ name: name, parent: hospitalId._id });
    } else {
      return new Error("Ward must have a name");
    }
  }
}

module.exports = MongoAPI;
