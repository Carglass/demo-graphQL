module.exports = {
  Query: {
    organization: async (_, __, { dataSources }) => {
      const organization = {};
      organization.hospitals = await dataSources.mongoAPI.getHospitals();
      return organization;
    },
    hospitals: async (_, __, { dataSources }) => {
      const hospitals = await dataSources.mongoAPI.getHospitals();
      return hospitals;
    },
    wards: async (_, __, { dataSources }) => {
      const wards = await dataSources.mongoAPI.getWards();
      return wards;
    }
  },
  Hospital: {
    wards: async (hospital, __, { dataSources }) => {
      const wards = await dataSources.mongoAPI.getWards(
        (hospital = hospital.id)
      );
      return wards;
    }
  }
};
