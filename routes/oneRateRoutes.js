const express = require("express");
const {
  deleteOneRate,
  createOrUpdateOneRate,
  searchForUserRates,
} = require("../controllers/oneRateController");
const { isTokenVerify } = require("../globalFunctions");
const router = express.Router();

router.post("/createOrUpdateOneRate", isTokenVerify, createOrUpdateOneRate);
router.get("/searchForUserRates", isTokenVerify, searchForUserRates);
router.post("/deleteOneRate", isTokenVerify, deleteOneRate);

module.exports = router;
