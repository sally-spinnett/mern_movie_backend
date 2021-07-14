const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
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
    useFindAndModify: false,
}, (err) => {
    if (err) throw err;
    console.log("Database connected");
});

// set up routes
app.use("/users", require("./routes/userRouter"));
// app.use("/movies", require("./routes/movieRouter"));
app.get("/movies", async (req, res) => {
    const url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=113c7f5dffed89574dffaa2a18ff9ce0&page=1"
    const options = {
        method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    res.send({ data });
    console.log(data);
});