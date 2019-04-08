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
  },
  Ward: {
    rooms: async (ward, __, { dataSources }) => {
      const rooms = await dataSources.mongoAPI.getRooms((ward = ward.id));
      return rooms;
    },
    deviceSummaries: (ward, __, { dataSources }) => {
      // TODO: Code the logic to determine the summary for each device type
      return null;
    }
  },
  Room: {
    beds: async (room, __, { dataSources }) => {
      const beds = await dataSources.mongoAPI.getBeds((room = room.id));
      return beds;
    }
  },
  Bed: {
    devices: async (bed, __, { dataSources }) => {
      const devices = await dataSources.mongoAPI.getDevices((bed = bed.id));
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
