// import { Dish, Category, Allergen, Menu, Restaurant, Coordinate } from './objetos.js';
import { RestaurantsManager } from './RestaurantManagerModel.js';
import RestaurantController from './RestaurantController.js';
import RestaurantView from './RestaurantView.js';

const RestaurantApp = new RestaurantController(
    RestaurantsManager.getInstance(),
    new RestaurantView());


export default RestaurantApp;