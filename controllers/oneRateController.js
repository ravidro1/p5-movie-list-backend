const database = require("../database");
const { OneRate, MovieReview } = require("../models");
const { Select } = require("../models/statement");

// [movie_id, rate]
exports.createOrUpdateOneRate = async (req, res) => {
  try {
    const { movie_id, rate } = req.body;

    const newOneRate = await OneRate.createOrUpdate({
      user_id: req.userID,
      movie_id,
      rate,
    });
    if (!newOneRate)
      return res.status(400).json({ message: "oneRate create fail" });

    const updateMovie = await MovieReview.findById(movie_id);

    if (!updateMovie)
      return res.status(400).json({ message: "movie fetch fail" });

    res.status(200).json({ message: "success", updateMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// []
exports.searchForUserRates = async (req, res) => {
  try {
    const statement = Select.table("OneRate")
      .field_normalColumnOrExpression({ columnOrExpression: "movie_id" })
      .condition_equalNotString({ column: "user_id", value: req.userID })
      .selectEnd();

    const movies_ids = (await database.execute(statement))[0];

    if (!movies_ids)
      return res.status(400).json({ message: "movies ids fetch fail" });

    const formatMoviesIDs = movies_ids?.map((movie) => movie.movie_id);

    res
      .status(200)
      .json({ message: "success", userMovieRates: formatMoviesIDs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// [movie_id]
exports.deleteOneRate = async (req, res) => {
  try {
    const { movie_id } = req.body;
    console.log(req.body);
    const isDeleted = await OneRate.deleteOne({
      movie_id,
      user_id: req.userID,
    });
    if (!isDeleted) return res.status(400).json({ message: "fail" });

    const updateMovie = await MovieReview.findById(movie_id);

    res.status(200).json({ message: "success", updateMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
