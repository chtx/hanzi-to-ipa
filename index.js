const express = require("express");
const app = express();
const cors = require("cors");
const converter = require("./converter");
const PORT = process.env.PORT || 5000;
const path = require("path");

// middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/")));
}

//ROUTES//

//get the string

app.post("/string", async (req, res) => {
  try {
    const { string } = req.body;
    const processed = await converter.processStr(string);

    res.json(processed);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
