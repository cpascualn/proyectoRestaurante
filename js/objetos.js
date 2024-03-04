export { Dish, Category, Allergen, Menu, Restaurant, Coordinate };
class Dish {
    #name;
    #description;
    #ingredients;
    #image;
    constructor(name = '', description = '', ingredients = [], image) {
        this.#name = name;
        this.#description = description;
        this.#ingredients = ingredients;
        this.#image = image;
    }

    get name() { return this.#name; }
    get description() { return this.#description; }
    get ingredients() { return this.#ingredients; }
    get image() { return this.#image; }

    set name(name) { this.#name = name; }
    set description(description) { this.#description = description; }
    set ingredients(ingredients) { this.#ingredients = ingredients; }
    set image(image) { this.#image = image; }

    toString() {
        return `Dish { 
            name: ${this.#name}, 
            description: ${this.#description}, 
            ingredients: [${this.#ingredients.join(', ')}], 
            image: ${this.#image} 
          }`;
    }
}

class Category {
    #name;
    #description;

    constructor(name = '', description = '') {
        this.#name = name;
        this.#description = description;
    }

    get name() { return this.#name; }
    get description() { return this.#description; }

    set name(name) { this.#name = name; }
    set description(description) { this.#description = description; }

    toString() {
        return `Category { 
            name: ${this.#name}, 
            description: ${this.#description}
          }`;
    }
}


class Allergen {
    #name;
    #description;

    constructor(name = '', description = '') {
        this.#name = name;
        this.#description = description;
    }

    get name() { return this.#name; }
    get description() { return this.#description; }

    set name(name) { this.#name = name; }
    set description(description) { this.#description = description; }

    toString() {
        return `Allergen { 
            name: ${this.#name}, 
            description: ${this.#description} 
          }`;
    }
}


class Menu {
    #name;
    #description;

    constructor(name = '', description = '') {
        this.#name = name;
        this.#description = description;
    }

    get name() { return this.#name; }
    get description() { return this.#description; }

    set name(name) { this.#name = name; }
    set description(description) { this.#description = description; }

    toString() {
        return `Menu { 
            name: ${this.#name}, 
            description: ${this.#description}
          }`;
    }
}

class Restaurant {
    #name;
    #description;
    #location;

    constructor(name = '', description = '', location) {
        this.#name = name;
        this.#description = description;
        this.#location = location;
    }

    get name() { return this.#name; }
    get description() { return this.#description; }
    get location() { return this.#location; }

    set name(name) { this.#name = name; }
    set description(description) { this.#description = description; }
    set location(location) { this.#location = location; }

    toString() {
        return `Restaurant { 
            name: ${this.#name}, 
            description: ${this.#description}, 
            location: ${this.#location}
          }`;
    }
}

class Coordinate {
    #latitude; #longitude;
    constructor(latitude = 0, longitude = 0) {
        this.#latitude = latitude;
        this.#longitude = longitude;
    }

    get latitude() { return this.#latitude; }
    get longitude() { return this.#longitude };

    set latitude(latitude) { this.#latitude = latitude; }
    set longitude(longitude) { this.#longitude = longitude; }

    toString() {
        return `Coordinate { 
            latitude: ${this.#latitude}, 
            longitude: ${this.#longitude}
          }`;
    }
}

