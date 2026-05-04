
import express from "express";

const router = express.Router();

// classify complaint
router.post("/classify", (req, res) => {
  res.send("AI complaint classification route");
});

// translate text
router.post("/translate", (req, res) => {
  res.send("Translation route");
});

// detect priority
router.post("/priority", (req, res) => {
  res.send("Priority detection route");
});

export default router;

