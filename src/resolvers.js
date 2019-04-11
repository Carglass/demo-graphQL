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
    },
    deleteHospital: async (
      _,
      { name, childrenMgt, moveTarget },
      { dataSources }
    ) => {
      // start by checking that there are indeed no children
      if (!childrenMgt) {
        // TODO: check that there are no children in Mongo
        const childrenExist = true;
        if (childrenExist) {
          return new Error("Precise what to do with the children");
        } else {
          // go on with a simple destroy if there was no children indeed
          const mongoStatus = await dataSources.mongoAPI.deleteHospital(name);
          return mongoStatus ? "OK" : "NOK";
        }
      }

      // then check that there is a move target if move is chosen
      if (childrenMgt === "MOVE" && !moveTarget) {
        return new Error("Precise where to move the children");
      }

      // then proceed with the treatment when there are children
      if (childrenMgt === "DESTROY") {
        const statusForChildrenDeletion = await dataSources.mongoAPI.deleteChildren(
          "Hospital",
          name
        );
        if (statusForChildrenDeletion) {
          const mongoStatus = await dataSources.mongoAPI.deleteHospital(name);
          return mongoStatus ? "OK" : "NOK";
        } else {
          return new Error("Something went wrong deleting children");
        }
      } else if (childrenMgt === "MOVE") {
        const statusForChildrenMove = await dataSources.mongoAPI.moveChildren(
          name,
          "Hospital",
          moveTarget
        );
        if (statusForChildrenMove) {
          const mongoStatus = await dataSources.mongoAPI.deleteHospital(name);
          return mongoStatus ? "OK" : "NOK";
        } else {
          return new Error("Something went wrong moving Children");
        }
      } else {
        return new Error("Something went wrong");
      }
    }
  }
};
