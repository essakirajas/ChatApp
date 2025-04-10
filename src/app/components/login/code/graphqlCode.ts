import { gql } from 'apollo-angular';

const login = gql`
query Login($phoneNo: Int!, $otp: String!) {
  login(phoneNo: $phoneNo, otp: $otp) {
    token
    refreshToken
    msg
  }
}
`;

export { login };