import { Coordinate } from './objetos.js';
const MODEL = Symbol('RestaurantModel');
const VIEW = Symbol('RestaurantView');

class RestaurantController {
    constructor(modelRestaurant, viewRestaurant) {
        this[MODEL] = modelRestaurant;
        this[VIEW] = viewRestaurant;
        // Eventos iniciales del Controlador
        this.onLoad();
        this.onInit();
        // Enlazamos handlers con la vista
        this[VIEW].bindInit(this.handleInit);
        this[VIEW].bindAllerList(this.handleAllergenList);
        this[VIEW].bindMenuList(this.handleMenuList);
        this[VIEW].bindRestaurant(this.handleRestaurants);
    }

    onInit = () => { // cada vez que se pulsa el boton de inicio se muestran de nuevo las categorias , 3 platos rand y se reinicia el breadcrumb
        this[VIEW].showCategories(this[MODEL].categories);
        this[VIEW].showDishes(this.RandDishes());
        this[VIEW].bindCategoryList(this.handleCategoryList);
        this[VIEW].modifyBreadcrumb(null);
    };

    handleInit = () => { // cuando se pulsa inicio se llama a oninit
        this.onInit();
    }

    onLoad = () => { // cargar los objetos

        let cat1 = this[MODEL].createCategory('Carne', 'disfrute de nuestras carnes');
        let dish11 = this[MODEL].createDish('Chuleton Cordero', 'Chuleton de Cordero con patatas cocidas en salsa de tomate ', ['cordero', 'tomate', 'patata cocida'], 'img/Platos/cordero.jpg');
        let dish12 = this[MODEL].createDish('Albondigas', 'Albondigas con tomate y patatas fritas', ['carne cerdo', 'tomate', 'patata frita'], 'img/Platos/albondigas.jpg');
        let dish13 = this[MODEL].createDish('Bistec', 'carne de res con patatas', ['carne de res', 'patatas fritas'], 'img/Platos/bistec.jpg');
        let dish14 = this[MODEL].createDish('CheeseBurguer', 'hamburguesa de vacuno con queso', ['carne de vacuno', 'queso cheddar', 'lechuga', 'bacon', 'pan hamburguesa'], 'img/Platos/cheeseburguer.jpg');

        let cat2 = this[MODEL].createCategory('Pasta', 'la mejor pasta');
        let dish21 = this[MODEL].createDish('Pesto', 'pasta al pesto', ['pasta', 'queso', 'salsa pesto'], 'img/Platos/pesto.jpg');
        let dish22 = this[MODEL].createDish('Bolognesa', 'pasta con carne picada y tomate', ['pasta', 'queso', 'carne de vacuno', 'tomate'], 'img/Platos/bolognesa.jpg');
        let dish23 = this[MODEL].createDish('Carbonara', 'pasta carbonara con nata y bacon', ['pasta', 'queso', 'bacon', 'salsa carbonara'], 'img/Platos/carbonara.jpg');
        let dish24 = this[MODEL].createDish('Tomate Con Bacon', 'pasta con tomate y bacon', ['pasta', 'queso', 'bacon', 'tomate'], 'img/Platos/bacontomate.jpg');

        let cat3 = this[MODEL].createCategory('Postres', 'deleite su paladar');
        let dish31 = this[MODEL].createDish('Coulant de chocolate', 'coulant', ['chocolate', 'harina', 'huevo'], 'img/Platos/coulant.jpg');
        let dish32 = this[MODEL].createDish('Bola de helado', 'bola de helado sabores a elegir', ['leche', 'chocolate', 'vainilla', 'fresa'], 'img/Platos/bolashelado.jpg');
        let dish33 = this[MODEL].createDish('Flan de huevo', 'flan', ['leche', 'huevo'], 'img/Platos/flan.jpg');
        let dish34 = this[MODEL].createDish('Tarta de queso', 'tarta queso', ['queso', 'tarta'], 'img/Platos/tarta.jpg');

        let al1 = this[MODEL].createAllergen('gluten', 'Proteína encontrada en trigo, cebada y centeno.');
        let al2 = this[MODEL].createAllergen('cacahuetes', 'Leguminosa que puede causar alergias graves.');
        let al3 = this[MODEL].createAllergen('lácteos', 'Productos lácteos como leche, queso y mantequilla.');
        let al4 = this[MODEL].createAllergen('huevos', 'Alimento común que puede provocar alergias en algunas personas.');

        let menu1 = this[MODEL].createMenu('menu1', 'hamburguesa,pesto,flan');
        let menu2 = this[MODEL].createMenu('menu2', 'bistec,carbonara,coulant');
        let menu3 = this[MODEL].createMenu('menu3', 'chuleton,bolognesa,tarta');

        let rest1 = this[MODEL].createRestaurant('Restaurante de Madrid', 'Explora la riqueza de la cocina española en nuestro restaurante en el vibrante corazón de Madrid, donde cada plato es una celebración de los sabores y la cultura de España, ubicado en el bullicioso centro de la capital.', new Coordinate(33, 66));
        let rest2 = this[MODEL].createRestaurant('Restaurante de Barcelona', 'Explora la riqueza de la cocina española en nuestro restaurante en el vibrante corazón de Barcelona, donde cada plato es una celebración de los sabores.', new Coordinate(55, 110));
        let rest3 = this[MODEL].createRestaurant('Restaurante de Sevilla', 'Explora la riqueza de la cocina española en nuestro restaurante en el vibrante corazón de Sevilla, donde cada plato es una celebración de los sabores y la cultura de España, ubicado en el bullicioso centro de la capital Andaluza.', new Coordinate(200, 100));


        this[MODEL].assignAllergenToDish(al1, dish14, dish21, dish22, dish23, dish24, dish33);
        this[MODEL].assignAllergenToDish(al2, dish31, dish32, dish33, dish34);
        this[MODEL].assignAllergenToDish(al3, dish31, dish32, dish33, dish34, dish23, dish14);
        this[MODEL].assignAllergenToDish(al4, dish33, dish23);

        this[MODEL].assignCategoryToDish(cat1, dish11, dish12, dish13, dish14)
        this[MODEL].assignCategoryToDish(cat2, dish21, dish22, dish23, dish24)
        this[MODEL].assignCategoryToDish(cat3, dish31, dish32, dish33, dish34)

        this[MODEL].assignDishToMenu(menu1, dish14, dish21, dish33)
        this[MODEL].assignDishToMenu(menu2, dish13, dish23, dish31)
        this[MODEL].assignDishToMenu(menu3, dish11, dish22, dish34)


        // mostrar el menu de categorias , 3 platos aleatorios y cargar el desplegable con los restaurantes
        this[VIEW].showCategories(this[MODEL].categories);
        this[VIEW].showDishes(this.RandDishes());
        this[VIEW].loadRestaurants(this[MODEL].restaurants);
    };

