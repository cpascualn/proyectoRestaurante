function showFeedBack(input, valid, message) {
    const validClass = (valid) ? 'is-valid' : 'is-invalid';
    const messageDiv = (valid) ? input.parentElement.querySelector('div.valid-feedback') : input.parentElement.querySelector('div.invalid-feedback');
    for (const div of input.parentElement.getElementsByTagName('div')) {
        div.classList.remove('d-block');
    }
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('d-block');
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
    input.classList.add(validClass);
    if (message) {
        messageDiv.innerHTML = message;
    }
}

function defaultCheckElement(event) {
    this.value = this.value.trim();
    if (!this.checkValidity()) {
        showFeedBack(this, false);
    } else {
        showFeedBack(this, true);
    }
}

function newDishValidation(handler) {

    let form = document.forms.fAddDish;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        this.nombre.value = this.nombre.value.trim();
        if (!this.nombre.checkValidity()) {
            isValid = false;
            showFeedBack(this.nombre, false);
            firstInvalidElement = this.descripcion;
        } else {
            showFeedBack(this.nombre, true);
        }


        if (!this.descripcion.checkValidity()) {
            isValid = false;
            showFeedBack(this.descripcion, false);
            firstInvalidElement = this.descripcion;
        } else {
            showFeedBack(this.descripcion, true);
        }

        if (!this.ingredientes.checkValidity()) {
            isValid = false;
            showFeedBack(this.ingredientes, false);
            firstInvalidElement = this.ingredientes;
        } else {
            showFeedBack(this.ingredientes, true);
        }

        if (!this.imagen.checkValidity()) {
            isValid = false;
            showFeedBack(this.imagen, false);
            firstInvalidElement = this.imagen;
        } else {
            showFeedBack(this.imagen, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            let categorias = Array.from(this.categorias.selectedOptions).map(option => option.value);
            let alergenos = Array.from(this.alergenos.selectedOptions).map(option => option.value);
            handler(this.nombre.value, this.descripcion.value, this.ingredientes.value, this.imagen.value, categorias, alergenos);
        }
        event.stopPropagation();
        event.preventDefault();

    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        this.nombre.focus();
    }));

    form.nombre.addEventListener('change', defaultCheckElement);
    form.ingredientes.addEventListener('change', defaultCheckElement);
}

function removeDishValidation(handler) {

    let form = document.forms.fRemDish;

    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        try {

            if (this.platos.selectedIndex < 0) {
                event.preventDefault();
                throw new Error('selecciona al menos una opción');
            }

            let platos = Array.from(this.platos.selectedOptions).map(option => option.value);
            handler(platos);

            event.stopPropagation();
            event.preventDefault();
        } catch (error) {
            alert(error);
        }
    });

}


function manageMenuValidation(handler) {
    let form = document.forms.fManMenu;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let menu = form.menus.value;
        let platos;
        let accion = event.submitter.id
        // si la accion es desasignar o intercambiar ,validar y  pasar al handler el array de platos seleccionados de #menuDishes
        // si es asignar validar y pasar array de seleccionados #dispoDishes
        try {
            if (accion == 'asignarDishMenu') {
                if (this.dispoDishes.selectedIndex < 0)
                    throw new Error('selecciona al menos una opción.');
                platos = Array.from(this.dispoDishes.selectedOptions).map(option => option.value);
            } else if (accion == "desasignarDishMenu") {
                if (this.menusDishes.selectedIndex < 0)
                    throw new Error('selecciona al menos una opción.');

                platos = Array.from(this.menusDishes.selectedOptions).map(option => option.value);
            } else if (accion == "intercambiarDishMenu") {
                if (this.menusDishes.selectedOptions.length !== 2)
                    throw new Error('selecciona solo dos opciones.');

                platos = Array.from(this.menusDishes.selectedOptions).map(option => option.value);
            }
        } catch (error) {
            alert(error);
            error instanceof TypeError
                ? console.error('Se ha producido un error:', error)
                : alert(error);
        }

        handler(menu, platos, accion);

        event.stopPropagation();
        event.preventDefault();
    });

}

