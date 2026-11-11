import passport from "passport";

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next();
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export default optionalAuth;
