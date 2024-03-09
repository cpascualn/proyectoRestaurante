import { newDishValidation, removeDishValidation, manageMenuValidation, manageCatValidation, addRestValidation, modCategoryValidation } from '../validation.js';
import { setCookie } from '../util.js';

const EXCECUTE_HANDLER = Symbol('excecuteHandler');
class RestaurantView {

	constructor() {
		this.categories = document.getElementById('categories');
		this.list = document.getElementById('listado');
		this.allergens = document.getElementById('allergens');
		this.menus = document.getElementById('menus');
		this.headText = document.getElementById("head_text");
		this.restaurants = document.getElementById("restaurants");
		this.dishWindows = Array();
		this.formWrap = document.getElementById("form__wrapper");
		this.loginDiv = document.getElementById("loginDiv");
	}

	[EXCECUTE_HANDLER](handler, handlerArguments, scrollElement, data, url,
		event) {
		handler(...handlerArguments);
		const scroll = document.querySelector(scrollElement);
		if (scroll) scroll.scrollIntoView();
		//$(scrollElement).get(0).scrollIntoView();
		history.pushState(data, null, url);
		event.preventDefault();
	}


	bindInit(handler) { // enlazar el manejador de los botones de inicio con los botones en el html

		document.getElementById('init').addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#', event);
		});
		document.getElementById('logo').addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#', event);

		});
	}

	bindShowDish(handler) {
		const cards = document.querySelectorAll('div.card');
		for (const card of cards) {
			let boton = card.querySelector('button.btn')
			let dish = boton.id;
			boton.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[dish],
					'#listado',
					{ action: 'showDish', dish },
					'#',
					event,
				);
			});
		}
	}

	bindCategoryList(handler) { // enlazar el manejador de los botones de las categorias con los botones en el html
		const categoryList = document.getElementById('category-list');
		const links = categoryList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const category = enlace.dataset.category;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[category],
					'#listado',
					{ action: 'showCategoryDishes', category },
					'#' + category,
					event,
				);
			});
		}
	}

	bindAllerList(handler) { // enlazar el manejador del  boton alergenos del menu
		this.allergens.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'#categories',
				{ action: 'showAllerList' },
				'#alergenos',
				event,
			);
		});

	}

	bindAllergen(handler) { // enlazar el manejador de los botones de los alergenos
		const allergenList = document.getElementById('allergen-list');
		const links = allergenList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const allergen = enlace.dataset.allergen;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[allergen],
					'#listado',
					{ action: 'showAllerDishes', allergen },
					'#' + allergen,
					event,
				);
			});
		}
	}

	bindMenuList(handler) {// enlazar el manejador del  boton menus del menu
		this.menus.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'#categories',
				{ action: 'showMenuList' },
				'#menus',
				event,
			);
		});

	}

	bindMenu(handler) {// enlazar el manejador de los botones de los menus
		const menuList = document.getElementById('menus-list');
		const links = menuList.querySelectorAll('div');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const menu = enlace.dataset.menu;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[menu],
					'#listado',
					{ action: 'showMenuDishes', menu },
					'#' + menu,
					event,
				);
			});
		}
	}

	bindRestaurant(handler) { // enlazar manejador del desplegable de restaurantes
		const links = this.restaurants.querySelectorAll('li');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const restaurant = enlace.dataset.restaurant;
			enlace.addEventListener('click', (event) => {
				this[EXCECUTE_HANDLER](
					handler,
					[restaurant],
					'#listado',
					{ action: 'showRestaurant', restaurant },
					'#' + restaurant,
					event,
				);
			});
		}
	}

	bindShowDishInNewWindow(handler) {
		const botones = document.querySelectorAll('button.btn.btn-primary');
		for (const boton of botones) {
			boton.addEventListener('click', (event) => {
				let dish = event.target.dataset.dname;

				// si la ventana no existe , se puede añadir
				if (this.dishWindows.find(window => window.name === (dish.replace(/\s/g, '') + "DishWindow")) === undefined) {
					// crear nueva ventana y recogerla en el array de ventanas
					let newWin = window.open('dish.html', dish + 'DishWindow',
						'width=800, height=600, top=250, left=250, titlebar=yes, toolbar=no,menubar=no, location=no');
					this.dishWindows.push(newWin);

					this.dishWindows[this.dishWindows.length - 1].addEventListener('DOMContentLoaded', () => {
						this[EXCECUTE_HANDLER](
							handler,
							[dish],
							'#listado',
							{ action: 'showDishInNewWindow', dish },
							'#' + dish,
							event,
						);

					});
				}
			});

		}
	}

	bindCloseWindows(handler) {

		const bClose = document.getElementById('windowsCloser');
		bClose.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](
				handler,
				[],
				'.header',
				{ action: 'closeWindows' },
				'#',
				event,
			);
		});
	}

	bindManagement(handler) {
		let gestiones = document.getElementById("gestiones");
		const links = gestiones.querySelectorAll('li');
		for (const link of links) {
			let enlace = link.querySelector("a");
			const gestion = enlace.dataset.gestion;
			enlace.addEventListener('click', (event) => {
				let activos = document.querySelectorAll(".dropdown-item.active");
				activos.forEach(function (elemento) {
					elemento.classList.remove("active");
				});
				enlace.classList.add("active");
				this[EXCECUTE_HANDLER](
					handler,
					[gestion],
					'.form__wrapper',
					{ action: 'showForm', gestion },
					'#' + gestion,
					event,
				);
			});
		}
	}


	modifyBreadcrumb(category) { // metodo para modificar las migas de pan, si recibe null se borra y vuelve al inicio, si no se añade la nueva ubicacion
		let bc = document.getElementById('breadcrumb');
		// si ya tiene un hijo , se borra para reemplazarlo por el nuevo
		if (bc.children[1] !== undefined) {
			bc.removeChild(bc.children[1]);
		}
		if (category !== null) {
			bc.insertAdjacentHTML('beforeend', `
			<li class="breadcrumb-item active" aria-current="page">${category}</li>
	
			 `);
		}

	}

	showCategories(categories) { // mostrar el menu de categorias
		this.headText.innerHTML = "INICIO";
		// hacer que se borren todos los que habia antes
		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'category-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const category of categories) {
			container.insertAdjacentHTML('beforeend', `<div class="col-lg-3 colmd-6 nav-item"><a data-category="${category.name}" href="#${category.name}" class="nav-link">
		<h4>${category.name}</h4>
		</a>
		</div>`);
		}
		this.categories.append(container);
	}

	showDishes(dishes) { // mostrar los platos , cada vez que se llama a este metodo , los platos anteriores se borran del html
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		// si llegan 3 platos, cambiar el css para que queden centrados
		if (dishes.length <= 3) {
			this.list.classList.add('listadoThree');
		} else
			this.list.classList.remove('listadoThree');


		for (const dish of dishes) {
			const container = document.createElement('div');
			container.classList.add('card');

			let name = dish.name.replace(/\s/g, '');
			// mostrar un boton de boostrap que abre un modal con la ficha del plato
			container.insertAdjacentHTML('beforeend', `<img src="${dish.image}" class="card-img-top" alt="...">
			<div class="card-body">
		    <h5 class="card-title"  > ${dish.name} </h5> 
			</div>
			</div>
			<button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#Modal${name}" id="${name}"> SABER MÁS
  			</button>

			  <div class="modal fade" id="Modal${name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
				  <div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">${dish.name}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				  </div>
				  <div class="modal-body">
					<img src="${dish.image}" alt="">
					<h5>${dish.description}</h5>
					<p><b>INGREDIENTES:</b> ${dish.ingredients}</p>
				  </div>
				  <div class="modal-footer">
				  <button data-dname="${name}" class="btn btn-primary text-uppercase mr-2 px-4">Abrir en nueva ventana</button>
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				  </div>
				</div>
			  </div>
			</div>
			 `);

			this.list.append(container);
		}
	}


	showDishInNewWindow(dish, message) {
		// encontrar la ventana llamada dish + 'DishWindow'
		let window = this.dishWindows.find(window => window.name === (dish.name.replace(/\s/g, '') + "DishWindow"));
		let platosDiv = window.document.getElementById('plato');
		let header = window.document.getElementById('h-title');
		if (platosDiv !== null) {
			platosDiv.replaceChildren();
		}

		if (dish !== null) {
			header.innerHTML = dish.name;
			window.document.title = `${dish.name}`;
			platosDiv.insertAdjacentHTML('beforeend', `
			<img src="${dish.image}" alt>
			<h5>${dish.description}</h5>
			<p><b>INGREDIENTES:</b> ${dish.ingredients}</p>
			<button type="button" class="btn btn-secondary" id="b-close" onclick="window.close()">Close</button>
			`);
		} else {
			if (platosDiv !== null) {
				platosDiv.insertAdjacentHTML('beforeend', `<div class="row d-flex justify-content-center">${message}</div>`);
			}

		}
		window.document.body.scrollIntoView();

	}

	showAllergens(allergens) { // mostrar el menu de alergenos
		this.headText.innerHTML = "ALÉRGENOS";
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'allergen-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const allergen of allergens) {
			container.insertAdjacentHTML('beforeend', `<div class="col  nav-item"><a data-allergen="${allergen.name}" href="#${allergen.name}" class="nav-link">
			<h4>${allergen.name}</h4>
			</a>
			</div>`);
		}
		this.categories.append(container);

	}

	showMenus(menus) { // mostrar el menu de menus
		this.headText.innerHTML = "MENUS";
		// hacer que se borren todos los que habia antes
		if (this.list.children.length >= 1)
			this.list.innerHTML = '';

		if (this.categories.children.length >= 1)
			this.categories.innerHTML = '';

		const container = document.createElement('div');
		container.id = 'menus-list';
		container.classList.add('nav');
		container.classList.add('nav-underline');
		for (const menu of menus) {
			container.insertAdjacentHTML('beforeend', `<div class="col-lg-3 col-md-3 nav-item"><a data-menu="${menu.name}" href="#${menu.name}" class="nav-link">
			<h4>${menu.name}</h4>
			</a>
			</div>`);
		}
		this.categories.append(container);
	}

	loadRestaurants(restaurants) { // cargar el desplegable de restaurantes con los restaurantes que tenga el MODEL
		this.restaurants.replaceChildren();
		for (const restaurant of restaurants) {
			let container = document.createElement('li');
			let link = document.createElement('a');
			link.href = '#' + restaurant.name.replace(/\s/g, '');
			link.classList.add('dropdown-item');
			link.innerHTML = restaurant.name;
			link.dataset.restaurant = restaurant.name.replace(/\s/g, '');
			container.appendChild(link);

			this.restaurants.append(container);
		}
	}

	showRestaurant(restaurant) { // mostrar la ficha del restaurante
		this.headText.innerHTML = restaurant.name;

		this.categories.innerHTML = '';
		this.list.innerHTML = '';

		let location = restaurant.location;
		let maps;
		if (restaurant.name === 'Restaurante de Madrid') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=madrid+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">GPS devices</a></iframe></div>`
		} else if (restaurant.name === 'Restaurante de Barcelona') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Les%20Rambles,%201%20Barcelona,%20Spain+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">GPS car tracker</a></iframe></div>`;

		} else if (restaurant.name === 'Restaurante de Sevilla') {
			maps = `<div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=sevilla+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/car-satnav-gps/">Car Navigation Systems</a></iframe></div>`;
		}
		const container = document.createElement('div');
		container.insertAdjacentHTML('beforeend', `<div>
			<h5>${restaurant.description}</h5>
			<h3>LOCALIZACION</h3>
			<h5>LATITUD:${location.latitude}</h5>
			<h5>LONGITUD:${location.longitude}</h5>
			${maps}
			</div>`);
		this.list.append(container);
	}

	closeWindows() {
		for (const window of this.dishWindows) {
			if (window !== null) {
				window.close();
			}
		}

	}

	hideForm() {
		document.getElementById("form__wrapper").replaceChildren();
	}

	hideLogin() {
		this.loginDiv.replaceChildren();
	}


	showAdminMenu() {
		let headMenu = document.getElementById("headMenu");
		headMenu.insertAdjacentHTML('beforeend', `
		<li>
		<div class="dropdown" id="gestionesForms">
			<button class="btn btn-secondary dropdown-toggle"
				type="button" data-bs-toggle="dropdown"
				aria-expanded="false">
				Gestion
			</button>
			<ul class="dropdown-menu dropdown-menu-dark"
				id="gestiones">
				<li><a class="dropdown-item" href="#add-dish"
						data-gestion="addDish">Añadir
						Plato</a></li>
				<li><a class="dropdown-item" href="#remove-dish"
						data-gestion="removeDish">Borrar
						Plato</a></li>
				<li><a class="dropdown-item"
						href="#gestionar-menu"
						data-gestion="manageMenu">Gestionar
						Menus</a></li>
				<li><a class="dropdown-item"
						href="#gestion-categoria"
						data-gestion="manageCat">Gestionar
						Categorias</a></li>
				<li><a class="dropdown-item"
						href="#add-restaurant"
						data-gestion="addRest">Añadir
						Restaurante</a></li>
				<li><a class="dropdown-item"
						href="#modify-category"
						data-gestion="modifyCat">Modificar
						Categoria</a></li>
			</ul>
		</div>
	</li>
		`);
	}



	addDishForm(categories, allergens) {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'AÑADIR PLATO';

		this.categories.innerHTML = '';
		this.list.innerHTML = '';



		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form" id="Form" name="fAddDish" role="form"
                    enctype="multipart/form-data" novalidate>

                
		<h2>AÑADIR PLATO</h2>
		<div class="form-group">
			<label for="nombre">Nombre</label><input type="text"
				name="nombre" required>
				<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>

		</div>

		<div class="form-group">
			<label for="descripcion">Descripcion</label><input
				type="text" name="descripcion">
				<div class="invalid-feedback"></div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<label for="ingredientes">Ingredientes</label><input
				type="text" name="ingredientes"
				placeholder="separe los ingredientes entre comas , " required>
				<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">

			<label for="imagen">Imagen</label><input type="file"
				name="imagen" accept="image/*" required>
				<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>
		<div class="form-group">
			<label for="categorias">Categorias</label>
			<select name="categorias" id="categorias" size="4"
				multiple >

			</select>

		</div>

		<div class="form-group">
			<label for="alergenos">Alergenos</label>
			<select name="alergenos" id="alergenos" size="4"
				multiple >

			</select>

		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-success">enviar</button>
			<button class="btn btn-danger" type="reset">Cancelar</button>
		</div>
		</form>
		`);

		// añadir add event listener al button el cual hacer [MODEL].createdish
		const categorias = this.formWrap.querySelector('#categorias');
		const alergenos = this.formWrap.querySelector('#alergenos');

		this.showSelectOptions(categorias, categories);
		this.showSelectOptions(alergenos, allergens);
	}
	bindNewDishForm(handler) {
		newDishValidation(handler);
	}

	showNewDishModal(done, dish, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'Nuevo Plato';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato
<strong>${dish.name}</strong> ha sido creada correctamente.</div>`);
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> El plato <strong>${dish.name}</strong> ya está
creada.</div>`,
			);
		}
		messageModal.show();
		const listener = (event) => {
			if (done) {
				document.forms["fAddDish"].reset();
			}
			document.fAddDish.nombre.focus();
		};
		messageModalContainer.addEventListener('hidden.bs.modal', listener, {
			once: true
		});
	}


	removeDishForm(dishes) {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'BORRAR PLATO';

		this.categories.innerHTML = '';
		this.list.innerHTML = '';


		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form"  name="fRemDish" role="form" novalidate>

		<div class="form-group">
			<label for="platos">PLATOS</label>
			<select name="platos" id="remDishes" size="8"
				multiple required>

			</select>
			<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-danger" name="borrarDish" id="borrarDish">borrar</button>
		</div>
		</form>
		`);

		let divPlatos = document.querySelector('#remDishes');

		this.showSelectOptions(divPlatos, [...dishes].map(dish => dish.dish));
	}
	bindRemoveDishForm(handler) {
		removeDishValidation(handler);
	}
	showRemoveDishModal(done, dishes, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'borrar plato';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const dish of dishes) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato
										<strong>${dish.name}</strong> ha sido borrada correctamente.</div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}

	manageMenuForm(menus, allDishes) {
		// añadir en categories la opcion asignar y otra con opcion desasignar

		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'GESTION DE MENUS';
		this.categories.innerHTML = '';
		this.list.innerHTML = '';

		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form" id="Form" name="fManMenu" role="form" novalidate>
		<h2>GESTION DE MENUS</h2>

		<div class="form-group">
			<label for="menus">MENUS</label>
			<select name="menus" id="menusSel">
			<option value=""></option>
			</select>
		</div>
		<fieldset><div id="MenuForm">  </div> </fieldset>
		</form>
		`);

		let divMenus = document.querySelector('#menusSel');
		this.showSelectOptions(divMenus, [...menus].map(menu => menu.menu));
		divMenus.addEventListener('change', () => {
			this.mostrarMenuForm(menus, allDishes)
		});

	}

	mostrarMenuForm(menus, AllDishes) { // mostrar los platos del menu
		const select = document.getElementById("menusSel");
		const menuForm = document.getElementById("MenuForm");
		menuForm.replaceChildren();


		let menu = [...menus].find(menu => menu.menu.name === select.value);
		if (menu !== undefined) {
			menuForm.insertAdjacentHTML('beforeend', `
			<div class="form-group">
				<label for="menusDishes">PLATOS DEL MENU</label>
				<p>Seleccione SOLO 2 para intercambiar sus posiciones</p>
				<select name="menusDishes" id="menusDishes" multiple size="3">

				</select>
				<button type="submit" class="btn btn-danger"  name="desasignarDishMenu" id="desasignarDishMenu">Desasignar</button>
				<button type="submit" class="btn btn-warning"  name="intercambiarDishMenu" id="intercambiarDishMenu">Intercambiar Posiciones</button>
			</div>

			<div class="form-group">
			<label for="dispoDishes">PLATOS DISPONIBLES PARA AÑADIR</label>
			<select name="dispoDishes" id="dispoDishes" multiple size="6">
			</select>
			<button type="submit" class="btn btn-success" name="asignarDishMenu" id="asignarDishMenu">Asignar</button>
			</div>
			`);
			// mostrar los platos de este menu
			let menusDishes = menu.dishes.map(dish => dish.dish);
			this.showSelectOptions(document.getElementById("menusDishes"), menusDishes);
			// mostrar todos los platos de la aplicacion excepto los que ya estan añadidos
			let dispoDishes = [...AllDishes].map(dish => dish.dish);
			dispoDishes = dispoDishes.filter(dish => !menusDishes.includes(dish));
			this.showSelectOptions(document.getElementById("dispoDishes"), dispoDishes);
		}
	}

	bindManageMenuForm(handler) {
		let divMenus = document.querySelector('#menusSel');
		// divMenus.addEventListener('change', () => {
		manageMenuValidation(handler)
		// });
	}

	showAddMenuDishModal(done, dishes, menu, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nuevo plato en menu';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const dish of dishes) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato
<strong>${dish.name}</strong> ha sido añadido  correctamente. al menu <strong>${menu.name}</strong> </div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
		const listener = (event) => {
			if (done) {
				document.forms["fManMenu"].reset();
			}
			document.fManMenu.menus.focus();
		};
		messageModalContainer.addEventListener('hidden.bs.modal', listener, {
			once: true
		});
	}
	showRemoveMenuDishModal(done, dishes, menu, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nuevo plato en menu';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const dish of dishes) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato
<strong>${dish.name}</strong> ha sido eliminado  correctamente del menu <strong>${menu.name}</strong> </div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
		const listener = (event) => {
			if (done) {
				document.forms["fManMenu"].reset();
			}
			document.fManMenu.menus.focus();
		};
		messageModalContainer.addEventListener('hidden.bs.modal', listener, {
			once: true
		});
	}

	showChangeMenuDishModal(done, dishes, menu, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nuevo plato en menu';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {

			body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato
<strong>${dishes[0].name}</strong> ha cambiado su posicion con El plato
<strong>${dishes[1].name}</strong>  correctamente en el  menu <strong>${menu.name}</strong> </div>`);

		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
		const listener = (event) => {
			if (done) {
				document.forms["fManMenu"].reset();
			}
			document.fManMenu.menus.focus();
		};
		messageModalContainer.addEventListener('hidden.bs.modal', listener, {
			once: true
		});
	}

	manageCatForm(categories) {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'GESTIONAR CATEGORIA';

		this.categories.innerHTML = '';
		this.list.innerHTML = '';

		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form" id="Form" name="fManCateg" role="form" novalidate>

                
		<fieldset>
		<h2>AÑADIR CATEGORIA</h2>
		<div class="form-group">
			<label for="nombre">Nombre</label><input type="text"
				name="nombre" required>
				<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<label for="descripcion">Descripcion</label><input
				type="text" name="descripcion">
				<div class="invalid-feedback"></div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-success" name="addCateg" id="addCateg">añadir</button>
		</div>
		</fieldset>
		<fieldset>
		<h2>BORRAR CATEGORIA</h2>
		<div class="form-group">
			<label for="categoriasDispo">CATEGORIAS DISPONIBLES</label>
			<select name="categoriasDispo" id="categoriasDispo" multiple size="3">

			</select>

		</div>

		<div class="form-group">
			<button type="submit"  class="btn btn-danger" name="remCateg" id="remCateg">eliminar</button>
		</div>
		</fieldset>
		</form>
		`);


		this.showSelectOptions(document.getElementById("categoriasDispo"), [...categories]);
	}
	bindmanageCatForm(handler) {
		manageCatValidation(handler);
	}

	showAddCategDishModal(done, categ, error) {

		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nueva categoria';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			body.insertAdjacentHTML('afterbegin', `<div class="p-3">La categoria
		<strong>${categ.name}</strong> ha sido añadida </div>`);
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}

	showRemoveCategDishModal(done, categories, error) {

		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nueva categoria';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const categ of categories) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">La categoria
		<strong>${categ.name}</strong> ha sido borrada  </div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}

	addRestForm() {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'AÑADIR RESTAURANTE';

		this.categories.innerHTML = '';
		this.list.innerHTML = '';

		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form" id="Form" name="fAddRest" role="form" novalidate>
		<h2>AÑADIR RESTAURANTE</h2>
		<div class="form-group">
			<label for="nombre">Nombre</label><input type="text"
				name="nombre" required>
				<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<label for="descripcion">Descripcion</label><input
				type="text" name="descripcion">
				<div class="invalid-feedback"></div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<h3>Localizacion</h3>
			<label for="latitud">latitud</label>
			<input type="text" name="latitud" required>
			<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>

			<label for="longitud">longitud</label>
			<input type="text" name="longitud" required>
			<div class="invalid-feedback">El campo es obligatorio.</div>
				<div class="valid-feedback">Correcto.</div>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-success">enviar</button>
		</div>
		</form>
		`);
	}
	bindAddRestForm(handler) {
		addRestValidation(handler);
	}

	showRestaurantModal(done, restaurant, error) {

		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nueva categoria';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			body.insertAdjacentHTML('afterbegin', `<div class="p-3">El restaurante
		<strong>${restaurant.name}</strong> ha sido creado  </div>`);

		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}


	modifyCatForm(dishes, categories) {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'SELECCIONAR PLATO';

		this.categories.innerHTML = '';
		this.list.innerHTML = '';


		this.formWrap.insertAdjacentHTML('beforeend', `
		<form class="Form" id="Form" name="fModCat" role="form" novalidate>
		<h2>SELECCIONE UN PLATO</h2>
		<div class="form-group">
			<label for="platos">PLATOS</label>
			<select name="platos" id="selDishes">
			<option value=""></option>
			</select>
		</div>
		<fieldset><div id="categsDish">  </div> </fieldset>
		</form> 
		`);

		let divPlatos = document.querySelector('#selDishes');
		this.showSelectOptions(divPlatos, [...dishes].map(dish => dish.dish));
		divPlatos.addEventListener('change', () => {
			this.mostrarCategoriasPlatoForm(dishes, categories)
		});
	}

	mostrarCategoriasPlatoForm(dishes, Allcategories) {
		const select = document.getElementById("selDishes");
		const categForm = document.getElementById("categsDish");
		categForm.replaceChildren();

		let dish = [...dishes].find(dish => dish.dish.name === select.value);

		categForm.insertAdjacentHTML('beforeend', `
			<div class="form-group">
				<label for="dishCategories">CATEGORIAS DEL PLATO</label>
				<select name="dishCategories" id="dishCategories" multiple size="3" >

				</select>
				<button type="submit" class="btn btn-danger"  name="desasignarDishCategory" id="desasignarDishCategory">Desasignar</button>
			</div>

			<div class="form-group">
			<label for="dispoCategories">CATEGORIAS DISPONIBLES PARA AÑADIR</label>
			<select name="dispoCategories" id="dispoCategories" multiple size="6">
			</select>
			<button type="submit" class="btn btn-success"  name="asignarDishCategory" id="asignarDishCategory">Asignar</button>
			</div>
			`);
		// mostrar los platos de este menu
		let dishCategories = dish.categories;
		this.showSelectOptions(document.getElementById("dishCategories"), dishCategories);
		// mostrar todos los platos de la aplicacion excepto los que ya estan añadidos
		let dispoCategories = [...Allcategories];
		dispoCategories = dispoCategories.filter(categ => !dishCategories.includes(categ));
		this.showSelectOptions(document.getElementById("dispoCategories"), dispoCategories);
	}
	bindCatForm(handler) {
		let divPlatos = document.querySelector('#selDishes');
		// divPlatos.addEventListener('change', () => {
		modCategoryValidation(handler);
		// });

	}

	showAssignCatDishModal(done, categories, dish, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nueva categoria';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const categ of categories) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">La categoria
		<strong>${categ.name}</strong> ha sido asignada a <strong>${dish.name}</strong>  </div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}

	showRemCatDishModal(done, categories, dish, error) {
		const messageModalContainer = document.getElementById('messageModal');
		const messageModal = new bootstrap.Modal('#messageModal');
		const title = document.getElementById('messageModalTitle');
		title.innerHTML = 'nueva categoria';
		const body = messageModalContainer.querySelector('.modal-body');
		body.replaceChildren();
		if (done) {
			for (const categ of categories) {
				body.insertAdjacentHTML('afterbegin', `<div class="p-3">La categoria
		<strong>${categ.name}</strong> ha sido desasignada de <strong>${dish.name}</strong>   </div>`);
			}
		} else {
			body.insertAdjacentHTML(
				'afterbegin',
				`<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> ${error}</div>`,
			);
		}
		messageModal.show();
	}


	showSelectOptions(select, options) {

		for (const option of options) {

			var nuevaOpcion = document.createElement("option");

			nuevaOpcion.value = option.name;
			nuevaOpcion.textContent = option.name;

			select.appendChild(nuevaOpcion);
		}

	}

	showCookiesMessage() {
		const toast = `<div class="fixed-top p-5 mt-5">
		<div id="cookies-message" class="toast fade show bg-dark text-white
		w-100 mw-100" role="alert" aria-live="assertive" aria-atomic="true">
		<div class="toast-header">
		<h4 class="me-auto">Aviso de uso de cookies</h4>
		<button type="button" class="btn-close" data-bs-dismiss="toast"
		aria-label="Close" id="btnDismissCookie"></button>
		</div>
		<div class="toast-body p-4 d-flex flex-column">
		<p>
		Este sitio web almacenda datos en cookies para activar su
		funcionalidad, entre las que se encuentra
		datos analíticos y personalización. Para poder utilizar este
		sitio, estás automáticamente aceptando
		que
		utilizamos cookies.
		</p>
		<div class="ml-auto">
		<button type="button" class="btn btn-outline-light mr-3 deny"
		id="btnDenyCookie" data-bs-dismiss="toast">
		Denegar
		</button>
		<button type="button" class="btn btn-primary"
		id="btnAcceptCookie" data-bs-dismiss="toast">
		Aceptar
		</button>
		</div>
		</div>
		</div>
		</div>`;
		document.body.insertAdjacentHTML('afterbegin', toast);

		const cookiesMessage = document.getElementById('cookies-message');
		cookiesMessage.addEventListener('hidden.bs.toast', (event) => {
			event.currentTarget.parentElement.remove();
		});

		const btnAcceptCookie = document.getElementById('btnAcceptCookie');
		btnAcceptCookie.addEventListener('click', (event) => {
			setCookie('accetedCookieMessage', 'true', 1);
		});

		const denyCookieFunction = (event) => {
			this.main.replaceChildren();
			this.main.insertAdjacentHTML('afterbegin', `<div class="container my-3"><div class="alert alert-warning" role="alert">
						<strong>Para utilizar esta web es necesario aceptar el uso de cookies. Debe recargar la página y aceptar las condicones para seguir navegando. Gracias.</strong>
					</div></div>`);
			this.categories.remove();
			this.menu.remove();
		};
		const btnDenyCookie = document.getElementById('btnDenyCookie');
		btnDenyCookie.addEventListener('click', denyCookieFunction);
		const btnDismissCookie = document.getElementById('btnDismissCookie');
		btnDismissCookie.addEventListener('click', denyCookieFunction);
	}
	showIdentificationLink() {
		const userArea = document.getElementById('userArea');
		userArea.replaceChildren();
		userArea.insertAdjacentHTML('afterbegin', `<div class="account d-flex
		mx-2 flex-column" style="text-align: right; height: 40px">
		<a id="login" href="#"><i class="bi bi-person-circle" ariahidden="true"></i> Identificate</a>
		</div>`);
	}

	bindIdentificationLink(handler) {
		const login = document.getElementById('login');
		login.addEventListener('click', (event) => {
			this[EXCECUTE_HANDLER](handler, [], '.main', { action: 'login' }, '#',
				event);
		});
	}

	showLogin() {
		this.formWrap.replaceChildren();
		this.headText.innerHTML = 'ACCEDER';
		this.categories.innerHTML = '';
		this.list.innerHTML = '';
		this.loginDiv.replaceChildren();
		const login = `<div class="container h-100">
				<div class="d-flex justify-content-center h-100">
					<div class="user_card">
						<div class="d-flex justify-content-center form_container">
						<form name="fLogin" role="form" novalidate>
								<div class="input-group mb-3">
									<div class="input-group-append">
										<span class="input-group-text"><i class="bi bi-person-circle"></i></span>
									</div>
									<input type="text" name="username" class="form-control input_user" value="" placeholder="usuario">
								</div>
								<div class="input-group mb-2">
									<div class="input-group-append">
										<span class="input-group-text"><i class="bi bi-key-fill"></i></span>
									</div>
									<input type="password" name="password" class="form-control input_pass" value="" placeholder="contraseña">
								</div>
								<div class="form-group">
									<div class="custom-control custom-checkbox">
										<input name="remember" type="checkbox" class="custom-control-input" id="customControlInline">
										<label class="custom-control-label" for="customControlInline">Recuerdame</label>
									</div>
								</div>
									<div class="d-flex justify-content-center mt-3 login_container">
										<button class="btn login_btn" type="submit">Acceder</button>
							</div>
							</form>
						</div>
					</div>
				</div>
			</div>`;
		this.loginDiv.insertAdjacentHTML('afterbegin', login);
	}

	bindLogin(handler) {
		const form = document.forms.fLogin;
		form.addEventListener('submit', (event) => {
			handler(form.username.value, form.password.value);
			event.preventDefault();
		});
	}

	showInvalidUserMessage() {
		let invalidUserMessage = document.getElementById("invalidUserMessage");
		//  eliminar el mensaje para que no se vaya mostrando varias veces
		if (invalidUserMessage) {
			invalidUserMessage.parentNode.removeChild(invalidUserMessage);
		}
		this.loginDiv.insertAdjacentHTML('beforeend', `<div class="container my3" id="invalidUserMessage"><div class="alert alert-warning" role="alert">
		<strong>El usuario y la contraseña no son válidos. Inténtelo
		nuevamente.</strong>
		</div></div>`);
		document.forms.fLogin.reset();
		document.forms.fLogin.username.focus();
	}

	initHistory() {
		history.replaceState({ action: 'init' }, null);
	}

	showAuthUserProfile(user) {
		const userArea = document.getElementById('userArea');
		userArea.replaceChildren();
		userArea.insertAdjacentHTML('afterbegin', `<div class="account d-flex
		mx-2 flex-column" style="text-align: right">
		${user.username} <a id="aCloseSession" href="#">Cerrar sesión</a>
		</div>
		<div class="image">
		<img alt="${user.username}" src="img/user.jpg"/>
		</div>`);
	}



}
export default RestaurantView;
