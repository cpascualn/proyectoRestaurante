import { Dish, Category, Allergen, Menu, Restaurant, Coordinate } from '../entities/objetos.js';
import { getCookie } from '../util.js';

const MODEL = Symbol('RestaurantModel');
const VIEW = Symbol('RestaurantView');
const LOAD_MANAGER_OBJECTS = Symbol('Load Manager Objects');
const AUTH = Symbol('AUTH');
const USER = Symbol('USER');

class RestaurantController {
    constructor(modelRestaurant, viewRestaurant, auth) {
        this[MODEL] = modelRestaurant;
        this[VIEW] = viewRestaurant;
        this[AUTH] = auth;
        this[USER] = null;

        // Eventos iniciales del Controlador
        this.onLoad();
        this.onInit();
        // Enlazamos handlers con la vista
        try {
            this[VIEW].bindInit(this.handleInit);
            this[VIEW].bindAllerList(this.handleAllergenList);
            this[VIEW].bindMenuList(this.handleMenuList);
            this[VIEW].bindRestaurant(this.handleRestaurants);
            this[VIEW].bindManagement(this.handleShowForm);
            this[VIEW].bindCloseWindows(this.handleCloseWindows);
        } catch (error) {
            console.log(error);
        }
    }

    [LOAD_MANAGER_OBJECTS]() {

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

    }


    onInit = () => { // cada vez que se pulsa el boton de inicio se muestran de nuevo las categorias , 3 platos rand y se reinicia el breadcrumb
        try {
            this[VIEW].showCategories(this[MODEL].categories);
            this[VIEW].showDishes(this.RandDishes());
            this[VIEW].bindCategoryList(this.handleCategoryList);
            this[VIEW].modifyBreadcrumb(null);
            this[VIEW].bindShowDish(this.handleShowDish);
            this[VIEW].hideForm();
        } catch (error) {

        }
    };

    handleInit = () => { // cuando se pulsa inicio se llama a oninit
        this.onInit();
    }

