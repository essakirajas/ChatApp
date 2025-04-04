import { gql } from 'apollo-angular';

const addUser = gql`
  subscription {
    addUser {
      id
      name
      email
    }
  }
`;

const newMessage = gql`
  subscription {
    newMessage {
      userId
        content
    }
  }
`;

const users = gql`
query($userId:Int){
  friends(userId:$userId) {
        id  name  imgUrl
        message {
          content
    }
  }
}
`;

export { addUser, users, newMessage };
