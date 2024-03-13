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
        //  this.onInit();


        this[VIEW].bindInit(this.handleInit);
    }

    [LOAD_MANAGER_OBJECTS](datos) {
        let categories = new Map(), dishes = new Map(), allergens = new Map(), menus = new Map(), restaurants = new Map();

        // recoger los datos del json y meterlos al servidor
        for (const categoria of datos.categories) {
            categories.set(categoria.name, this[MODEL].createCategory(categoria.name, categoria.description))
        }

        for (const allergen of datos.allergens) {
            allergens.set(allergen.name, this[MODEL].createAllergen(allergen.name, allergen.description))
        }

        for (const dish of datos.dishes) {
            dishes.set(dish.name, this[MODEL].createDish(dish.name, dish.description, dish.ingredients, dish.image));

            for (const categ of dish.categories) {
                this[MODEL].assignCategoryToDish(categories.get(categ), dishes.get(dish.name))
            }

            for (const aller of dish.allergens) {
                this[MODEL].assignAllergenToDish(allergens.get(aller), dishes.get(dish.name));
            }
        }

        for (const menu of datos.menus) {

            menus.set(menu.name, this[MODEL].createMenu(menu.name, menu.description));
            for (const dish of menu.dishes) {
                this[MODEL].assignDishToMenu(menus.get(menu.name), dishes.get(dish))
            }
        }

        for (const restaurant of datos.restaurants) {
            restaurants.set(restaurant.name, this[MODEL].createRestaurant(restaurant.name, restaurant.description, restaurant.location));
        }
    }


    onInit = () => { // cada vez que se pulsa el boton de inicio se muestran de nuevo las categorias , 3 platos rand y se reinicia el breadcrumb
        try {
            this[VIEW].showCategories(this[MODEL].categories);
            this[VIEW].showDishes(this.RandDishes());
            this[VIEW].bindCategoryList(this.handleCategoryList);
            this[VIEW].bindShowDish(this.handleShowDish);
            this[VIEW].bindFavouriteDish();
            this[VIEW].modifyBreadcrumb(null);
            this[VIEW].hideForm();
            this[VIEW].hideLogin();
        } catch (error) {
            console.log(error);
        }
    };

    handleInit = () => { // cuando se pulsa inicio se llama a oninit
        this.onInit();
    }

    onLoad = () => { // cargar los objetos
        fetch('js/datos.json')
            .then(response => {
                // Verifica si la solicitud fue exitosa
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                // Parsea la respuesta como JSON y la retorna
                return response.json();
            })
            .then(data => {
                // recoger el json y transformar los objetos
                this[LOAD_MANAGER_OBJECTS](data);
            }).then(() => {
                // una vez se cargan los objetos
                // mostrar el menu de categorias , 3 platos aleatorios y cargar el desplegable con los restaurantes
                try {
                    this[VIEW].showCategories(this[MODEL].categories);
                    this[VIEW].loadRestaurants(this[MODEL].restaurants);
                    // Enlazamos handlers con la vista
                    this[VIEW].bindAllerList(this.handleAllergenList);
                    this[VIEW].bindMenuList(this.handleMenuList);
                    this[VIEW].bindRestaurant(this.handleRestaurants);
                    this[VIEW].bindCloseWindows(this.handleCloseWindows);
                    this.onInit();
                } catch (error) {
                    console.log(error);
                }
            }).then(() => {
                const userCookie = getCookie('activeUser');

                if (userCookie) {
                    const user = this[AUTH].getUser(userCookie);
                    if (user) {
                        this[USER] = user;
                        this.onOpenSession();
                    }
                } else {
                    this.onCloseSession();
                }
            }).catch(error => {
                // Maneja cualquier error que ocurra durante la solicitud
                console.error('Ocurrió un error al cargar el archivo JSON:', error);
            });


        if (getCookie('accetedCookieMessage') !== 'true') {
            this[VIEW].showCookiesMessage();
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
        this[VIEW].bindFavouriteDish();
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
    }

    handleAllergenList = () => {// manejar cuando se pulsa  alergenos en el menu para mostrar un nuevo menu con los alergenos disponibles
        this[VIEW].showAllergens(this[MODEL].allergens);
        this[VIEW].bindAllergen(this.handleAllergenDishes);
        this[VIEW].modifyBreadcrumb(null);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].bindFavouriteDish();
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
    }

    handleAllergenDishes = (allergenName) => { // manejar cuando se pulsa un alergeno del nuevo menu de alergenos generado  y mostrar sus platos
        let allergen = [...this[MODEL].allergens].find(al => al.name === allergenName);
        let dishs = [...this[MODEL].getDishesWithAllergen(allergen)].map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
        this[VIEW].modifyBreadcrumb(allergenName);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].bindFavouriteDish();
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
    }


    handleMenuList = () => { // manejar cuando se pulsa menus en el menu y mostrar un nuevo menu con los menus 
        let menus = [...this[MODEL].menus].map(menu => menu.menu);
        this[VIEW].showMenus(menus);
        this[VIEW].bindMenu(this.handleMenuDishes);
        this[VIEW].modifyBreadcrumb(null);
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
    }


    handleMenuDishes = (menuName) => { // manejar cuando se pulsa un menu para mostrar sus platos
        let menu = [...this[MODEL].menus].find(men => men.menu.name === menuName);
        let dishs = menu.dishes.map(dish => dish.dish);
        this[VIEW].showDishes(dishs);
        this[VIEW].modifyBreadcrumb(menuName);
        this[VIEW].bindShowDish(this.handleShowDish);
        this[VIEW].bindFavouriteDish();
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
    }

    handleRestaurants = (restName) => { // mostrar restaurante pulsado en el menu
        console.log(restName);
        if (restName == "VerTodos") {
            this[VIEW].showAllMaps([...this[MODEL].restaurants]);
        } else {
            let restaurant = [...this[MODEL].restaurants].find(rest => rest.name.replace(/\s/g, '') === restName);
            this[VIEW].showRestaurant(restaurant);
        }
        this[VIEW].modifyBreadcrumb(restName);
        this[VIEW].hideForm();
        this[VIEW].hideLogin();

    }

    handleShowDish = (dishName) => {
        // cuando muestras un plato, asignar enlace al boton nueva ventana
        this[VIEW].bindShowDishInNewWindow(this.handleShowDishInNewWindow);
        this[VIEW].hideForm();
        this[VIEW].hideLogin();
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
        this[VIEW].hideLogin();
        const gestiones = [
            { nombre: "addDish", show: () => this[VIEW].addDishForm(this[MODEL].categories, this[MODEL].allergens), bind: () => this[VIEW].bindNewDishForm(this.handleCreateDish) },
            { nombre: "removeDish", show: () => this[VIEW].removeDishForm(this[MODEL].dishes), bind: () => this[VIEW].bindRemoveDishForm(this.handleRemoveDish) },
            { nombre: "manageMenu", show: () => this[VIEW].manageMenuForm(this[MODEL].menus, this[MODEL].dishes), bind: () => this[VIEW].bindManageMenuForm(this.handlemanageMenu) },
            { nombre: "manageCat", show: () => this[VIEW].manageCatForm(this[MODEL].categories), bind: () => this[VIEW].bindmanageCatForm(this.handleManageCategories) },
            { nombre: "addRest", show: () => this[VIEW].addRestForm(), bind: () => this[VIEW].bindAddRestForm(this.handleCreateRestaurant) },
            { nombre: "modifyCat", show: () => this[VIEW].modifyCatForm(this[MODEL].dishes, this[MODEL].categories), bind: () => this[VIEW].bindCatForm(this.handleModifyCat) },
            { nombre: "genObjects", show: () => this[VIEW].genObjectsForm(), bind: () => this[VIEW].bindGenObjectsForm(this.handleCreateJson) }
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
        this[VIEW].bindLogin(this.handleLogin);
    };

    handleLogin = (username, password, remember) => {
        if (this[AUTH].validateUser(username, password)) {
            this[USER] = this[AUTH].getUser(username);
            if (remember) {
                this[VIEW].setUserCookie(this[USER]);
            } else {
                // controlar que aun que el usuario no este recordado y por tanto no tenga cookie, si pueda tener las funcionalidades de admin
                this[VIEW].setTemporalUser(true);
            }
            this.onOpenSession();
        } else {
            this[VIEW].showInvalidUserMessage();
        }
    };

    onOpenSession = () => {
        this.onInit();
        this[VIEW].initHistory();
        this[VIEW].showAuthUserProfile(this[USER]);
        this[VIEW].bindCloseSession(this.handleCloseSession);
        this[VIEW].showAdminMenu();
        this[VIEW].showViewFavourites();
        this[VIEW].bindShowFavourites(this.handleShowFavourites);
        this[VIEW].bindManagement(this.handleShowForm);
    }

    handleCloseSession = () => {
        this.onCloseSession();
        this.onInit();
        this[VIEW].initHistory();
    };

    onCloseSession() {
        this[USER] = null;
        this[VIEW].deleteUserCookie();
        this[VIEW].showIdentificationLink();
        this[VIEW].bindIdentificationLink(this.handleLoginForm);
        this[VIEW].removeAdminMenu();
        this[VIEW].removeViewFavourites();
        this[VIEW].setTemporalUser(false);
    }

    handleShowFavourites = (favoritos) => {

        if (favoritos) {
            let platosFavoritos = [...this[MODEL].dishes].filter(dish => favoritos.includes(dish.dish.name)).map(dish => dish.dish);
            this[VIEW].showDishes(platosFavoritos);
            this[VIEW].bindFavouriteDish();
            this[VIEW].bindShowDish(this.handleShowDish);
            this[VIEW].headtxtFavoritos();
        } else {
            this[VIEW].showDishes([]);
        }
        this[VIEW].hideForm();
    }

    handleCreateJson = () => {
        let creado = false;
        let ObjsJson;
        try {
            ObjsJson = this.createObjectsJson();
            console.log(ObjsJson);
            //  objects son todos los objetos actuales 
            let formData = new FormData();
            let blob = new Blob([ObjsJson], { type: "application/json" });
            let this1 = this;
            formData.append("jsonBlob", blob);
            fetch("http://localhost/practica9js/crearfichero.php", {
                method: 'post',
                body: formData
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                // llamar a metodo que muestre archivo creado
                console.dir(data);
                creado = true;
                this1[VIEW].showGenObjectsResult(creado);
            }).catch(function (err) {
                console.log('No se ha recibido respuesta.');
                this1[VIEW].showGenObjectsResult(creado);
            });
        } catch (error) {
            console.log(error);
        }
    }

    createObjectsJson = () => {
        let categories = new Map(), dishes = new Map(), allergens = new Map(), menus = new Map(), restaurants = new Map();

        let datos = this[MODEL];
        for (const categoria of datos.categories) {
            categories.set(categoria.name, { "name": categoria.name, "description": categoria.description })
        }


        for (const allergen of datos.allergens) {
            allergens.set(allergen.name, { "name": allergen.name, "description": allergen.description })
        }

        for (const dish of datos.dishes) {
            dishes.set(dish.dish.name, { "name": dish.dish.name, "description": dish.dish.description, "ingredients": dish.dish.ingredients, "image": dish.dish.image, "categories": dish.categories.map(categ => categ.name), "allergens": dish.allergens.map(aller => aller.name) });
        }


        for (const menu of datos.menus) {
            menus.set(menu.menu.name, { "name": menu.menu.name, "description": menu.menu.description, "dishes": menu.dishes.map(dish => dish.dish.name) });
        }


        for (const restaurant of datos.restaurants) {
            restaurants.set(restaurant.name, { "name": restaurant.name, "description": restaurant.description, "location": restaurant.location });
        }

        let combinedObject = {
            categories: [...categories.values()],
            allergens: [...allergens.values()],
            dishes: [...dishes.values()],
            menus: [...menus.values()],
            restaurants: [...restaurants.values()]
        };
        let json = JSON.stringify(combinedObject);

        return json;
    }
}
export default RestaurantController;
