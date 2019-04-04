const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    organization: Organization
    hospitals: [Hospital]
    wards: [Ward]
  }

  type Organization {
    id: ID!
    name: String!
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
