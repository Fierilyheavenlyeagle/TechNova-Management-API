import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Successful authentication, redirect home with token.
    res.redirect(`http://localhost:3000/auth/success?token=${req.user.token}`);
  },
);
router.get("/success", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  res.json({
    message: "Login with google successful",
    token,
  });
});

export default router;
