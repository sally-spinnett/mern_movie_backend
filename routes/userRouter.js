const router = require("express").Router();
const Account = require("../models/account");
const Rating = require("../models/rating");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const fetch = require("node-fetch");

// router.get("/test", (req, res) => {
//    res.send("Hellos, it's working");
// });

router.post("/register", async (req, res) => {
    try {
        const {email, password, username} = req.body;

        //validate
        if(!email || !password || !username)
            return res.status(400).json({msg: "Not all fields have been entered"});

        // const existingUser = Account.findOne({email: req.body.email});
        // if (existingUser)
        //     return res.status(400).json({msg: "An account with this email already exists"});

        //save
        const newAccount = new Account({
            email,
            password,
            username,
        });
        const savedUser = await newAccount.save();
        res.json(savedUser);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await Account.findOne({email: email});
        if (!user)
            return res.status(400).json({msg: "No account with this email."});

        if(password === user.password){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            res.json({
                token,
                user: {
                   id: user._id,
                   username: user.username,
                   email: user.email,
                }
            })

        } else {
            return res.status(400).json({msg: "Invalid credentials"});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.delete("/delete", auth, async (req, res) => {
    try{
        const deletedUser = await Account.findByIdAndDelete((req.user));
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);
        const user = Account.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// for reviewing movie marks
router.get('/:username', async (req, res) => {
    console.log(req.params.username);
    const filter = {username: req.params.username};

    try {
        const user = await Account.findOne(filter);
        const marks = await Rating.find({email: user.email});
        return res.json(marks);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// for marking movies
router.post('/mark', auth, async (req, res) => {
    // const user = await Account.findById(req.user);
    const {email, movieTitle, marks} = req.body;
    console.log(req.body);
    try {
        const newRating = new Rating({
            email,
            movieTitle,
            marks,
        });
        const savedRating = await newRating.save();
        console.log(savedRating);
        res.json(savedRating);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/", auth, async (req, res) => {
    const user = await Account.findById(req.user);
    res.json(user);
});

module.exports = router;