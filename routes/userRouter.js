const router = require("express").Router();
const Account = require("../models/account");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

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
})

module.exports = router;