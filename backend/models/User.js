const mongoose = require("mongoose");

const nutritionInfoSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  serving_size_g: Number,
  fat_total_g: Number,
  fat_saturated_g: Number,
  protein_g: Number,
  sodium_mg: Number,
  potassium_mg: Number,
  cholesterol_mg: Number,
  carbohydrates_total_g: Number,
  fiber_g: Number,
  sugar_g: Number,
});

const responseSchema = new mongoose.Schema({
  items: [nutritionInfoSchema],
});


const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  searchHistory: [
    {
      food: String,
      response: responseSchema,
    },
  ],
});

const User = mongoose.model("User", userSchema);


// Implement the findOrCreate function
User.findOrCreate = async function (condition, userData) {
  let user = await User.findOne(condition);

  if (!user) {
    user = new User(userData);
    await user.save();
  }

  return user;
};


module.exports = User;
