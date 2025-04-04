module.exports = `#graphql
scalar Date
type message{
id:ID
content:String
userId:Int
receiverId:Int
createdAt:Date
}

type userDetail{
name :String
email:String
imgUrl:String
}

type Query{
  messages(sender:Int,receiver:Int):[message]
  userDetails(receiverId:Int):userDetail
}

type Mutation{
  postMessage(content:String!,userId:Int!,receiverId:Int):message
}

type Subscription {
  Messages(userId: Int!, receiverId: Int!): message
}
`;