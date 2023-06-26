const express = require("express");
const router = express.Router();

const {
  getAllMovieReviews,
  getMovieReviewsByIndexes,
  createMovie,
  deleteMovie,
} = require("../controllers/movieReviewController");
const { isTokenVerify } = require("../globalFunctions");

router.get("/getAllMovieReviews", getAllMovieReviews);
router.post("/getMovieReviewsByIndexes", getMovieReviewsByIndexes);

router.post("/createMovie", createMovie);
router.post("/deleteMovie", deleteMovie);
// router.post("/createMovie", isTokenVerify, createMovie);
// router.post("/deleteMovie", isTokenVerify, deleteMovie);

module.exports = router;
