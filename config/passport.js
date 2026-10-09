import passport from "passport";

// Google OAuth desactivado.
// Se conserva Passport para mantener
// la compatibilidad con server.js.

// Serialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialización de usuarios
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
