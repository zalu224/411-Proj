import React from 'react';
import FoodTable from './FoodTable';

import "./Template.css";

const Template = () => {
  // Define the food Names and titles for different categories
  const weightGainFoodNames = ['chicken', 'salmon', 'tofu', 'avocado', 'almonds', 'brown rice', 'whole milk', 'carrots', 'corn', 'banana']
  const weightLossFoodNames = ['cucumbers', 'cauliflower', 'spinach', 'oranges', 'apples', 'skinless chicken', 'Greek yogurt', 'chickpeas', 'lentils']

  return (
    <div>
      <FoodTable foodNames={weightGainFoodNames} title="Foods to help weight gain"/>
      <FoodTable foodNames={weightLossFoodNames} title="Foods to help weight loss"/>
    </div>
  )
};

export default Template;