const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../../config');
const User = require('../../models/user.model');

const jwtOptions = {
    secretOrKey: config.jwt.accessSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

passport.use(jwtStrategy);

const auth = () => passport.authenticate('jwt', { session: false });

module.exports = auth;
