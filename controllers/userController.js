const User = require("../models/userModel");

module.exports.signup = (socket, data) => {
  const { email, password } = data;
  const user = new User({ email, password });
  user.save((err, newUser) => {
    if (err) {
      socket.emit("signup_error", { message: err.message });
    } else {
      socket.emit("signup_success", { user: newUser });
    }
  });
};

module.exports.login = (socket, data) => {
  const { email, password } = data;
  User.findOne({ email }, (err, user) => {
    if (err) {
      socket.emit("login_error", { message: err.message });
    } else if (!user) {
      socket.emit("login_error", { message: "Invalid email or password" });
    } else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          socket.emit("login_error", { message: err.message });
        } else if (!isMatch) {
          socket.emit("login_error", { message: "Invalid email or password" });
        } else {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
          socket.emit("login_success", { token });
        }
      });
    }
  });
};
