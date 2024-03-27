const { isloggedIn } = require("../middleware.js");
const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.SignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      //callback bhi aata h
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";

        res.redirect(redirectUrl);
      }
    });
  } catch (e) {
    req.flash("error", e.message);

    res.redirect("/signup");
  }
};

module.exports.RenderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginForm = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out now!");
    res.redirect("/listings");
  });
};
