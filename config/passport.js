import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // tu modelo de usuario
import dotenv from "dotenv";

dotenv.config();
//
// Estrategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Obtener email del perfil
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email provided by Google"), null);

        // Buscar o crear usuario
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            password: "google-oauth", // temporal, no se usa
            name: profile.displayName,
          });
        }

        // Generar JWT
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          },
        );

        // Devolver usuario con token
        return done(null, { token, user });
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Serializar/deserializar (aunque session:false, Passport lo requiere)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
