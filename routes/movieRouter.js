const router = require("express").Router();
const fetch = require("node-fetch");

router.get("/movies", async (req, res) => {
    const url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=113c7f5dffed89574dffaa2a18ff9ce0&page=1"
    const options = {
        method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    res.send({ data });
    console.log(data);
});

module.exports = router;
