const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

const {
  models: { User, Note },
} = require("./db");
const path = require("path");

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.post("/api/auth", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth", async (req, res, next) => {
  try {
    console.log("NEW TEST", await User.byToken(req.headers.authorization));
    res.send(await User.byToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/notes", async (req, res, next) => {
  try {
    console.log("WORKING HERE: ", req.headers);
    const verifiedToken = await jwt.verify(
      req.headers.authorization,
      process.env.JWT
    );
    const user = await User.findOne({
      include: Note,
      where: {
        id: verifiedToken,
      },
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/auth", async (req, res, next) => {
  try {
    res.send();
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
