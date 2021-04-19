// Import Models
const Poke = require("../models/pokeM");
// Lib Error
const catchAsync = require("../utils/catchAsync");

const { URL_SERVICE_CLIENT } = process.env;

module.exports = {
  pokeapi: catchAsync(async (req, res) => {
    axios.get(URL_SERVICE_CLIENT + req.query).then(function (response) {
      console.log(response);
    });
  }),
};
