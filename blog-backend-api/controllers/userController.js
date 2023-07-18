const bcrypt = require("bcrypt");
const { User } = require("../models");

const UserController = {
    signup: async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        try {
            const newUser = await User.create({
                username: req.body.username,
                password: hashedPassword,
            });
            req.session.userId = newUser.id;
            res.status(201).json({
                message: "User created successfully",
                username: newUser.username,
            });
        } catch (err) {
            console.error(err);
            if (err.name === "SequelizeValidationError") {
                return res
                    .status(422)
                    .json({ errors: err.errors.map((e) => e.message) });
            }
            res.status(500).json({
                message: "Error occurred while creating user!",
                error: err,
            });
        }
    },    

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("username:", username);
            console.log("password:", password);
    
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
    
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }
            req.session.userId = user.id;
            res.json({ message: "Login successful" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },    

  logout: (req, res) => {
    req.session.destroy();
    res.json({ message: "Logout successful" });
  },
};

module.exports = UserController;
