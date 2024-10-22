import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user'; // Your User Sequelize model

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'] // You can ask for more fields
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { email } = profile.emails[0];
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create a new user if they don't exist
      const newUser = await User.create({
        email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        facebookId: profile.id // Save Facebook ID to associate with the user
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const { email } = profile.emails[0];
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create a new user if they don't exist
      const newUser = await User.create({
        email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        googleId: profile.id // Save Google ID to associate with the user
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
