// Import Models
const Poke = require("../models/pokeM");
// Lib Error
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");

const { URL_SERVICE_CLIENT } = process.env;

module.exports = {
  pokeapi: catchAsync(async (req, res) => {
    axios
      .get(
        URL_SERVICE_CLIENT,
        { params: req.query },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .catch((err) => console.log(err))
      .then((res) => console.log(res));
  }),
};