function manageCatValidation(handler) {
    let form = document.forms.fManCateg;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {

        let accion = event.submitter.id
        let isValid = true;
        let firstInvalidElement = null;

        try {
            if (accion == "addCateg") {
                this.nombre.value = this.nombre.value.trim();
                if (!this.nombre.checkValidity()) {
                    isValid = false;
                    showFeedBack(this.nombre, false);
                    firstInvalidElement = this.descripcion;
                } else {
                    showFeedBack(this.nombre, true);
                }

                if (!isValid) {
                    firstInvalidElement.focus();
                } else {
                    handler(this.nombre.value, accion, this.descripcion.value);
                }
            } else if (accion == "remCateg") {
                if (this.categoriasDispo.selectedIndex < 0)
                    throw new Error('selecciona al menos una opción.');
                let categorias = Array.from(this.categoriasDispo.selectedOptions).map(option => option.value);
                handler(categorias, accion);
            }
        } catch (error) {
            console.log(error);
            error instanceof TypeError
                ? console.error('Se ha producido un error:', error)
                : alert(error);
        }


        event.stopPropagation();
        event.preventDefault();
    });



}


function addRestValidation(handler) {

    let form = document.forms.fAddRest;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;
        try {
            this.nombre.value = this.nombre.value.trim();
            if (!this.nombre.checkValidity()) {
                isValid = false;
                showFeedBack(this.nombre, false);
                firstInvalidElement = this.descripcion;
            } else {
                showFeedBack(this.nombre, true);
            }

            this.latitud.value = this.latitud.value.trim();
            if (!this.latitud.checkValidity()) {
                isValid = false;
                showFeedBack(this.latitud, false);
                firstInvalidElement = this.descripcion;
            } else {
                showFeedBack(this.latitud, true);
            }

            this.longitud.value = this.longitud.value.trim();
            if (!this.longitud.checkValidity()) {
                isValid = false;
                showFeedBack(this.longitud, false);
                firstInvalidElement = this.descripcion;
            } else {
                showFeedBack(this.longitud, true);
            }

            if (!isValid) {
                firstInvalidElement.focus();
            } else {
                handler(this.nombre.value, this.descripcion.value, this.latitud.value, this.longitud.value);
            }

        } catch (error) {
            console.log(error);
            error instanceof TypeError
                ? console.error('Se ha producido un error:', error)
                : alert(error);
        }


        event.stopPropagation();
        event.preventDefault();
    });



}

function modCategoryValidation(handler) {
    let form = document.forms.fModCat;
    form.setAttribute('novalidate', true);

    form.addEventListener('submit', function (event) {
        let plato = form.platos.value;

        let categorias;
        let accion = event.submitter.id
        // si la accion es desasignar o intercambiar ,validar y  pasar al handler el array de platos seleccionados de #menuDishes
        // si es asignar validar y pasar array de seleccionados #dispoDishes
        try {
            if (accion == 'desasignarDishCategory') {
                if (this.dishCategories.selectedIndex < 0)
                    throw new Error('selecciona al menos una opción.');
                categorias = Array.from(this.dishCategories.selectedOptions).map(option => option.value);
            } else if (accion == "asignarDishCategory") {
                if (this.dispoCategories.selectedIndex < 0)
                    throw new Error('selecciona al menos una opción.');

                categorias = Array.from(this.dispoCategories.selectedOptions).map(option => option.value);
            }
        } catch (error) {
            alert(error);
            error instanceof TypeError
                ? console.error('Se ha producido un error:', error)
                : alert(error);
        }

        handler(plato, categorias, accion);

        event.stopPropagation();
        event.preventDefault();
    });
}

export { newDishValidation, removeDishValidation, manageMenuValidation, manageCatValidation, addRestValidation, modCategoryValidation };