const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://Gowtham:gowtham123@mycluster-b2qbn.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/db", (req, res) => {
  client.connect(err => {
    const collection = client.db("get-hospitals").collection("Places");
    collection.remove({});
    collection.insertOne(
      {
        location: req.body.location,
        hospitals: req.body.hospitals,
        no_of_Hospitals: req.body.length
      },
      (err, res) => {
        if (err) throw err;
      }
    );
    client.close();
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.listen(5000, () => console.log("Web app listening on port 5000!"));
