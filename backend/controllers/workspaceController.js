const Workspace = require("../models/Workspace");
const defaultWorkspaces = require("../data/workspaces");

// Helper to seed workspaces if DB is empty
const ensureWorkspacesSeeded = async () => {
  try {
    const count = await Workspace.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding default workspaces into MongoDB...");
      await Workspace.insertMany(defaultWorkspaces);
      console.log("✅ Workspaces seeded successfully!");
    }
  } catch (error) {
    console.error("Warning: Could not seed workspaces into MongoDB:", error.message);
  }
};

// GET all workspaces
const getAllWorkspaces = async (req, res) => {
  try {
    let workspaces = await Workspace.find().lean();
    if (!workspaces || workspaces.length === 0) {
      await ensureWorkspacesSeeded();
      workspaces = await Workspace.find().lean();
    }

    // Fallback to static data if MongoDB is empty/unreachable
    const result = (workspaces && workspaces.length > 0) ? workspaces : defaultWorkspaces;

    res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    // Graceful fallback to static data
    res.status(200).json({
      success: true,
      message: "Workspaces fetched from fallback data",
      count: defaultWorkspaces.length,
      data: defaultWorkspaces,
    });
  }
};

// GET single workspace by key
const getWorkspaceByKey = async (req, res) => {
  try {
    const workspaceKey = req.params.key.toLowerCase();
    let workspace = await Workspace.findOne({ key: workspaceKey }).lean();

    if (!workspace) {
      workspace = defaultWorkspaces.find((item) => item.key.toLowerCase() === workspaceKey);
    }

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workspace fetched successfully",
      data: workspace,
    });
  } catch (error) {
    const workspace = defaultWorkspaces.find(
      (item) => item.key.toLowerCase() === req.params.key.toLowerCase()
    );

    if (workspace) {
      return res.status(200).json({
        success: true,
        message: "Workspace fetched successfully (fallback)",
        data: workspace,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE a workspace
const createWorkspace = async (req, res) => {
  try {
    const { key, title, description, image, features } = req.body;
    if (!key || !title || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Key, title, description and image are required",
      });
    }

    const newWorkspace = await Workspace.create({
      key,
      title,
      description,
      image,
      features: features || [],
    });

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: newWorkspace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceByKey,
  createWorkspace,
  ensureWorkspacesSeeded,
};