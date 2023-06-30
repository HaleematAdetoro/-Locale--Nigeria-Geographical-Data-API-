const passport = require('passport');
const UserModel = require('../models/usermodel')
require('dotenv').config();
const mongoose = require('mongoose')

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_Secret || 'something_secret',
            // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
            
        },
        async (payload, done) => {
          const user = await UserModel.findOne({
            _id: payload.id
          })
          if (user) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        }
    )
)