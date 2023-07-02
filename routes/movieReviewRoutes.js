const express = require("express");
const router = express.Router();

const {
  getAllMovieReviews,
  getMovieReviewsByIndexes,
  createMovie,
  deleteMovie,
  searchMovieReviewsByNameAndCategories,
  updateMovie,
} = require("../controllers/movieReviewController");
const { isTokenVerify } = require("../globalFunctions");

router.get("/getAllMovieReviews", getAllMovieReviews);
router.post("/getMovieReviewsByIndexes", getMovieReviewsByIndexes);
router.post(
  "/searchMovieReviewsByNameAndCategories",
  searchMovieReviewsByNameAndCategories
);

router.post("/createMovie", isTokenVerify, createMovie);
router.post("/deleteMovie", isTokenVerify, deleteMovie);
router.post("/updateMovie", isTokenVerify, updateMovie);

// router.post("/createMovie", createMovie);
// router.post("/deleteMovie", deleteMovie);
// router.post("/updateMovie", updateMovie);

module.exports = router;
