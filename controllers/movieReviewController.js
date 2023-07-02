const { uploadImage, deleteImage } = require("../cloudinary");
const database = require("../database");
const { MovieReview } = require("../models");
const { Select } = require("../models/statements");

// []
exports.getAllMovieReviews = async (req, res) => {
  try {
    const movieReviewsList = await MovieReview.findAll();
    console.log(movieReviewsList);
    res.status(200).json({ message: "success", movieReviewsList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [indexesRangeArray]
exports.getMovieReviewsByIndexes = async (req, res) => {
  try {
    const { indexesRangeArray } = req.body;

    const movieReviews = await MovieReview.find({
      statementConditions: [
        MovieReview._conditionTypes.between({
          key: "id",
          firstCell: indexesRangeArray[0],
          lastCell: indexesRangeArray[1],
        }),
      ],
    });

    res.status(200).json({ message: "success", movieReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [movieName]
exports.createMovie = async (req, res) => {
  try {
    const regexPattern = /[^A-Za-z0-9]/g;

    const { name, description, releaseDate, categories, image } = req.body;
    // const normalizeName = name.toLowerCase().replace(regexPattern, "");

    const newMovie = await MovieReview.create({
      name: name,
      // normalizeName,
      description,
      releaseDate,
      categories: JSON.stringify(categories),
      pictureURL: null,
    });

    let imageUrl = null;
    if (image) imageUrl = await uploadImage(image, newMovie.id);

    await MovieReview.updateById({
      id: newMovie.id,
      updateFields: { pictureURL: imageUrl },
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
    await deleteImage(movie_id);
    res.status(200).json({ message: "success", deletedMovie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const movies = await MovieReview.find({
//   conditionObj:{}
// statementConditions: [
//   MovieReview._conditionTypes.findArrayInJson({
//     field: "categories",
//     values: categories,
//   }),
//   MovieReview._conditionTypes.isIncludesString({
//     key: "name",
//     value: name,
//   }),
// ],
//   limit: 20,
// });

// [name?, categories?]
exports.searchMovieReviewsByNameAndCategories = async (req, res) => {
  try {
    const { name, categories } = req.body;
    console.log(name, categories, 1);

    const statement = Select.table("MovieReview")
      .condition_findArrayOfStringInJson({
        column: "categories",
        values: categories,
      })
      .condition_isIncludesString({ column: "name", value: name })
      .limit(20)
      .selectEnd();

    const movies = (await database.execute(statement))[0];

    res.status(200).json({ message: "success", movieReviewsList: movies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// [ id, name, categories?, description?, releaseDate?]
exports.updateMovie = async (req, res) => {
  try {
    const { id, name, categories, description, releaseDate, image } = req.body;

    let imageUrl = null;
    if (image) imageUrl = await uploadImage(image, id);
    else await deleteImage(id);

    const releaseDateAfterNullCheck = releaseDate
      ?.toString()
      .replace("T", " ")
      .replace("Z", "")
      ? releaseDate?.toString().replace("T", " ").replace("Z", "")
      : null;

    const editedMovie = await MovieReview.updateById({
      id,
      updateFields: {
        name,
        categories: JSON.stringify(categories),
        description,
        releaseDate: releaseDateAfterNullCheck,
        pictureURL: imageUrl,
      },
    });

    console.log(editedMovie);
    res.status(200).json({ message: "success", editedMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
