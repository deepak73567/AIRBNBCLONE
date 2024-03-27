//---------------------------------------------------
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc");
const passport = require("passport");


const { saveRedirectUrl, isloggedIn } = require("../middleware.js");

const userController = require("../controllers/user.js");
//------------------------------------------------

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.SignUp));

router
  .route("/login")
  .get(userController.RenderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      // successRedirect: "/listings",
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginForm
  );



// logout
//logout ek function leta h
router.get("/logout", userController.Logout);
module.exports = router;
