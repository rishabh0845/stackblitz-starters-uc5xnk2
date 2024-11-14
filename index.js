let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

( async () => {
  db = await open ({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
})();


async function fetchAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants", async (req, res) => {
  let results = await fetchAllRestaurants();
  res.status(200).json(results);
});



async function fetchRestaurantsById(id){
  let query = "SELECT * FROM restaurants WHERE id = ?"
  let response = await db.all(query, [id])
  return { restaurant: response }
}

app.get("/restaurants/details/:id", async (req, res) => {
  let id = req.params.id;
  let results = await fetchRestaurantsById(id);
  res.status(200).json(results);
});



async function fetchByRestaurantsCuisine(cuisine){
  let query = "SELECT * FROM restaurants WHERE cuisine = ?"
  let response = await db.all(query, [cuisine])
  return { restaurants: response }
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  let cuisine = req.params.cuisine;
  let results = await fetchByRestaurantsCuisine(cuisine);
  res.status(200).json(results);
});



async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury){
  let query = "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?"
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury])
  return { restaurants: response }
}

app.get("/restaurants/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  let results = await fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury);
  res.status(200).json(results);
});



async function fetchRestaurantsSortedByRating() {
  const query = "SELECT * FROM restaurants ORDER BY rating DESC";
  const response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let results = await fetchRestaurantsSortedByRating();
  if (results.restaurants.length === 0) {
     return res.status(404).json({ message: "No Restaurants Found"});
  }
  res.status(200).json(results);
 }catch (error) {
return res.status(500).json({ error: error.message });
}
});



async function fetchAllDishes() {
  const query = "SELECT * FROM dishes";
  const response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes", async (req, res) => {
  try {
    let results = await fetchAllDishes();
  if (results.dishes.length === 0) {
     return res.status(404).json({ message: "No Restaurants Found"});
  }
  res.status(200).json(results);
 }catch (error) {
return res.status(500).json({ error: error.message });
}
});



async function fetchDishesById(id) {
  const query = "SELECT * FROM dishes WHERE id = ?";
  const response = await db.all(query, [id]);
  return { dish: response };
}

app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let results = await fetchDishesById(id);
  if (results.dish.length === 0) {
     return res.status(404).json({ message: "No Dishes Found"});
  }
  res.status(200).json(results);
 }catch (error) {
return res.status(500).json({ error: error.message });
}
});



async function fetchDishesByFilter(isVeg){
  let query = "SELECT * FROM dishes WHERE isVeg = ?"
  let response = await db.all(query, [isVeg])
  return { dishes: response }
}

app.get("/dishes/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  let results = await fetchDishesByFilter(isVeg);
  res.status(200).json(results);
});



async function fetchDishesSortedByPrice() {
  const query = "SELECT * FROM dishes ORDER BY price ASC";
  const response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let results = await fetchDishesSortedByPrice();
  if (results.dishes.length === 0) {
     return res.status(404).json({ message: "No Dishes Found"});
  }
  res.status(200).json(results);
 }catch (error) {
return res.status(500).json({ error: error.message });
}
});


app.listen(PORT, () => console.log("Server running on port 3000"));
