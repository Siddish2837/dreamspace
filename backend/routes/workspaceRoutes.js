const express = require("express");
const router = express.Router();

const {
  getAllWorkspaces,
  getWorkspaceByKey,
  createWorkspace,
} = require("../controllers/workspaceController");

router.get("/", getAllWorkspaces);
router.post("/", createWorkspace);
router.get("/:key", getWorkspaceByKey);

module.exports = router;
