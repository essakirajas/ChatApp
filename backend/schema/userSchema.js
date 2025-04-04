module.exports = `#graphql
scalar Date
scalar Email
scalar Upload
directive @upper on FIELD_DEFINITION
  type user {
    id: ID
    name: String! 
    email: Email!
    password: String
    phoneNo:Int
    imageUrl: String
    createdAt:Date!
  }
  
  type Message {
    msg: String
    token: String
    refreshToken :String
  }

  type Query {
    login(email: Email!, password: String!): Message
    getId : user
    user:user
    users:[user]
  }
  type Mutation{
    signUp(createuser: createUser!,file: Upload): Message
  }
  
  input createUser {
    id: ID
    name: String!
    email: String!
    password: String!
    phoneNo:Int
    createdAt:Date
  }

  type Subscription{
    addUser:user
  }
`;
