import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $group: {
      _id: "NULL",
      totalCount: {
        $sum: {
          $size: "$inputFields",
        },
      },
    },
  },
  {
    $unset: "_id",
  },
];

const client = await MongoClient.connect(
  "mongodb+srv://worlddental:worlddental@cluster0.migses4.mongodb.net/WORLDDENTALCONFERENCE?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db("WORLDDENTALCONFERENCE").collection("accompanydetails");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
