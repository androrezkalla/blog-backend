const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");

router.get("/current_user", async (req, res) => {
  if (req.session.userId) {
    const user = await User.findByPk(req.session.userId);
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        // Add any other relevant user properties
      }
    });
  } else {
    return res.status(401).json({user: null})
  }
});

router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    req.session.userId = user.id;
    // Send a response to the client informing them that the user was successfully created
    res.status(201).json({
      message: "User created!",
      user: {
        username: user.username,
        // Add any other relevant user properties
      },
    });
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({
      message: "Error occurred while creating user",
      error: err,
    });
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.sendStatus(500);
    }

    res.clearCookie("connect.sid");
    return res.json({ message: "Logout successful" });
  });
});

router.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.destroy();
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post("/login", async (req, res) => {
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
  });

module.exports = router;
