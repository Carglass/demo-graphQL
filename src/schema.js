const { gql } = require("apollo-server");

const typeDefs = gql`
  """
  Queries (by convention) regroup what is know as the R in CRUD, Read (HTTP GET)
  """
  type Query {
    """
    Use this query to retrieve the whole organization
    """
    organization: Organization
    """
    Use this query to retrieve a specific Hospital
    """
    hospital(
      """
      Name of the Hospital for which you want information
      """
      name: String!
    ): Hospital
    """
    Use this query to retrieve a specific Ward
    """
    ward(
      """
      Name of the Ward for which you want information
      """
      name: String!
    ): Ward
  }
  """
  Mutations (by convention) regroup what is known as C_UD in CRUD, Create, Update, and Delete (HTTP POST, PATCH, PUT, DELETE)
  """
  type Mutation {
    """
    Use this mutation to create a new Hospital
    """
    addHospital(
      """
      name of the Hospital you want to create
      """
      name: String!
    ): Hospital
    """
    Use this mutation to create a new Ward
    """
    addWard(
      """
      name of the Ward you want to create
      """
      name: String!
      """
      name of the Hospital under which the Ward shall be created
      """
      hospitalName: String!
    ): Ward
    """
    Use this mutation to create a new Room
    """
    addRoom(
      """
      name of the Room you want to create
      """
      name: String!
      """
      name of the Ward under which the Room shall be created
      """
      wardName: String!
    ): Room
    """
    Use this mutation to create a new Bed
    """
    addBed(
      """
      name of the Bed you want to create
      """
      name: String!
      """
      name of the Room under which the Bed shall be created
      """
      roomName: String!
    ): Bed
    """
    Use this mutation to create a new Device
    """
    addDevice(
      """
      type of the Device you want to create
      """
      deviceType: DeviceType!
      """
      name of the Bed under which the Device shall be created
      """
      bedName: String!
    ): Device
    """
    Use this mutation to delete an existing Hospital
    """
    deleteHospital(
      """
      name of the Hospital you want to delete
      """
      name: String!
      """
      Precise how to handle the children, move them to another Hospital, or delete them (optional if there are no children)
      """
      childrenMgt: ChildrenDeletion
      """
      if childrenMgt is *MOVE*, it is the target location for this move
      """
      moveTarget: String
    ): Status
    # deleteWard(name: String!): Status
    # deleteRoom(name: String!): Status
    # deleteBed(name: String!): Status
    # deleteDevice(guid: ID!): Status
    # reassignDevice(guid: ID!, moveTarget: String!): Status
  }

  type Subscription {
    deviceAdded: Device
  }

  """
  An Organization is the highest level of hierarchy, under which there can be multiple Hospitals
  """
  type Organization {
    """
    List of the Hospitals in the Organization
    """
    hospitals: [Hospital]!
  }

  """
  Hospital is generally a building or a group of buildings located in a common geographic location
  """
  type Hospital {
    """
    Unique identifier of the Hospital
    """
    id: ID!
    """
    Name of the Hospital (needs to be unique accross the hospitals)
    """
    name: String!
    """
    List of the Wards in the Hospital
    """
    wards: [Ward]
  }

  """
  a Ward is a unit of care that is determined by the practice (Immunology, Oncology, Pediatrics etc). It is possible to access a summary of the devices here.
  """
  type Ward {
    """
    Unique identifier of the Ward
    """
    id: ID!
    """
    Name of the Ward (needs to be unique accross the wards)
    """
    name: String!
    """
    List of the device summaries in the ward (one per device type)
    """
    deviceSummaries: [DeviceSummary]
    """
    List of the Rooms in the Ward
    """
    rooms: [Room]
  }

  """
  a Room is, well, a room, in which there can be one or more patients
  """
  type Room {
    """
    the unique identifier for the Room
    """
    id: ID!
    name: String!
    beds: [Bed]
  }

  """
  Fixed devices are assigned to a specific Bed
  """
  type Bed {
    id: ID!
    name: String!
    devices: [Device]
  }

  """
  it gives the number of devices by type, that are present in the location or its children
  """
  type DeviceSummary {
    deviceType: DeviceType!
    number: Int!
  }

  """
  a Device is defined by an identifier and its type
  """
  type Device {
    deviceType: DeviceType!
    id: ID!
  }

  """
  an Enumeration that contains all the device types
  """
  enum DeviceType {
    VP
    SP
  }

  """
  a generic Status message shall provide feedback on the mutation that was attempted
  """
  enum Status {
    OK
    NOK
  }

  """
  precises the behavior of the system when a location is deleted for its children.
  """
  enum ChildrenDeletion {
    """
    DESTROY means that all the children locations and devices shall be removed from the system
    """
    DESTROY
    """
    MOVE means that all the children locations and devices shall be moved to another location (same level as the one deleted)
    """
    MOVE
  }
`;

module.exports = typeDefs;