    onLoad = () => { // cargar los objetos

        if (getCookie('accetedCookieMessage') !== 'true') {
            this[VIEW].showCookiesMessage();
        }

        if (getCookie('activeUser')) {
        } else {
            this[VIEW].showIdentificationLink();
            this[VIEW].bindIdentificationLink(this.handleLoginForm);
        }

        this[LOAD_MANAGER_OBJECTS]();

        // mostrar el menu de categorias , 3 platos aleatorios y cargar el desplegable con los restaurantes
        try {
            this[VIEW].showCategories(this[MODEL].categories);
            this[VIEW].showDishes(this.RandDishes());
            this[VIEW].loadRestaurants(this[MODEL].restaurants);
        } catch (error) {
            console.log(error);
        }
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
        this[VIEW].modifyBreadcrumb(catName);
        this[VIEW].showCategories(this[MODEL].categories);
        this[VIEW].bindCategoryList(this.handleCategoryList);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].hideForm();
    }

    handleAllergenList = () => {// manejar cuando se pulsa  alergenos en el menu para mostrar un nuevo menu con los alergenos disponibles
        this[VIEW].showAllergens(this[MODEL].allergens);
        this[VIEW].bindAllergen(this.handleAllergenDishes);
        this[VIEW].modifyBreadcrumb(null);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].hideForm();
    }

    handleAllergenDishes = (allergenName) => { // manejar cuando se pulsa un alergeno del nuevo menu de alergenos generado  y mostrar sus platos
        let allergen = [...this[MODEL].allergens].find(al => al.name === allergenName);
        let dishs = [...this[MODEL].getDishesWithAllergen(allergen)].map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
        this[VIEW].modifyBreadcrumb(allergenName);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].hideForm();
    }


    handleMenuList = () => { // manejar cuando se pulsa menus en el menu y mostrar un nuevo menu con los menus 
        let menus = [...this[MODEL].menus].map(menu => menu.menu);
        this[VIEW].showMenus(menus);
        this[VIEW].bindMenu(this.handleMenuDishes);
        this[VIEW].modifyBreadcrumb(null);
        this[VIEW].hideForm();
    }


    handleMenuDishes = (menuName) => { // manejar cuando se pulsa un menu para mostrar sus platos
        let menu = [...this[MODEL].menus].find(men => men.menu.name === menuName);
        let dishs = menu.dishes.map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
        this[VIEW].modifyBreadcrumb(menuName);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].hideForm();
    }

    handleRestaurants = (restName) => { // mostrar restaurante pulsado en el menu
        let restaurant = [...this[MODEL].restaurants].find(rest => rest.name.replace(/\s/g, '') === restName);
        this[VIEW].showRestaurant(restaurant);
        this[VIEW].modifyBreadcrumb(restName);
        this[VIEW].hideForm();
    }

    handleShowDish = (dishName) => {
        // cuando muestras un plato, asignar enlace al boton nueva ventana
        this[VIEW].bindShowDishInNewWindow(this.handleShowDishInNewWindow);
        this[VIEW].hideForm();
    }

    handleShowDishInNewWindow = (dishName) => {
        try {
            const dish = [...this[MODEL].dishes].find(d => d.dish.name.replace(/\s/g, '') === dishName);
            // if (dish === undefined) throw new Error();
            this[VIEW].showDishInNewWindow(dish.dish, "no existe");
        } catch (error) {
            this[VIEW].showDishInNewWindow(null, 'No existe este producto en la página.');
        }
    }

    // recibe el nombre del tipo de formulario a mostrar
    handleShowForm = (gestion) => {
        const gestiones = [
            { nombre: "addDish", show: () => this[VIEW].addDishForm(this[MODEL].categories, this[MODEL].allergens), bind: () => this[VIEW].bindNewDishForm(this.handleCreateDish) },
            { nombre: "removeDish", show: () => this[VIEW].removeDishForm(this[MODEL].dishes), bind: () => this[VIEW].bindRemoveDishForm(this.handleRemoveDish) },
            { nombre: "manageMenu", show: () => this[VIEW].manageMenuForm(this[MODEL].menus, this[MODEL].dishes), bind: () => this[VIEW].bindManageMenuForm(this.handlemanageMenu) },
            { nombre: "manageCat", show: () => this[VIEW].manageCatForm(this[MODEL].categories), bind: () => this[VIEW].bindmanageCatForm(this.handleManageCategories) },
            { nombre: "addRest", show: () => this[VIEW].addRestForm(), bind: () => this[VIEW].bindAddRestForm(this.handleCreateRestaurant) },
            { nombre: "modifyCat", show: () => this[VIEW].modifyCatForm(this[MODEL].dishes, this[MODEL].categories), bind: () => this[VIEW].bindCatForm(this.handleModifyCat) }
        ];

        let funcion = gestiones.find(ges => ges.nombre === gestion);


        // recoger la funcion y , si existe , llamarla y despues hacer el bind
        funcion ? funcion.show() : console.log("no existe");
        funcion ? funcion.bind() : console.log("no existe");
    }

    handleCreateDish = (name, description = '', ingredients, image, categories = [], allergens = []) => {
        let done; let error; let dish;
        image = image.replace(/^.*[\\/]/, 'img/Platos/');

        // ingredients = categories.split(',');

        try {
            dish = this[MODEL].createDish(name, description, ingredients, image);

            categories.forEach((nombre) => {
                // intenta crearla, como ya existe devuelve la que existe
                let category = this[MODEL].createCategory(nombre);
                this[MODEL].assignCategoryToDish(category, dish);
            });

            allergens.forEach((nombre) => {
                // intenta crearla, como ya existe devuelve la que existe
                let allergen = this[MODEL].createAllergen(nombre);

                this[MODEL].assignAllergenToDish(allergen, dish);
            });
            done = true;
        } catch (exception) {
            done = false;
            error = exception;
        }

        this[VIEW].showNewDishModal(done, dish, error);
    }

    handleRemoveDish = (names) => {
        let done; let error; let dish; let dishes = [];

        try {
            names.forEach(name => {
                dish = this[MODEL].createDish(name);
                this[MODEL].removeDish(dish);
                dishes.push(dish);
                done = true;

            });
        } catch (exception) {
            done = false;
            error = exception;
            console.log(error);
        }

        this[VIEW].showRemoveDishModal(done, dishes, error);
        // reiniciar el formulario
        this.handleShowForm('removeDish');
    }

    handlemanageMenu = (menuName, platos, accion) => {
        let done; let error; let dishes = []; let menu;
        // dependiendo de la accion , borras, cambias o añades  // desasignarDishMenu  intercambiarDishMenu  asignarDishMenu

        try {
            // recoger objeto menu y dish
            platos.forEach(plato => {
                dishes.push(this[MODEL].createDish(plato));
            });
            menu = this[MODEL].createMenu(menuName);

            if (accion == "asignarDishMenu") {

                this[MODEL].assignDishToMenu(menu, ...dishes);
                done = true;
                this[VIEW].showAddMenuDishModal(done, dishes, menu, error);

            } else if (accion == "desasignarDishMenu") {
                for (const dish of dishes) {
                    this[MODEL].deassignDishToMenu(menu, dish);
                }
                done = true;
                this[VIEW].showRemoveMenuDishModal(done, dishes, menu, error);

            } else if (accion == "intercambiarDishMenu") {
                //  solo puede entrar aqui si hay 2 platos
                this[MODEL].changeDishesPositionsInMenu(menu, dishes[0], dishes[1]);
                done = true;
                this[VIEW].showChangeMenuDishModal(done, dishes, menu, error);
            }
        } catch (exception) {
            done = false;
            error = exception;
            alert(error);
        }

        // reiniciar form
        this.handleShowForm('manageMenu');
    }

    handleManageCategories = (name, action, descrip) => { // si es eliminar name es un array de las categorias a eliminar , si no es el nombre de la que hay que añadir
        let done; let error; let categ; let categories = [];

        try {
            if (action == "addCateg") {
                categ = this[MODEL].createCategory(name, descrip);
                done = true;
                this[VIEW].showAddCategDishModal(done, categ, error);
            } else if (action == "remCateg") {
                name.forEach(nombre => {
                    categ = this[MODEL].createCategory(nombre);
                    categories.push(categ);
                });
                this[MODEL].removeCategory(...categories);
                done = true;
                this[VIEW].showRemoveCategDishModal(done, categories, error);
            }
        } catch (exception) {
            done = false;
            error = exception;
            alert(error);
        }


        this.handleShowForm('manageCat');
    }

    handleCreateRestaurant = (name, descrip, lati, longi) => {
        let done; let restaurant; let error;
        try {
            let location = new Coordinate(lati, longi);
            restaurant = this[MODEL].createRestaurant(name, descrip, location);
            done = true;
        } catch (excepcion) {
            done = false;
            error = excepcion;
        }

        this[VIEW].showRestaurantModal(done, restaurant, error);
        this[VIEW].loadRestaurants(this[MODEL].restaurants);
        this[VIEW].bindRestaurant(this.handleRestaurants);
    }

    handleModifyCat = (plato, categorias, accion) => {
        let done; let error; let dish; let categories = [];
        try {
            dish = this[MODEL].createDish(plato);
            for (const categ of categorias) {
                categories.push(this[MODEL].createCategory(categ));
            }

            if (accion == "asignarDishCategory") {

                for (const categ of categories) {
                    this[MODEL].assignCategoryToDish(categ, dish);
                }
                done = true;
                this[VIEW].showAssignCatDishModal(done, categories, dish, error);
            } else if (accion == "desasignarDishCategory") {
                for (const categ of categories) {
                    this[MODEL].deassignCategoryToDish(categ, dish);
                }
                done = true;
                this[VIEW].showRemCatDishModal(done, categories, dish, error);
            }

        } catch (excepcion) {
            done = false;
            error = excepcion;
        }
        this.handleShowForm('modifyCat');
    }

    handleCloseWindows = () => {
        this[VIEW].closeWindows();
    }

    handleLoginForm = () => {
        this[VIEW].showLogin();
        //this[VIEW].bindLogin(this.handleLogin);
    };

}
export default RestaurantController;
