const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const app = express();

mongoose.connect(
  "mongodb://sajid:test123@ds143594.mlab.com:43594/gql-playlist"
);

mongoose.connection.once("open", () => {
  console.log("connected to database");
});

app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["thenetninjaisawesomenodoubt"]
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

//setup auth routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("Now listening for requests on port 4000");
});
