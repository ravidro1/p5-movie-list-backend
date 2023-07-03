const express = require("express");
const {
  createMovieComment,
  deleteMovieComment,
  getByMovieId,
  updateMovieComment,
} = require("../controllers/movieCommentController");
const { isTokenVerify } = require("../globalFunctions");
const router = express.Router();

router.post("/getByMovieId", getByMovieId);
router.post("/createMovieComment", isTokenVerify, createMovieComment);
router.post("/deleteMovieComment", isTokenVerify, deleteMovieComment);
router.post("/updateMovieComment", isTokenVerify, updateMovieComment);

module.exports = router;
