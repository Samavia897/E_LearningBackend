const express = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addTopic,
  addFileToTopic,
  addLinkToTopic,
  deleteFileFromTopic,
} = require("../controllers/courseController");
const { upload } = require("../middleware/uploadMiddleware");
const { multerErrorHandler } = require("../middleware/errorMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

router.post("/:courseId/topics", addTopic);

router.post(
  "/:courseId/topics/:topicId/files",
  upload.single("file"),
  multerErrorHandler,
  addFileToTopic
);

router.post("/:courseId/topics/:topicId/links", addLinkToTopic);
router.delete("/:courseId/topics/:topicId/files/:fileIndex", deleteFileFromTopic);

module.exports = router;
