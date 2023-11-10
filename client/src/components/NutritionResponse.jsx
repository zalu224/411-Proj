import PropTypes from "prop-types";

import "./NutritionResponse.css";

const NutritionResponse = ({ response }) => {
  return (
    <div className="response-container">
      <h2 className="response-title">Nutrition Information</h2>
      <div className="response-item-container">
        {response.map((item, index) => (
          <div className="response-item" key={index}>
            <h3 className="response-item-name">{item.name}</h3>
            <h4 className="response-item-serving">{item.serving_size_g}g</h4>
            <div className="response-item-body">
              <div className="response-column">
                <div className="response-column-field">
                  <p>Calories </p>
                  <p className="response-field-value">{item.calories}</p>
                </div>
                <div className="response-column-field">
                  <p>Carbohydrates </p>{" "}
                  <p className="response-field-value">
                    {item.carbohydrates_total_g}g
                  </p>
                </div>
                <div className="response-column-field">
                  <p>Protein </p>
                  <p className="response-field-value">{item.protein_g}g</p>
                </div>
                <div className="response-column-field">
                  <p>Saturated Fat </p>
                  <p>{item.fat_saturated_g}g</p>
                </div>
                <div className="response-column-field">
                  <p>Total Fat </p>
                  <p>{item.fat_total_g}g</p>
                </div>
              </div>
              <div className="response-column">
                <div className="response-column-field">
                  <p>Sugar </p>
                  <p>{item.sugar_g}g</p>
                </div>
                <div className="response-column-field">
                  <p>Cholesterol </p>
                  <p>{item.cholesterol_mg}mg</p>
                </div>
                <div className="response-column-field">
                  <p>Fiber </p>
                  <p>{item.fiber_g}g</p>
                </div>
                <div className="response-column-field">
                  <p>Sodium </p>
                  <p>{item.sodium_mg}mg</p>
                </div>
                <div className="response-column-field">
                  <p>Potassium </p>
                  <p>{item.potassium_mg}mg</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

NutritionResponse.propTypes = {
  response: PropTypes.arrayOf(
    PropTypes.shape({
      sugar_g: PropTypes.number.isRequired,
      fiber_g: PropTypes.number.isRequired,
      serving_size_g: PropTypes.number.isRequired,
      sodium_mg: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      potassium_mg: PropTypes.number.isRequired,
      fat_saturated_g: PropTypes.number.isRequired,
      fat_total_g: PropTypes.number.isRequired,
      calories: PropTypes.number.isRequired,
      cholesterol_mg: PropTypes.number.isRequired,
      protein_g: PropTypes.number.isRequired,
      carbohydrates_total_g: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default NutritionResponse;
