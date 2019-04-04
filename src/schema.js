const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    organization: Organization
    hospitals: [Hospital]
    wards: [Ward]
  }

  type Mutation {
    addHospital(name: String!): Hospital
    addWard(name: String!, hospitalId: ID!): Ward
    addRoom(name: String!, wardId: ID!): Room
    addBed(name: String!, RoomId: ID!): Bed
    addDevice(deviceType: DeviceType!, BedId: ID!): Device
  }

  type Organization {
    hospitals: [Hospital]!
  }

  type Hospital {
    id: ID!
    name: String!
    wards: [Ward]!
  }

  type Ward {
    id: ID!
    name: String!
    deviceSummaries: [DeviceSummary]
    rooms: [Room]
  }

  type Room {
    id: ID!
    name: String!
    beds: [Bed]
  }

  type Bed {
    id: ID!
    name: String!
    devices: [Device]
  }

  type DeviceSummary {
    deviceType: DeviceType!
    number: Int!
  }

  type Device {
    deviceType: DeviceType!
    id: ID!
  }

  enum DeviceType {
    VP
    SP
  }
`;

module.exports = typeDefs;
