const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=fa6fefb230eb3cd9322a9c8be2629faf&units=f&query=" +
    +longitude +
    "," +
    latitude;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services", undefined);
    } else if (body.error) {
      callback("Unable to find location, try another search", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ", feels like " +
          body.current.feelslike +
          " with an actual temperature of " +
          body.current.temperature +
          ". The humidity is " +
          body.current.humidity +
          "%."
      );
    }
  });
};

module.exports = forecast;
