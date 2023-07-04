const { MovieComment } = require("../models");

// [movie_id, content]
exports.createMovieComment = async (req, res) => {
  try {
    const { movie_id, content } = req.body;
    const newComment = await MovieComment.create({
      movie_id,
      user_id: req.userID,
      content,
    });
    console.log(newComment);
    if (!newComment)
      return res.status(400).json({ message: "Comment Creation Fail" });
    res.status(200).json({ message: "success", newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// [comment_id]
exports.deleteMovieComment = async (req, res) => {
  try {
    const { comment_id } = req.body;

    const deletedItem = await MovieComment.deleteById(comment_id);

    if (!deletedItem)
      return res.status(400).json({ message: "Comment Delete Fail" });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// [comment_id, content]
exports.updateMovieComment = async (req, res) => {
  try {
    const { comment_id, content } = req.body;
    const editedItem = await MovieComment.updateById({
      id: comment_id,
      updateFields: { content },
    });
    res.status(200).json({ message: "success", editedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// [movie_id]
exports.getByMovieId = async (req, res) => {
  try {
    const { movie_id } = req.body;
    const commentList = await MovieComment.find({
      conditionObj: { movie_id },
      orderByObj: { updateAt: "DESC" },
    });
    res.status(200).json({ message: "success", commentList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
