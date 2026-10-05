const Feedback = require("../models/Feedback");

const sampleFeedbacks = [
  {
    name: "Sophia Martinez",
    rating: 5,
    message: "The Developer setup with the dual-screen configuration completely transformed my daily coding productivity! Clean cable management is top notch.",
  },
  {
    name: "Marcus Vance",
    rating: 5,
    message: "Minimal setup is a dream come true. Zero distractions, warm lighting, and a soothing color palette that helps me focus for hours.",
  },
  {
    name: "Elena Rostova",
    rating: 4,
    message: "Loved the Creator workspace aesthetics. Would love to see more standing desk variations, but the overall design inspiration is unmatched.",
  },
];

// Helper to seed sample reviews if empty
const ensureFeedbackSeeded = async () => {
  try {
    const count = await Feedback.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial community feedback...");
      await Feedback.insertMany(sampleFeedbacks);
      console.log("✅ Feedback seeded successfully!");
    }
  } catch (error) {
    console.error("Warning: Could not seed feedback:", error.message);
  }
};

// GET all feedback
const getAllFeedback = async (req, res) => {
  try {
    let feedbacks = await Feedback.find().sort({ createdAt: -1 });

    if (!feedbacks || feedbacks.length === 0) {
      await ensureFeedbackSeeded();
      feedbacks = await Feedback.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE feedback
const createFeedback = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: "Name, message, and rating are required",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const newFeedback = await Feedback.create({
      name: name.trim(),
      message: message.trim(),
      rating: numRating,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE feedback
const updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE feedback
const deleteFeedback = async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  ensureFeedbackSeeded,
};