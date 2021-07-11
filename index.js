const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// set up express

const app = express();
app.use(express.json());
app.use(cors());

// local port or online both compatible
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('The server has started on port: ' + PORT));

// set up mongoose
// mongodb+srv://sally:1028@main.u3gem.mongodb.net/accountDatabase?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log("Database connected");
});

// set up routes
app.use("/users", require("./routes/userRouter"))