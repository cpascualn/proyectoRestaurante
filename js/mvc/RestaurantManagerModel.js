import {
    BaseException, AllergenExistsException, AllergenNotRegisterdException, CategoryExistsException, CategoryNotRegisterdException,
    DishExistsException, DishNotRegisterdException, DishNotRegisterdOnMenuException, MenuExistsException, MenuNotRegisterdException, NotAAllergenException, NotACategoryException,
    NotADishException, NotAMenuException, NotARestaurantException, NullAllergenException, NullCategoryException, NullDishException, NullMenuException, NullRestaurantException,
    RestaurantExistsException, RestaurantNotRegisterdException
} from './exceptions.js';
import { Dish, Category, Allergen, Menu, Restaurant, Coordinate } from './objetos.js';
export { RestaurantsManager };
let RestaurantsManager = (function () { //La función anónima devuelve un método getInstance que permite obtener el objeto único
    let instantiated; //Objeto con la instancia única RestaurantsManager

    function init() { //Inicialización del Singleton

        //Declaración de la clase RestaurantsManager
        class RestaurantsManager {
            #sysName;
            #categories;
            #allergens;
            #dishes;
            #menus;
            #restaurants;

            constructor(sysName, categories = [], allergens = [], dishes = [], menus = [], restaurants = []) {
                this.#sysName = sysName;
                this.#categories = categories;
                this.#allergens = allergens;
                this.#dishes = dishes;
                this.#menus = menus;
                this.#restaurants = restaurants;



                // getter de categories devuelve el iterador
                Object.defineProperty(this, 'categories', {
                    enumerable: true,
                    get() {
                        const array = this.#categories;
                        // devolver el iterador
                        return {
                            // metodo generador,recorre el array de categorias devolviendo cada instancia al iterador
                            *[Symbol.iterator]() {
                                for (const arrayCat of array) {
                                    yield arrayCat;
                                }
                            },
                        };
                    },
                });

                // getter de menus devuelve el iterador
                Object.defineProperty(this, 'menus', {
                    enumerable: true,
                    get() {
                        const array = this.#menus;
                        return {
                            *[Symbol.iterator]() {
                                for (const arrayMenu of array) {
                                    yield arrayMenu;
                                }
                            },
                        };
                    },
                });

                // getter de allergens devuelve el iterador
                Object.defineProperty(this, 'allergens', {
                    enumerable: true,
                    get() {
                        const array = this.#allergens;
                        return {
                            *[Symbol.iterator]() {
                                for (const arrayAl of array) {
                                    yield arrayAl;
                                }
                            },
                        };
                    },
                });

                // getter de restaurants devuelve el iterador
                Object.defineProperty(this, 'restaurants', {
                    enumerable: true,
                    get() {
                        const array = this.#restaurants;
                        return {
                            *[Symbol.iterator]() {
                                for (const arrayRes of array) {
                                    yield arrayRes;
                                }
                            },
                        };
                    },
                });

                // getter de dishes devuelve el iterador
                Object.defineProperty(this, 'dishes', {
                    enumerable: true,
                    get() {
                        const array = this.#dishes;
                        // devolver el iterador
                        return {
                            // metodo generador,recorre el array de platos devolviendo cada instancia al iterador
                            *[Symbol.iterator]() {
                                for (const arrayDish of array) {
                                    yield arrayDish;
                                }
                            },
                        };
                    },
                });

            }

            // recibe 1 o varias categorias,si ha cumplido todas las comprobaciones , por cada una la añade como objeto de la clase Category al array de categorias
            addCategory(...categorys) {
                for (const category of categorys) {
                    if (category === null) throw new NullCategoryException();
                    if (!(category instanceof Category)) throw new NotACategoryException();
                    if (this.#categories.findIndex(c => c.name === category.name) !== -1) throw new CategoryExistsException();

                    this.#categories.push(category);
                }
                return this;
            };

            // borra una categoria , primero comprueba si hay algun plato que la tenga para desasignarsela, despues la borra del array de categorias
            removeCategory(...categorys) {
                for (const category of categorys) {
                    if (this.#categories.findIndex(c => c.name === category.name) === -1) throw new CategoryNotRegisterdException();
                    // buscar todos los dish que tengan esta categoria y desasignarlos
                    this.#dishes.forEach(dish => {
                        let index = dish.categories.findIndex(cat => cat.name === category.name);
                        if (index !== -1) {
                            this.deassignCategoryToDish(dish.categories[index], dish.dish);
                        }
                    });

                    let index = this.#categories.indexOf(category);
                    this.#categories.splice(index, 1);
                }
                return this;
            };

            // añade un menu como objeto literal , el cual contiene el propio objeto menu de su clase, y un array de platos los cuales se añaden como objetos literales
            addMenu(...menus) {
                for (const menu of menus) {
                    if (menu === null) throw new NullMenuException();
                    if (!(menu instanceof Menu)) throw new NotAMenuException();
                    if (this.#menus.findIndex(m => m.menu.name === menu.name) !== -1) throw new MenuExistsException();

                    this.#menus.push({
                        menu,
                        dishes: []
                    });
                }

                return this;
            };

            // busca en el array de objetos literales menus, cual tiene el objeto de la clase menu recibido por parametro, despues lo borra
            removeMenu(...menus) {
                for (const menu of menus) {
                    if (this.#menus.findIndex(m => m.menu.name === menu.name) === -1) throw new MenuNotRegisterdException();

                    let index = this.#menus.findIndex(m => m.menu.name === menu.name);
                    this.#menus.splice(index, 1);
                }
                return this;
            };

            // añade un alergeno como objeto de su clase al array de alergenos
            addAllergen(...allergens) {
                for (const allergen of allergens) {
                    if (allergen === null) throw new NullAllergenException();
                    if (!(allergen instanceof Allergen)) throw new NotAAllergenException();
                    if (this.#allergens.findIndex(a => a.name === allergen.name) !== -1) throw new AllergenExistsException();

                    this.#allergens.push(allergen);
                }
                return this;
            }

            // borra un alergeno , primero busca si hay algun plato con ese alergeno para desasignarselo, despues lo borra del array general de alergenos
            removeAllergen(...allergens) {
                for (const allergen of allergens) {
                    if (this.#allergens.findIndex(a => a.name === allergen.name) === -1) throw new AllergenNotRegisterdException();

                    this.#dishes.forEach(dish => {
                        let index = dish.allergens.findIndex(al => al.name === allergen.name);
                        if (index != -1) {
                            this.deassignAllergenToDish(dish.allergens[index], dish.dish);
                        }
                    });
                    let index = this.#allergens.indexOf(allergen);
                    this.#allergens.splice(index, 1);
                }
                return this;
            };

            // añade el plato como objeto literal en el array de playos el cual asocia , el propio plato como objeto de la clase Dish, con sus categorias y alergenos cada uno en un array
            addDish(...dishs) {
                for (const dish of dishs) {
                    if (dish === null) throw new NullDishException();
                    if (!(dish instanceof Dish)) throw new NotADishException();
                    if (this.#dishes.findIndex(d => d.dish.name === dish.name) !== -1) throw new DishExistsException();
                    this.#dishes.push({
                        dish,
                        categories: [],
                        allergens: []
                    });
                }
                return this;
            }

            // borra el plato, primero busca el el array de menus si hay alguno que lo tenga para desasignarselo, despues lo borra del array de platos
            removeDish(...dishs) {
                // recorrer los menus en los que esta para desasignarlo
                for (const dish of dishs) {
                    if (this.#dishes.findIndex(d => d.dish.name === dish.name) === -1) throw new DishNotRegisterdException();
                    this.#menus.forEach(menu => {
                        let actdish = menu.dishes.findIndex(d => d.dish.name === dish.name);
                        if (actdish !== -1) {
                            this.deassignDishToMenu(menu.menu, menu.dishes[actdish].dish);
                        }
                    });
                    let index = this.#dishes.findIndex(d => d.dish.name === dish.name);
                    this.#dishes.splice(index, 1);
                }
                return this;
            }

            // añade el objeto restaurante al array de restaurantes
            addRestaurant(...restaurants) {
                for (const restaurant of restaurants) {
                    if (restaurant === null) throw new NullRestaurantException();
                    if (!(restaurant instanceof Restaurant)) throw new NotARestaurantException();
                    if (this.#restaurants.findIndex(r => r.name === restaurant.name) !== -1) throw new RestaurantExistsException();
                    this.#restaurants.push(restaurant);
                }
                return this;
            }

            // borra el restaurante del array de restaurantes
            removeRestaurant(...restaurants) {
                for (const restaurant of restaurants) {
                    if (this.#restaurants.findIndex(r => r.name === restaurant.name) === -1) throw new RestaurantNotRegisterdException();

                    let index = this.#restaurants.indexOf(restaurant);
                    this.#restaurants.splice(index, 1);
                }
                return this;
            }

            // recibe una categoria y platos como objetos de la clase
            // comprueba que no exista, y añade la categoria al  array del objeto literal del plato, si el plato o la categoria no existian, los crea
            assignCategoryToDish(category, ...dishs) {
                if (category === null) throw new NullCategoryException();
                for (const dish of dishs) {
                    if (dish === null) throw new NullDishException();
                    // buscar la posicion del objeto literal del dish y 
                    // añadirle la categoria que ya existe en el array categorias
                    let dispos = this.#dishes.findIndex(d => d.dish === dish);
                    if (dispos === -1) {
                        this.addDish(dish);
                        dispos = this.#dishes.findIndex(d => d.dish.name === dish.name);
                    }
                    let cat = this.#categories.indexOf(category);
                    if (cat === -1) {
                        this.addCategory(category);
                        cat = this.#categories.indexOf(category);
                    }
                    // recoge la categoria del array para añadir la ya existente
                    cat = this.#categories[cat];
                    this.#dishes[dispos].categories.push(cat);
                }
                return this;
            }

            // busca si el plato tiene la categoria que se quiere borrar, si la contiene la borra del array del objeto literal plato
            deassignCategoryToDish(category, dish) {
                if (category === null) throw new NullCategoryException();
                if (dish === null) throw new NullDishException();
                let dispos = this.#dishes.findIndex(d => d.dish === dish);
                if (dispos === -1) throw new DishNotRegisterdException();
                let cat = this.#categories.indexOf(category);
                let categorias = this.#dishes[dispos].categories;
                let index = categorias.findIndex((categ) => categ.name === category.name);
                if (cat === -1 || index === -1) throw new CategoryNotRegisterdException;
                categorias.splice(index, 1);
                return this;
            }

            // recibe un alergeno y platos como objetos de la clase
            // comprueba que no exista, y añadeel alergeno al  array del objeto literal del plato, si el plato o el alergeno no existian, los crea
            assignAllergenToDish(allergen, ...dishs) {
                if (allergen === null) throw new NullAllergenException();
                for (const dish of dishs) {
                    if (dish === null) throw new NullDishException();
                    let dispos = this.#dishes.findIndex(d => d.dish === dish);
                    if (dispos === -1) {
                        this.addDish(dish);
                        dispos = this.#dishes.findIndex(d => d.dish === dish);
                    }
                    let al = this.#allergens.indexOf(allergen);
                    if (al === -1) {
                        this.addAllergen(allergen);
                        al = this.#allergens.indexOf(allergen);
                    }
                    al = this.#allergens[al];
                    this.#dishes[dispos].allergens.push(al);
                }
                return this;
            }

            // busca si el plato tiene el alergeno que se quiere borrar, si la contiene la borra del array del objeto literal plato
            deassignAllergenToDish(allergen, dish) {
                if (allergen === null) throw new NullAllergenException();
                if (dish === null) throw new NullDishException();
                let dispos = this.#dishes.findIndex(d => d.dish === dish);
                if (dispos === -1) throw new DishNotRegisterdException();
                let al = this.#allergens.indexOf(allergen);
                let index = this.#dishes[dispos].allergens.indexOf(allergen);
                if (al === -1 || index === -1) throw new AllergenNotRegisterdException();

                this.#dishes[dispos].allergens.splice(index, 1);
                return this;
            }

            // añade al array de platos del objeto literal menu el plato , el cual esta en el array de platos literales
            assignDishToMenu(menu, ...dishs) {
                if (menu === null) throw new NullMenuException();

                for (const dish of dishs) {
                    if (dish === null) throw new NullDishException();
                    let dispos = this.#dishes.findIndex(d => d.dish === dish);
                    if (dispos === -1) {
                        this.addDish(dish);
                        dispos = this.#dishes.findIndex(d => d.dish === dish);
                    }
                    let actDish = this.#dishes[dispos];

                    let menpos = this.#menus.findIndex(m => m.menu.name === menu.name);
                    if (menpos === -1) {
                        this.addMenu(menu);
                        menpos = this.#menus.findIndex(m => m.menu.name === menu.name);
                    }
                    this.#menus[menpos].dishes.push(actDish);
                }
                return this;
            }

            // borra el plato del array de platos del menu
            deassignDishToMenu(menu, dish) {
                if (menu === null) throw new NullMenuException();
                if (dish === null) throw new NullDishException();
                let dispos = this.#dishes.findIndex(d => d.dish.name === dish.name);
                if (dispos === -1) throw new DishNotRegisterdException();

                let menpos = this.#menus.findIndex(m => m.menu.name === menu.name);
                if (menpos === -1) throw new MenuNotRegisterdException();
                let men = this.#menus[menpos];
                let index = men.dishes.findIndex(d => d.dish.name === dish.name);
                if (index === -1) throw new DishNotRegisterdOnMenuException();
                men.dishes.splice(index, 1);

                return this;
            }

            // cambia la posicion de los platos en el array de platos del menu
            changeDishesPositionsInMenu(menu, dish1, dish2) {
                if (menu === null) throw new NullMenuException();
                if (dish1 === null) throw new NullDishException();
                if (dish2 === null) throw new NullDishException();
                if (this.#dishes.findIndex(d => d.dish.name === dish1.name) === -1) throw new DishNotRegisterdException();
                if (this.#dishes.findIndex(d => d.dish.name === dish2.name) === -1) throw new DishNotRegisterdException();
                menu = this.#menus.findIndex(m => m.menu === menu);
                if (menu === -1) throw new MenuNotRegisterdException();
                let dishes = this.#menus[menu].dishes;
                let pos1 = dishes.findIndex(d => d.dish === dish1);
                let pos2 = dishes.findIndex(d => d.dish === dish2);
                if ((pos1 === -1) || (pos2 === -1)) throw new DishNotRegisterdOnMenuException();
                // variable auxiliar para guardar el primer plato 
                let auxdish = dishes[pos1];
                // cambiar la posicion de los platos
                dishes[pos1] = dishes[pos2];
                dishes[pos2] = auxdish;

                return this;
            }
            // recibe categoria y la funcion de ordenacion, si no recibe niguna por defecto la ordena ascendente
            getDishesInCategory(category, ordenacion = ((a, b) => a.dish.name.localeCompare(b.dish.name))) {
                if (category === null) throw new NullCategoryException();
                if (this.#categories.findIndex(c => c.name === category.name) === -1) throw new CategoryNotRegisterdException();
                let platos = [];
                this.#dishes.forEach(dish => {
                    // si el plato tiene la categoria buscada añadir al array de platos con esta categoria
                    if (dish.categories.findIndex(cat => cat.name === category.name) !== -1) {
                        platos.push(dish);
                    }
                });
                // devuelve un iterador con los platos que tengan la categoria buscada
                return {
                    *[Symbol.iterator]() {
                        for (const dishCat of platos) {
                            yield dishCat;
                        }
                    }, // funcion para poder ordenar , usa la funcion de ordenacion recibida
                    ordenar() {
                        // usando la funcion de comparacion ordenara el array
                        platos.sort(ordenacion);
                    },
                };
            }

            // busca los platos que tengan el alergeno buscaod
            getDishesWithAllergen(allergen, ordenacion = ((a, b) => a.dish.name.localeCompare(b.dish.name))) {
                if (allergen === null) throw new NullAllergenException();
                if (this.#allergens.findIndex(a => a.name === allergen.name) === -1) throw new AllergenNotRegisterdException();
                let platos = [];
                this.#dishes.forEach(dish => {
                    // si el plato tiene el alergeno buscada añadir al array de platos con esta categoria
                    if (dish.allergens.findIndex(al => al.name === allergen.name) !== -1) {
                        platos.push(dish);
                    }
                });

                return {
                    *[Symbol.iterator]() {
                        for (const dishCat of platos) {
                            yield dishCat;
                        }
                    }, ordenar() {
                        // usando la funcion de comparacion ordenara el array
                        platos.sort(ordenacion);
                    },
                };
            }

            // encontrar platos con el criterio de busqueda, ejemplo: encontrar platos que tengan 2 o mas alergenos
            findDishes(dish, callback, ordenacion = ((a, b) => a.dish.name.localeCompare(b.dish.name))) {
                if (dish === null) throw new NullDishException();
                if (this.#dishes.findIndex(d => d.dish.name === dish.name) === -1) throw new DishNotRegisterdException();
                // ejemplo de una callback  ( d => d.allergens.length >= 2 )

                let platos = this.#dishes.filter(callback);

                return { // devuelve el iterador de platos con el criterio de busqueda 
                    *[Symbol.iterator]() {
                        for (const dishCat of platos) {
                            yield dishCat;
                        }
                    }, ordenar() {
                        // usando la funcion de comparacion ordenara el array
                        platos.sort(ordenacion);
                    }
                };
            }

            // crea el plato y lo añade al array de platos, comprueba que ya exista, si ya existe no lo crea. devuelve el objeto de la clase plato creado
            createDish(name, description = '', ingredients = [], image) {
                // comprobar si ya existe
                let dispos = this.#dishes.findIndex(d => d.dish.name === name);
                if (dispos === -1) {
                    // si no existe se crea 
                    let dish = new Dish(name, description, ingredients, image);
                    this.addDish(dish);
                    dispos = this.#dishes.findIndex(d => d.dish.name === dish.name);
                }
                return this.#dishes[dispos].dish;
            }

            // crea el menu , si ya existe no lo crea , devuelve el objeto de la clase menu
            createMenu(name = '', description = '') {
                let menpos = this.#menus.findIndex(m => m.menu === name);
                if (menpos === -1) {
                    let menu = new Menu(name, description);
                    this.addMenu(menu);
                    menpos = this.#menus.findIndex(m => m.menu.name === name);
                }

                return this.#menus[menpos].menu;
            }
            // crea el alergeno y lo añade al array de alergenos, comprueba que ya exista, si ya existe no lo crea. devuelve el alergeno creado
            createAllergen(name = '', description = '') {
                let alpos = this.#allergens.findIndex(al => al.name === name);
                if (alpos === -1) {
                    let allergen = new Allergen(name, description);
                    this.addAllergen(allergen);
                    alpos = this.#allergens.findIndex(al => al.name === name);
                }
                return this.#allergens[alpos];
            }
            // crea la categoria y la devuelve
            createCategory(name = '', description = '') {
                let catpos = this.#categories.findIndex(cat => cat.name === name);
                if (catpos === -1) {
                    let category = new Category(name, description);
                    this.addCategory(category);
                    catpos = this.#categories.findIndex(cat => cat.name === name);
                }
                return this.#categories[catpos];
            }
            // crea el restaurante y lo devuelve
            createRestaurant(name = '', description = '', location) {
                let respos = this.#restaurants.findIndex(res => res.name === name)

                if (respos === -1) {
                    let restaurant = new Restaurant(name, description, location);
                    this.addRestaurant(restaurant);
                    respos = this.#restaurants.findIndex(res => res.name === name)
                }
                return this.#restaurants[respos];
            }

        }
        let instance = new RestaurantsManager();//Devolvemos el objeto RestaurantsManager para que sea una instancia única.
        // Object.freeze(instance);
        return instance;
    } //Fin inicialización del Singleton
    return {
        // Devuelve un objeto con el método getInstance
        getInstance: function () {
            if (!instantiated) { //Si la variable instantiated es undefined, priemera ejecución, ejecuta init.
                instantiated = init(); //instantiated contiene el objeto único
            }
            return instantiated; //Si ya está asignado devuelve la asignación.
        }
    };
})();
