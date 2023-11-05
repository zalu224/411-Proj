import { useEffect, useState} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const FoodTable = ({ foodNames, title }) => {
  const [foodData, setFoodData] = useState([]);

  const apiKey = import.meta.env.VITE_CALORIENINJAS_APIKEY

useEffect(() => {
  // Initialize an array to store food data
  const foodItems = [];

  foodNames.forEach((foodName) => {
    axios({
      method: 'get',
      url: 'https://api.calorieninjas.com/v1/nutrition',
      headers: {
        'X-Api-Key': apiKey,
      },
      params: {
        query: foodName,
      },
    })
      .then((response) => {
        const foodItemData = response.data;
        foodItems.push(foodItemData);

        if (foodItems.length === foodNames.length) {
          setFoodData(foodItems);
          console.log('All data has been fetched:', foodItems);
          //console.log('This is foodItems[0].items[0].name',foodItems[0].items[0].name)
        }
      })
      .catch((error) => {
        console.error(`Error fetching data for ${foodName}:`, error);
      });
  });
  // ...
}, [foodNames, apiKey]);


return (
  <div>
    <h2>{title}</h2>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Protein(g)</TableCell>
            <TableCell align="right">Total Fat(g)</TableCell>
            <TableCell align="right">Saturated Fat(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodData.map((food, index) => (
            <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell component="th" scope="row">{food.items[0].name}</TableCell>
              <TableCell align="right">{food.items[0].calories}</TableCell>
              <TableCell align="right">{food.items[0].protein_g}</TableCell>
              <TableCell align="right">{food.items[0].fat_total_g}</TableCell>
              <TableCell align="right">{food.items[0].fat_saturated_g}</TableCell>
            </TableRow>

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
}

FoodTable.propTypes = {
  foodNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
}

export default FoodTable