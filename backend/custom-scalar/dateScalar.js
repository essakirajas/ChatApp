const { GraphQLScalarType } = require('graphql');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return new Date(value).toISOString().split('T')[0];
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    return new Date(parseInt(ast.value, 10));
  },
});
module.exports = dateScalar;
