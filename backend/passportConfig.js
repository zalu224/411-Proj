const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User"); // Adjust path as needed

// // JWT middleware, verifying token passed from front end
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const condition = { googleId: profile.id };
//         const userData = {
//           googleId: profile.id,
//           searchHistory: [],
//         };
//         const user = await User.findOrCreate(condition, userData);
//         done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user:", id);
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
