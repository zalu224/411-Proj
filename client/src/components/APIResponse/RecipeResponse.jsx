import PropTypes from "prop-types";

import "./APIResponse.css";

const RecipeResponse = ({ response }) => {
  return (
    <div className="api-response-container">
      <h2 className="api-response-title">Suggested Recipes</h2>
      <div className="api-response-item-container">
        {response.map((item, index) => (
          <div className="api-response-item" key={index}>
            <h3 className="api-response-item-name">{item.title}</h3>
            <img className="api-response-item-image" src={item.image}></img>
          </div>
        ))}
      </div>
    </div>
  );
};

RecipeResponse.propTypes = {
  response: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      imageType: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecipeResponse;