    RandDishes() {   // recoger los objetos dish en un array
        let randDishes = Array();
        let dishes = [...this[MODEL].dishes].map(dish => dish.dish);

        for (let index = 0; index < 3; index++) {
            let rand = Math.floor(Math.random() * dishes.length);
            // si el plato ya existe en el array de aleatorios, no se añade  y se resta uno al indice para seguir teniendo 3 platos
            if (randDishes.find(dish => dish.name === dishes[rand].name) === undefined) {
                randDishes.push(dishes[rand]);
            } else {
                index--;
            }

        }
        return randDishes;
    }

    handleCategoryList = (catName) => { // manejar cuando se pulsa una categoria en el menu y mostrar sus platos
        let category = [...this[MODEL].categories].find(cat => cat.name === catName);
        let dishes = [...this[MODEL].getDishesInCategory(category)].map(dish => dish.dish);
        this[VIEW].showDishes(dishes);
    }

    handleAllergenList = () => {// manejar cuando se pulsa  alergenos en el menu para mostrar un nuevo menu con los alergenos disponibles
        this[VIEW].showAllergens(this[MODEL].allergens);
        this[VIEW].bindAllergen(this.handleAllergenDishes);
        this[VIEW].modifyBreadcrumb(null);
    }

    handleAllergenDishes = (allergenName) => { // manejar cuando se pulsa un alergeno del nuevo menu de alergenos generado  y mostrar sus platos
        let allergen = [...this[MODEL].allergens].find(al => al.name === allergenName);
        let dishs = [...this[MODEL].getDishesWithAllergen(allergen)].map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
    }


    handleMenuList = () => { // manejar cuando se pulsa menus en el menu y mostrar un nuevo menu con los menus 
        let menus = [...this[MODEL].menus].map(menu => menu.menu);
        this[VIEW].showMenus(menus);
        this[VIEW].bindMenu(this.handleMenuDishes);
        this[VIEW].modifyBreadcrumb(null);
    }


    handleMenuDishes = (menuName) => { // manejar cuando se pulsa un menu para mostrar sus platos
        let menu = [...this[MODEL].menus].find(men => men.menu.name === menuName);
        let dishs = menu.dishes.map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
    }

    handleRestaurants = (restName) => { // mostrar restaurante pulsado en el menu
        let restaurant = [...this[MODEL].restaurants].find(rest => rest.name.replace(/\s/g, '') === restName);
        this[VIEW].showRestaurant(restaurant);
    }

}

export default RestaurantController;
