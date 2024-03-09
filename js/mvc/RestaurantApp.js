// import { Dish, Category, Allergen, Menu, Restaurant, Coordinate } from './objetos.js';
import { RestaurantsManager } from './RestaurantManagerModel.js';
import RestaurantController from './RestaurantController.js';
import RestaurantView from './RestaurantView.js';
import AuthenticationService from '../authentication/authentication.js';

const RestaurantApp = new RestaurantController(
    RestaurantsManager.getInstance(),
    new RestaurantView(), AuthenticationService.getInstance());

const historyActions = {
    init: () => {
        RestaurantApp.handleInit();
    },
    showCategoryDishes: (state) => {
        RestaurantApp.handleCategoryList(state.category);
    },
    showAllerList: () => {
        RestaurantApp.handleAllergenList();
    },
    showMenuList: () => {
        RestaurantApp.handleMenuList();
    },
    showMenuDishes: (state) => {
        RestaurantApp.handleMenuDishes(state.menu);
    },
    showAllerDishes: (state) => {
        RestaurantApp.handleAllergenDishes(state.allergen);
    },
    showRestaurant: (state) => {
        RestaurantApp.handleRestaurants(state.restaurant);
    },
    showForm: (state) => {
        RestaurantApp.handleShowForm(state.gestion);
    },
    showDish: (state) => {
        RestaurantApp.handleShowDish(state.target);
    },
    showDishInNewWindow: (state) => {
        RestaurantApp.handleShowDishInNewWindow(state.dish);
    },
    closeWindows: () => {
        RestaurantApp.handleCloseWindows();
    },
    login: () => {
        RestaurantApp.handleLoginForm()
    },
    showFavourites: (state) => {
        RestaurantApp.handleShowFavourites(state.favoritos);
    },


};

window.addEventListener('popstate', (event) => {
    if (event.state) {
        historyActions[event.state.action](event.state);
    }
});

history.replaceState({ action: 'init' }, null);

export default RestaurantApp;




