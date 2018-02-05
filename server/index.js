const express = require("express");
const bodyParser = require("body-parser");
const mc = require(__dirname + "/controllers/mc_controller");
 var cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(__dirname + "/../public/build"))

const baseURL = "/api/getList";
app.get("/api/getList", mc.read);
app.get("/api/getListName", mc.getListName);
app.post("/api/addToList", mc.create);
app.put("/api/updateListName/:id", mc.updateListName);
app.delete("/api/deleteFromList/:id",mc.remove);

const port = 6000;
app.listen(port, () => console.log(`Listening on port ${port}`));