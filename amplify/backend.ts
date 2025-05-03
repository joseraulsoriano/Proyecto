import { defineBackend } from '@aws-amplify/backend';
import { Schema } from '@aws-amplify/graphql-api-construct';

const backend = defineBackend({
  api: ({ stack }) => ({
    schema: new Schema({
      typeDefs: `
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
    })
  })
});

export type Schema = InferSchemaType<typeof backend.api.schema>; 