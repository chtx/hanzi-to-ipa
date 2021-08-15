const express = require("express");
const app = express();
const cors = require("cors");
const process = require("./process");

// middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//get the string

app.post("/string", async (req, res) => {
  try {
    const { string } = req.body;
    const processed = await process.processStr(string);

    res.json(processed);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started");
});
