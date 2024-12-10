// server/config/passport.js
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../database/db');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
  // User authentication strategy
  passport.use(
    'user-strategy',
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.get('SELECT * FROM users WHERE id = ?', [jwt_payload.id], (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  // Admin authentication strategy
  passport.use(
    'admin-strategy',
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload.role && jwt_payload.role === 'admin') {
        return done(null, jwt_payload);
      } else {
        return done(null, false);
      }
    })
  );
};