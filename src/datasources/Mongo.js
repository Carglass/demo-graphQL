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
    // TODO: understand why hospital is the id here
    const wards = this.store.Ward.find(
      hospitalId ? { parent: hospitalId } : null
    );
    return wards;
  }
}

module.exports = MongoAPI;
