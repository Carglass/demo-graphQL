const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    organization: Organization
    hospital(name: String!): Hospital
    ward(name: String!): Ward
  }

  type Mutation {
    addHospital(name: String!): Hospital
    addWard(name: String!, hospitalName: String!): Ward
    addRoom(name: String!, wardName: String!): Room
    addBed(name: String!, roomName: String!): Bed
    addDevice(deviceType: DeviceType!, bedName: String!): Device
    deleteHospital(
      name: String!
      childrenMgt: ChildrenDeletion
      moveTarget: String
    ): Status
    deleteWard(name: String!): Status
    deleteRoom(name: String!): Status
    deleteBed(name: String!): Status
    deleteDevice(guid: ID!): Status
    reassignDevice(guid: ID!, moveTarget: String!): Status
  }

  type Organization {
    hospitals: [Hospital]!
  }

  type Hospital {
    id: ID!
    name: String!
    wards: [Ward]
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

  enum Status {
    OK
    NOK
  }

  enum ChildrenDeletion {
    DESTROY
    MOVE
  }
`;

module.exports = typeDefs;
