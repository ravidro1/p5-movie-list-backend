const Delete = require("./delete");
const Insert = require("./insert");
const Select = require("./select");
const Update = require("./update");
const Trigger = require("./trigger");

console.log(Select);

module.exports = { Trigger, Delete, Insert, Select, Update };

// ArrayInvalidCharsError([firstCell, lastCell]);
