const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pokeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
    },
    url: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

pokeSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});
module.exports = mongoose.model("Poke", pokeSchema);
