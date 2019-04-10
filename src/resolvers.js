module.exports = {
  Query: {
    organization: async (_, __, { dataSources }) => {
      const organization = {};
      organization.hospitals = await dataSources.mongoAPI.getHospitals();
      return organization;
    },
    hospital: async (_, { name }, { dataSources }) => {
      const hospital = await dataSources.mongoAPI.getOneHospital(name);
      return hospital;
    },
    ward: async (_, { name }, { dataSources }) => {
      const ward = await dataSources.mongoAPI.getOneWard(name);
      return ward;
    }
  },
  Hospital: {
    wards: async (hospital, __, { dataSources }) => {
      const wards = await dataSources.mongoAPI.getWards(hospital.id);
      return wards;
    }
  },
  Ward: {
    rooms: async (ward, __, { dataSources }) => {
      const rooms = await dataSources.mongoAPI.getRooms(ward.id);
      return rooms;
    },
    deviceSummaries: async (ward, __, { dataSources }) => {
      const deviceSummaries = await dataSources.mongoAPI.getWardDeviceSummaries(
        ward.id
      );
      return deviceSummaries;
    }
  },
  Room: {
    beds: async (room, __, { dataSources }) => {
      const beds = await dataSources.mongoAPI.getBeds(room.id);
      return beds;
    }
  },
  Bed: {
    devices: async (bed, __, { dataSources }) => {
      const devices = await dataSources.mongoAPI.getDevices(bed.id);
      return devices;
    }
  },
  Mutation: {
    addHospital: async (_, { name }, { dataSources }) => {
      const hospital = await dataSources.mongoAPI.createHospital(name);
      return hospital;
    },
    addWard: async (_, { name, hospitalName }, { dataSources }) => {
      const ward = await dataSources.mongoAPI.createWard(name, hospitalName);
      return ward;
    },
    addRoom: async (_, { name, wardName }, { dataSources }) => {
      const room = await dataSources.mongoAPI.createRoom(name, wardName);
      return room;
    },
    addBed: async (_, { name, roomName }, { dataSources }) => {
      const bed = await dataSources.mongoAPI.createBed(name, roomName);
      return bed;
    },
    addDevice: async (_, { deviceType, bedName }, { dataSources }) => {
      const device = await dataSources.mongoAPI.createDevice(
        deviceType,
        bedName
      );
      return device;
    }
  }
};
