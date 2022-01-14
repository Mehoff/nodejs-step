import { RoutesHandler } from "../routeHandler.js";
import { readHtml } from "../helpers/ReadFile.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { getCurrentUser } from "../helpers/CurrentUser.js";
import { Book } from "../db/schemas/BookSchema.js";
import { Comment } from "../db/schemas/CommentSchema.js";

export const getComments = RoutesHandler.get(
  "/comments",
  null,
  async (req, res, params) => {
    readHtml("./html/comments.html", req, res);
  }
);

export const postComments = RoutesHandler.post(
  "/comments",
  [ensureAuthenticated],
  async (req, res) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", async () => {
      try {
        const { text, bookId } = JSON.parse(data);

        const user = await getCurrentUser(req);

        const newComment = await Comment.create({
          text: text,
          author: user._id,
        });

        if (!newComment || newComment.error) {
          console.log("Comment", newComment);
          return res.end(JSON.stringify({ error: "Failed to post comment" }));
        }

        const book = await Book.findOneAndUpdate(
          { _id: bookId },
          { $push: { comments: newComment._id } }
        );

        if (!book || book.error) {
          console.log("Book:", book);
          return res.end(JSON.stringify({ error: "Failed to get book" }));
        }

        const comment = await Comment.findById(newComment._id).populate(
          "author"
        );

        return res.end(JSON.stringify(comment));
      } catch (err) {
        console.error(err);
        return res.end(JSON.stringify({ error: "Failed to post comment" }));
      }
    });
  }
);
