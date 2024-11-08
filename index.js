const { initialization } = require("./db/db.connect");
const User = require("./models/user.model");

initialization();

const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const app = express();

const secretkey = process.env.SECRET_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  openSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Express Started"));

const verifyJwt = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    //console.log(token);
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

app.post("/api/admin/signup", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const newUser = new User({ userName, password });
    const savedUser = await newUser.save();

    if (!savedUser) {
      res.status(404).json({ message: "User wasn't able to get save" });
    } else {
      res.status(200).json(savedUser);
    }
  } catch (error) {
    res.status(401).json({ message: "" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const foundUser = await User.find({ userName, password });

    if (foundUser) {
      const token = jwt.sign({ role: "admin", userName }, jwtSecretKey, {
        expiresIn: "24h",
      });

      res.json({ token });
    } else {
      res.json({ message: "Invalid secret key" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/data/profile", verifyJwt, (req, res) => {
  res.json({ message: "Welcome to profile page!" });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Express started at port", PORT));
