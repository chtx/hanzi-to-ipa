//const pool = require("./db"); // this loades the db.js file
const process = require("./process");

(async () => {
  const string = "主丽乒儿了？";
  const a = await process.processStr(string);
  console.log(a);
})();
