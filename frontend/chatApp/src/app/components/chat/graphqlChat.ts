import { gql } from "apollo-angular";

const userDetails = gql`
query UserDetails($receiverId: Int) {
  userDetails(receiverId: $receiverId) {
    name
    email
    imgUrl
  }
}`;

const messages = gql`
query GetId($sender: Int, $receiver: Int) {
  messages(sender: $sender, receiver: $receiver) {
    userId
    content
    createdAt
  }
}
`;

const Messages = gql`
  subscription Messages($userId: Int!, $receiverId: Int!) {
    Messages(userId: $userId, receiverId: $receiverId) {
      userId
      receiverId
      content
      createdAt
    }
  }
`;

const sendMessage = gql`
  mutation PostMessage($content: String!, $userId: Int!,$receiverId:Int) {
    postMessage(content: $content, userId: $userId,receiverId:$receiverId) {
      content
    }
  }
`;



export { userDetails, messages, Messages, sendMessage }