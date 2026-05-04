
import express from "express";

const router = express.Router();

// Pages
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password");
});

// Auth actions
router.post("/signup", (req, res) => {
  res.send("Citizen signup route");
});

router.post("/login", (req, res) => {
  res.send("Login route");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;

