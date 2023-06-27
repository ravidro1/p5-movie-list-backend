const { MovieReview } = require("../models");

// []
exports.getAllMovieReviews = async (req, res) => {
  try {
    const movieReviewsList = await MovieReview.findAll();
    res.status(200).json({ message: "success", movieReviewsList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [indexesRangeArray]
exports.getMovieReviewsByIndexes = async (req, res) => {
  try {
    const { indexesRangeArray } = req.body;

    const movieReviews = await MovieReview.find({ id: indexesRangeArray });

    res.status(200).json({ message: "success", movieReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [movieName]
exports.createMovie = async (req, res) => {
  try {
    const regexPattern = /[^A-Za-z0-9]/g;

    const { name, description, releaseDate, categories } = req.body;
    const normalizeName = name.toLowerCase().replace(regexPattern, "");

    const newMovie = await MovieReview.create({
      name: name,
      normalizeName,
      description,
      releaseDate,
      categories: JSON.stringify(categories),
    });

    if (!newMovie) return res.status(400).json({ message: "fail" });
    res.status(200).json({ message: "success", newMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// [movie_id]
exports.deleteMovie = async (req, res) => {
  try {
    const { movie_id } = req.body;
    const deletedMovie = await MovieReview.deleteById(movie_id);
    if (!deletedMovie) return res.status(400).json({ message: "fail" });
    res.status(200).json({ message: "success", deletedMovie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovie = () => {};
