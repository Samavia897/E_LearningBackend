import Course from "../models/Course.js";
import path from "path";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Get single course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { title, topics } = req.body;
    const course = new Course({ title, topics: topics || [] });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to create course" });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update course" });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete course" });
  }
};

// Add topic
export const addTopic = async (req, res) => {
  try {
    const { name } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const newTopic = { name, files: [] };
    course.topics.push(newTopic);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to add topic" });
  }
};

// Add file
export const addFileToTopic = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const cleanName = path.parse(req.file.originalname).name;

    const fileData = {
      name: cleanName,
      data: `/uploads/${req.file.filename}`,
      type: "file",
    };

    topic.files.push(fileData);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to upload file" });
  }
};

// Add link
export const addLinkToTopic = async (req, res) => {
  try {
    const { url, name } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const linkData = {
      name: name || "External Link",
      data: url,
      type: "link",
    };

    topic.files.push(linkData);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to add link" });
  }
};

// Delete file
export const deleteFileFromTopic = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const topic = course.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    topic.files.splice(req.params.fileIndex, 1);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete file" });
  }
};
