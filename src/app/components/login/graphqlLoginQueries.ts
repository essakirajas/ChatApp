import { gql } from 'apollo-angular';

const registerMutation = gql`
  mutation signUp($createuser: createUser!,$file: Upload) {
    signUp(createuser: $createuser, file: $file) {
        msg
    }
  }
`;

const login = gql`
  query Login($email: Email!, $password: String!) {
    login(email: $email, password: $password) {
      token refreshToken
  }
}
`;

const getId = gql`
query  {
  getId {
    id 
  }
}
`;

export { registerMutation, login, getId };