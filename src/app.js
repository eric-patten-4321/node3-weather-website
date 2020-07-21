const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { ESRCH } = require("constants");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views locations
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Eric P",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Eric P",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    helpMsg:
      "If stuff's all jacked, try reloading the page. If that doesn't work, email the admin at fhoff@hastala.com",
    name: "Eric P",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    message404: "Help article not found",
    name: "Eric P",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    message404: "Awwww snap. No such page here.",
    name: "Eric P",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});