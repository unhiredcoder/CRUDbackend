//------------------------------------------------------------------------------------------
// const Userdata = require('./phones.json');
// User.insertMany(Userdata.phones)
//   .then(() => {
//     console.log(`Saved all Users to the database`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
//------------------------------------------------------------------------------------------
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const User = require("./user");
const Item = require("./item");
const cors = require("cors");
const jwt=require("jsonwebtoken")
const secret_key='fuck'
const PORT=process.env.PORT || 5000;
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const url = "mongodb://proboys777333:pritambhai@ac-rrmx7kp-shard-00-00.5kqktya.mongodb.net:27017,ac-rrmx7kp-shard-00-01.5kqktya.mongodb.net:27017,ac-rrmx7kp-shard-00-02.5kqktya.mongodb.net:27017/?ssl=true&replicaSet=atlas-67jp7r-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to Database Successfully!'))
  .catch((err) => { console.error("Error is" + err); });
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.use(express.json())
app.use(cors())

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 app.post("/register", async (req, res) => {
  const user = new User(req.body);
  let result = await user.save();
  result = result.toObject()
  const token = jwt.sign({ userId: result._id },secret_key);
  // Send the token in the response
  res.status(200).send({result,auth:token });
  delete result.pass
  // res.send(result);
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/login", async (req, res) => {
  const { name, pass } = req.body;
  const userlog = await User.findOne({ name, pass }).select("-pass");
  if (!name || !pass) {
    res.status(401).send("Please fill both the fields!");
  } else if (userlog) {
    const token = jwt.sign({ userId: userlog._id },secret_key);
    // Send the token in the response
    res.status(200).send({userlog,auth:token });
    // res.status(200).send(userlog);
  } else {
    res.status(200).send({ error: "User not exists!" });  //----IMP----===>>
    //The server-side code was sending a 404 status code for "User not found" which the client-side code didn't recognize as an error. Changing the server-side code to send a 200 status code with an error property allowed the client-side code to log the desired error message. 
  }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/add-product", async (req, res) => {
  let item = new Item(req.body);
  let result = await item.save()
  res.send(result)
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get("/products", async (req, res) => {
  let products = await Item.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Products found" });
  }
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.delete("/item/:id", async (req, res) => {
  let products = await Item.deleteOne({ _id: req.params.id });
  res.send(products);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.put("/product/:id", async (req, res) => {
  let newlyupdate = await Item.updateOne({ _id: req.params.id }, { $set: req.body });
  res.send(newlyupdate);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/:key", async (req, res) => {
  try {
    const result = await Item.find({
      $or: [
        { name: { $regex: req.params.key, $options: "i" } },
        { company: { $regex: req.params.key, $options: "i" } },
        { category: { $regex: req.params.key, $options: "i" } },
        { price: { $regex: req.params.key} },
      ]
    });
    res.send(result);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/product/:id", async (req, res) => {
  try {
    let result = await Item.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal server error or no product found");
  }
});


app.listen(PORT, () => console.log("Running on fire 🔥🔥 5k "))