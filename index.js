// include library
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//connect mongodb
const connectDB = async() => {
  //wait for connect mongodb
  await mongoose.connect("mongodb://myAdmin:myAdmin@localhost:27017");
  //if connect error for show error
  mongoose.connection.on("error", (err) =>
    console.log(`Connection failed ${err}`)
  );
  //if connect success for show success
  mongoose.connection.on("connected", (conn) =>
    console.log("Welcome to Mongodb")
  );
};
//path db of my mongodb
const uri = "mongodb://myAdmin:myAdmin@localhost:27017";
//apply express
const app = express();
//create port for server
const port = 3000;
//Invoke cors so that the server can receive data from outside.
app.use(cors());
//data used will be json
app.use(express.json());
//connect mongodb
connectDB();
// init path
app.get("/", (req, res) => {
  res.send("Hi Mr.Thiraphat Chorakhe. Welcome to backend exam");
});

//show all product data
app.get("/todos", async (req, res) => {
  try {
   const client = new MongoClient(uri);
  await client.connect();
  const todos = await client.db("test").collection("todos").find({}).toArray();
  await client.close();
  res.status(200).send(todos); 
  } catch (error) {
     res.status(404).send({
       status: "Can't Show data",
       message: `todo not found in table`,
     });
     console.log(error.message);
  }
  
});
// search for productid
app.get("/todos/:id", async (req, res) => {
  try {
    // request param id
    const id = parseInt(req.params.id);
    const client = new MongoClient(uri);
    // wait connected
    await client.connect();
    // connect to database test and table todo and show id from request id
    const todos = await client
      .db("test")
      .collection("todos")
      .findOne({ id: id });
    await client.close();
    res.status(200).send({
      status: "Search Id success",
      message: "your todo search success",
      todo: todos,
    });
    //reponse error 
  } catch (error) {
    res.status(404).send({
      status: "Can't search data",
      message: `todo not found table`,
    });
    console.log(error.message);
  }
});
//create postPath for add data
app.post("/todos/create", async (req, res) => {
  try {
    const client = new MongoClient(uri);
     // wait connected
    await client.connect();
    // request param id
    const data = req.body;
    // connect to database test and table todos are insert data to table
    await client
      .db("test")
      .collection("todos")
      .insertOne({
        user_id: parseInt(data.userid),
        id: parseInt(data.id),
        title: data.title,
        completed: data.cbd,
      });
    // show response data after added
    res.status(200).send({
      status: "Nice for AddData",
      message: `todo: ${data.id} is created`,
      todo: data,
    });
    // wait for added
    await client.close();
    //response error 
  } catch (error) {
    res.status(404).send({
      status: "Can't insert data",
      message: `todo not insert to table`,
    });
    console.log(error.message);
  }
});
//putPath
app.put("/todos/update", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    const id = parseInt(req.params.id);
    // wait for connected
    await client.connect();
    // get all request data
    const data = req.body;
    // connect to database test, table todos and write id in json body for update data 
    await client
      .db("test")
      .collection("todos")
      .updateOne({"id": id},{"$set": {
        user_id: parseInt(data.userid),
        id: parseInt(data.id),
        title: data.title,
        completed: data.cbd,
      }});
    // show response update success 
    res.status(200).send({
      status: "Nice for updateData",
      message: `todo: ${data.id} is updated`,
      todo: data,
    });
    //wait updated
    await client.close();
  } catch (error) {
    // throw error
    res.status(404).send({
      status: "update data failed",
      message: `update failed`,
    });
    console.log(error.message);
  }
});
// delete Path
app.delete('/todos/delete', async(req, res) => {
  try {
    // get all request data
   const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
    // connect to database test, table todos and write id in json body for delete data
  await client.connect();
  await client.db('test').collection('todos').deleteOne({'id': id});
   //wait close
  await client.close();
    //response after deleted
  res.status(200).send({
    "status": "ok",
    "message": `todo Id:${id} is deleted`
  });
  } catch (error) {
    //throw error
     res.status(404).send({
      status: "delete id failed",
      message: `delete failed`,
    });
    console.log(error.message);
  }
});
//run port
app.listen(port, () => {
  console.log(`Hello Express localhost:${port}`);
});
