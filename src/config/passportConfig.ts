import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user'; // Your User Sequelize model

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        // Type guard for profile.emails
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found for this user.'), null);
        }

        const email = profile.emails[0].value; // Use the value property
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create a new user if they don't exist
        const newUser = await User.create({
          email,
          firstName: profile.name?.givenName, // Optional chaining
          lastName: profile.name?.familyName, // Optional chaining
          facebookId: profile.id, // Save Facebook ID to associate with the user
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (token: string, tokenSecret: string, profile: any, done: any) => {
      try {
        // Type guard for profile.emails
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found for this user.'));
        }

        const email = profile.emails[0].value; // Use the value property
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create a new user if they don't exist
        const newUser = await User.create({
          email,
          firstName: profile.name?.givenName, // Optional chaining
          lastName: profile.name?.familyName, // Optional chaining
          googleId: profile.id, // Save Google ID to associate with the user
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
