import PropTypes from "prop-types";

import "./SearchHistory.css";

const SearchHistory = ({ response }) => {
  return (
    <div className="search-history-container">
      {response && response.length > 0 ? (
        response
          .slice()
          .reverse()
          .map((item, index) => (
            <div className="search-history-item" key={index}>
              <p>{item.food}</p>
            </div>
          ))
      ) : (
        <p>No search history available</p>
      )}
    </div>
  );
};

SearchHistory.propTypes = {
  response: PropTypes.arrayOf(
    PropTypes.shape({
      food: PropTypes.string.isRequired,
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
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SearchHistory;
