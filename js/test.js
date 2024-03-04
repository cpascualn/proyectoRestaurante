import { Dish, Category, Allergen, Menu, Restaurant, Coordinate } from './objetos.js';
import { RestaurantsManager } from './RestaurantManager.js';

let manager = RestaurantsManager.getInstance();

function testGetters() {

    console.log("----getter de dishes----");
    let dishes = manager.dishes;
    for (const dish of dishes) {
        console.log(JSON.stringify(dish));
    }

    console.log("----getter de categories----");
    let categs = manager.categories;
    for (const cat of categs) {
        console.log(cat.toString());
    }

    console.log("----getter de menus----");
    let menus = manager.menus;
    for (const menu of menus) {
        console.log(JSON.stringify(menu));
    }

    console.log("----getter de alergenos----");
    let allergens = manager.allergens;
    for (const allergen of allergens) {
        console.log(allergen.toString());
    }

    console.log("----getter de restaurantes----");
    let restaurants = manager.restaurants;
    for (const restaurant of restaurants) {
        console.log(restaurant.toString());
    }
}

function testCreateRemove() {

    console.log("---- EL PROPIO METODO CREATE TAMBIEN LLAMA A LA FUNCION ADD DE CADA OBJETO---- ");
    console.log("----Añadir 3 Platos----");
    let dish = manager.createDish('bplato1', 'descrip', ['ing1', 'ing2'], 'image');
    let dish2 = manager.createDish('aplato2', 'descripcion2', ['ing1', 'ing2'], 'image');
    let dish3 = manager.createDish('plato3', 'des3', ['ing1', 'ing2'], 'image');

    console.log("----Añadir 3 Menus----");
    let menu1 = manager.createMenu('menu1', 'descrip');
    let menu2 = manager.createMenu('menu2', 'descrip2');
    let menu3 = manager.createMenu('menu3', 'descrip3');

    console.log("----Añadir 3 Alergenos----");
    let allergen1 = manager.createAllergen('allergen1', 'descrip');
    let allergen2 = manager.createAllergen('allergen2', 'descrip2');
    let allergen3 = manager.createAllergen('allergen3', 'descrip3');

    console.log("----Añadir 3 Categorias----");
    let categ1 = manager.createCategory('category1', 'descrip');
    let categ2 = manager.createCategory('category2', 'descrip2');
    let categ3 = manager.createCategory('category3', 'descrip3');

    console.log("----Añadir 3 Restaurantes----");
    let rest1 = manager.createRestaurant('restaurant1', 'descrip', new Coordinate(33, 66));
    let rest2 = manager.createRestaurant('restaurant2', 'descrip2', new Coordinate(55, 110));
    let rest3 = manager.createRestaurant('restaurant3', 'descrip3', new Coordinate(200, 100));

    console.log("---- GETTERS PARA VER LOS OBJETOS AÑADIDOS ----");
    testGetters();

    console.log("---- PRUEBA DE BORRADO ----");
    manager.removeDish(dish3);
    manager.removeMenu(menu3);
    manager.removeAllergen(allergen3);
    manager.removeCategory(categ3);
    manager.removeRestaurant(rest2, rest3);

    console.log("---- GETTERS PARA VER QUE OBJETOS SE HAN BORRADOS ----");
    testGetters();

    console.log("---- PRUEBA DE ASIGNACIONES ----");
    console.log("asignar la categoria 1 a los 2 platos y la categoria 2 solo al plato 2");
    manager.assignCategoryToDish(categ1, dish, dish2).assignCategoryToDish(categ2, dish2);

    console.log("asignar el alergeno 2 a los 2 platos y el alergeno1 solo al plato 1");
    manager.assignAllergenToDish(allergen2, dish, dish2).assignAllergenToDish(allergen1, dish);

    console.log("asignar 2 platos al menu 1 y el plato 2 al menu 2");
    manager.assignDishToMenu(menu1, dish, dish2).assignDishToMenu(menu2, dish2);

    console.log("---- GETTERS PARA VER LAS ASOCIACIONES ----");
    console.log("---- getter de menus en el que se ven los platos añadidos, y cada plato con sus categorias y alergenos ----");
    let menus = manager.menus;
    for (const menu of menus) {
        console.log(menu);
    }

    console.log("--- CAMBIAR DE POSICION LOS PLATOS EN EL MENU 1");
    manager.changeDishesPositionsInMenu(menu1, dish, dish2);
    console.log("---- getter de menus para ver los cambios ----");
    for (const menu of menus) {
        console.log(menu);
    }

    console.log("---- DESASGINACIONES ---- ");
    console.log("quitar categoria 2 al plato 2");
    manager.deassignCategoryToDish(categ2, dish2);
    console.log("quitar alergeno2 al plato 1");
    manager.deassignAllergenToDish(allergen2, dish);
    console.log("---- getter de menus para ver los cambios ----");

    for (const menu of menus) {
        console.log(menu);
    }

    console.log("borrar el plato 2 para ver que tambien se desasigna del menu");
    manager.removeDish(dish2);
    for (const menu of menus) {
        console.log(menu);
    }

    console.log("----GET DISHES----");
    console.log("get platos con la categoria1");
    manager.assignCategoryToDish(categ1, dish2);
    let platos = manager.getDishesInCategory(categ1);
    console.log("mostar  sin ordenar");
    for (const plato of platos) {
        console.log(plato);
    }
    console.log("mostar   ordenado");
    platos.ordenar(); // ordenar por nombre
    for (const plato of platos) {
        console.log(plato);
    }

    console.log("get platos con el alergeno1");
    platos = manager.getDishesWithAllergen(allergen1);
    for (const plato of platos) {
        console.log(plato);
    }
    manager.assignAllergenToDish(allergen2, dish);
    console.log("findDishes con 2 o mas alergenos");
    platos = manager.findDishes(dish, (d => d.allergens.length >= 2));
    // lamando al metodo ordenar ,ordena el array
    platos.ordenar();
    for (const plato of platos) {
        console.log(plato);
    }

}


function testExceptions() {
    console.log("EXCEPCIONES");
    try {
        manager.addCategory(null);
    } catch (error) {
        console.error(error);
    }

    try {
        manager.addCategory('objeto');
    } catch (error) {
        console.error(error);
    }

    try {
        manager.addCategory(new Category('category1', 'descrip'));
    } catch (error) {
        console.error(error);
    }
    try {
        manager.removeCategory(new Category('categor', 'descrip'));
    } catch (error) {
        console.error(error);
    }

    try {
        let men;
        let dis;
        for (const menu of manager.menus) {
            if (menu.menu.name === 'menu2') men = menu.menu;
        }
        for (const dish of manager.dishes) {
            if (dish.dish.name === "bplato1") dis = dish.dish;
        }
        manager.changeDishesPositionsInMenu(men, dis, dis);
    } catch (error) {
        console.error(error);
    }

    try {
        manager.addAllergen(null);
    } catch (error) {
        console.error(error);
    }

    try {
        manager.addDish(null);
    } catch (error) {
        console.error(error);
    }

    try {
        manager.addMenu(null);
    } catch (error) {
        console.error(error);
    }
}

function test() {

    testCreateRemove();
    console.log(manager);
    testExceptions();

}

test();