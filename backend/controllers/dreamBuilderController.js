const DreamBuilder = require("../models/DreamBuilder");
const inMemoryDreams = require("../data/dreamBuilders");

// GET all dream setups
const getAllDreams = async (req, res) => {
  try {
    const dreams = await DreamBuilder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Dream workspaces fetched successfully",
      count: dreams.length,
      data: dreams,
    });
  } catch (error) {
    // Fallback to in-memory if DB is momentarily unavailable
    res.status(200).json({
      success: true,
      message: "Dream workspaces fetched (in-memory)",
      count: inMemoryDreams.length,
      data: inMemoryDreams,
    });
  }
};

// CREATE a new dream setup
const createDream = async (req, res) => {
  try {
    const { theme, lighting, deskSize, idea } = req.body;

    if (!theme || !lighting || !deskSize || !idea) {
      return res.status(400).json({
        success: false,
        message: "Theme, lighting, deskSize, and idea are all required",
      });
    }

    let newDream;
    try {
      newDream = await DreamBuilder.create({
        theme,
        lighting,
        deskSize,
        idea,
      });
    } catch (dbErr) {
      // In-memory fallback
      newDream = {
        _id: String(Date.now()),
        theme,
        lighting,
        deskSize,
        idea,
        createdAt: new Date(),
      };
      inMemoryDreams.unshift(newDream);
    }

    res.status(201).json({
      success: true,
      message: "Dream workspace saved successfully",
      data: newDream,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE a dream setup
const deleteDream = async (req, res) => {
  try {
    const deleted = await DreamBuilder.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Dream workspace not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Dream workspace deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllDreams,
  createDream,
  deleteDream,
};