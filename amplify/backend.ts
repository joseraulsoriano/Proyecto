import { defineBackend } from '@aws-amplify/backend';
import { Schema } from '@aws-amplify/graphql-api-construct';

const schema = new Schema({
  typeDefs: /* GraphQL */ `
    type TextContent @model @auth(rules: [{ allow: public }]) {
      id: ID!
      text: String!
      timestamp: AWSTimestamp!
      authorId: String!
    }

    type Subscription {
      onTextUpdate(authorId: String!): TextContent
        @aws_subscribe(mutations: ["updateTextContent"])
    }
  `
});

const backend = defineBackend({
  schema,
  auth: {
    loginWith: {
      email: true,
      phone: false,
      username: false
    }
  }
});

export default backend; 