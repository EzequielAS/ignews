import { Client } from 'faunadb'

const Fauna = new Client({
    secret: process.env.FAUNADB_KEY,
    domain: 'db.us.fauna.com'
})

export default Fauna