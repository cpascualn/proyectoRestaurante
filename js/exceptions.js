//Excepción base para ir creando el resto de excepciones.
class BaseException extends Error {
  constructor(message = "", fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "BaseException";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseException)
    }
  }
}



// Excepción acceso inválido a constructor
class InvalidAccessConstructorException extends BaseException {
  constructor(fileName, lineNumber) {
    super('Constructor can’t be called as a function.', fileName, lineNumber);
    this.name = 'InvalidAccessConstructorException';
  }
}

// Excepción personalizada para indicar valores vacios.
class EmptyValueException extends BaseException {
  constructor(param, fileName, lineNumber) {
    super(`Error: The parameter ${param} can't be empty.`, fileName, lineNumber);
    this.param = param;
    this.name = 'EmptyValueException';
  }
}

// Excepción de valor inválido
class InvalidValueException extends BaseException {
  constructor(param, value, fileName, lineNumber) {
    super(`Error: The paramenter ${param} has an invalid value. (${param}: ${value})`, fileName, lineNumber);
    this.param = param;
    this.name = 'EmptyValueException';
  }
}

// Excepción personalizada para clases abstractas.
class AbstractClassException extends BaseException {
  constructor(className, fileName, lineNumber) {
    super(`Error: The class  ${className} is abstract.`, fileName, lineNumber);
    this.className = className;
    this.name = 'AbstractClassException';
  }
}

// categoria
class NullCategoryException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: la categoria no puede ser null.", fileName, lineNumber);
    this.name = "NullCategoryException";
  }
}

class CategoryExistsException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: la categoria ya existe", fileName, lineNumber);
    this.name = "CategoryExistsException";
  }
}

class NotACategoryException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el objeto no es una categoria", fileName, lineNumber);
    this.name = "NotACategoryException";
  }
}

class CategoryNotRegisterdException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: La categoría no esta registrada.", fileName, lineNumber);
    this.name = "CategoryNotRegisterdException";
  }
}

//menu
class NullMenuException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error:el menu no puede ser null.", fileName, lineNumber);
    this.name = "NullMenuException";
  }
}

class MenuExistsException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el menu ya existe", fileName, lineNumber);
    this.name = "MenuExistsException";
  }
}

class NotAMenuException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el objeto no es un menu", fileName, lineNumber);
    this.name = "NotAMenuException";
  }
}

class MenuNotRegisterdException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el menu no esta registrada.", fileName, lineNumber);
    this.name = "MenuNotRegisterdException";
  }
}

//alergenos

class NullAllergenException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error:el Allergen no puede ser null.", fileName, lineNumber);
    this.name = "NullAllergenException";
  }
}

class AllergenExistsException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Allergen ya existe", fileName, lineNumber);
    this.name = "AllergenExistsException";
  }
}

class NotAAllergenException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el objeto no es un Allergen", fileName, lineNumber);
    this.name = "NotAAllergenException";
  }
}

class AllergenNotRegisterdException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Allergen no esta registrada.", fileName, lineNumber);
    this.name = "AllergenNotRegisterdException";
  }
}

//platos
class NullDishException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error:el Dish no puede ser null.", fileName, lineNumber);
    this.name = "NullDishException";
  }
}

class DishExistsException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Dish ya existe", fileName, lineNumber);
    this.name = "DishExistsException";
  }
}

class NotADishException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el objeto no es un Dish", fileName, lineNumber);
    this.name = "NotADishException";
  }
}

class DishNotRegisterdException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Dish no esta registrada.", fileName, lineNumber);
    this.name = "DishNotRegisterdException";
  }
}
class DishNotRegisterdOnMenuException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Dish no esta registrado en el menu.", fileName, lineNumber);
    this.name = "DishNotRegisterdOnMenuException";
  }
}

// restaurant
class NullRestaurantException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error:el Restaurant no puede ser null.", fileName, lineNumber);
    this.name = "NullRestaurantException";
  }
}

class RestaurantExistsException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Restaurant ya existe", fileName, lineNumber);
    this.name = "RestaurantExistsException";
  }
}

class NotARestaurantException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el objeto no es un Restaurant", fileName, lineNumber);
    this.name = "NotARestaurantException";
  }
}

class RestaurantNotRegisterdException extends BaseException {
  constructor(fileName, lineNumber) {
    super("Error: el Restaurant no esta registrada.", fileName, lineNumber);
    this.name = "RestaurantNotRegisterdException";
  }
}



export {
  BaseException, AllergenExistsException, AllergenNotRegisterdException, CategoryExistsException, CategoryNotRegisterdException,
  DishExistsException, DishNotRegisterdException, DishNotRegisterdOnMenuException, MenuExistsException, MenuNotRegisterdException, NotAAllergenException, NotACategoryException,
  NotADishException, NotAMenuException, NotARestaurantException, NullAllergenException, NullCategoryException, NullDishException, NullMenuException, NullRestaurantException,
  RestaurantExistsException, RestaurantNotRegisterdException, InvalidAccessConstructorException,
  EmptyValueException,
  InvalidValueException,
  AbstractClassException
};