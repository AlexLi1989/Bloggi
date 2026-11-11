import passport from "passport";

const ensureAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export default ensureAuth;
