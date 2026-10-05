const express = require("express");
const router = express.Router();

const {
  getAllDreams,
  createDream,
  deleteDream,
} = require("../controllers/dreamBuilderController");

router.get("/", getAllDreams);
router.post("/", createDream);
router.delete("/:id", deleteDream);

module.exports = router;