const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
require("./database/connect");

app.use(cors());
const port = process.env.PORT || 3000;
const host = process.env.HOST;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const user = require("./routes/user");
const ad = require("./routes/ad");
const rent = require("./routes/rent");
const car = require("./routes/car");

app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/user", user.routes);
app.use("/ad", ad.routes);
app.use("/rent", rent.routes);
app.use("/car", car.routes);

app.get("/", function (req, res) {
    res.send("Sawari Server");
});

server = app.listen(port, host, () => {
    console.log("Running Server at http://" + host + ":" + port);
});

