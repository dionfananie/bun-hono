export const userGqlSchema = `

    type User {
        username: String!
        name: String!
    }

    type Query {
        user: User!
    }
    `;
