const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://juan:juan@devconnector-liyrv.mongodb.net/test?retryWrites=tru";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

module.exports = {
  uri:
    "mongodb+srv://juan:juan@devconnector-liyrv.mongodb.net/test?retryWrites=true",
  secretOrKey: "onconexus"
};
