const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
const compression = require('compression');
const morgan = require('morgan');
const SocketIO = require('socket.io');

require("dotenv").config();
require("./database/connect");

app.use(cors());
const port = process.env.PORT || 9999;
const host = process.env.HOST;

app.use(morgan('dev'));
app.use(compression())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const user = require("./routes/user");
const ad = require("./routes/ad");
const rent = require("./routes/rent");
const car = require("./routes/car");
const post = require("./routes/post");
const room = require("./routes/room");
const test = require("./routes/tests");
const socketConnect = require("./socket/socket");

app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/user", user.routes);
app.use("/ad", ad.routes);
app.use("/rent", rent.routes);
app.use("/car", car.routes);
app.use("/post", post.routes);
app.use("/room", room.routes);
app.use("/test", test.routes);

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

myServer = app.listen(port, host, () => {
    console.log("Sawario Server running at http://" + host + ":" + port);
});

io = SocketIO(myServer);
socketConnect(io); 