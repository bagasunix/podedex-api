// Import Models
const Poke = require("../models/pokeM");
// Lib Validator
const validator = require("fastest-validator");
const v = new validator();
// Lib Error
const catchAsync = require("../utils/catchAsync");
const request = require("request-promise");

const APIFeatures = require("../utils/apiFeature");

const { URL_SERVICE_CLIENT } = process.env;

module.exports = {
  pokeapi: catchAsync(async (req, res) => {
    axios.get(URL_SERVICE_CLIENT + req.query).then(function (response) {
      console.log(response);
    });
  }),
};
