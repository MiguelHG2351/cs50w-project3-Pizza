function info_food(id, cid) {
    fetch('menu/order/' + id + '/' + cid)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud falló: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            let img = document.getElementById("imgfood");
            img.src = data.image_food;


            let large = document.getElementById("large").innerHTML = 'Large Size - U$' + data.large_price;
            let price_large = document.getElementById("flexRadioDefault1").value = data.large_price;
            let price_small = document.getElementById("flexRadioDefault2").value = data.small_price;
            let small = document.getElementById("small").innerHTML = 'Small Size - U$' + data.small_price;
            let name = document.getElementById("exampleModalLabel").innerHTML = data.name_food;

            let toppings_div = document.getElementById("toppings");
            toppings_div.innerHTML = ''; // Elimina cualquier contenido existente

            if (Array.isArray(data.toppings)) {
                data.toppings.forEach(top => {
                    const div = document.createElement("div");
                    div.className = 'form-check'; // Clase CSS para formateo
                    div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${top.name}" id="flexCheckIndeterminate_${top.toppings_id}">
                <label class="form-check-label"id="pricet" for="flexCheckIndeterminate_${top.toppings_id}" value="${top.price_toppings}">${top.name}  - U$ ${top.price_toppings}</label>
            `;
                    toppings_div.appendChild(div);
                });
            } else {
                console.error('Los datos de los toppings no son un array válido.');
            }

            console.log(data);
        })
        .catch(error => {
            console.error('Error: ' + error.message);
        });
}

function totalprice(prod_id) {
    var list_toppings = [];
    // ! botón de radio "Small"
    var size_small = document.getElementById("flexRadioDefault2");
    var size_large = document.getElementById("flexRadioDefault1");

    //!referencia a todos los checkboxes en la lista de toppings
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var cantidad = parseInt( document.getElementById("cantidad").value);
    //! variables para almacenar el precio total y la suma de precios
    let totalPrice = 0, subtotal = 0 ,cant = 0.0;
    var small_z = parseFloat(size_small.value);
    var large_z = parseFloat(size_large.value);

    //! Verifica si el botón de radio small está seleccionado
    if (size_small.checked || size_large.checked) {
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                //! Obtiene el valor del atributo for de la etiqueta asociada al checkbox
                var labelFor = checkbox.getAttribute("id");
                var label = document.querySelector(`label[for="${labelFor}"]`);
                var input = document.querySelector(`input#${labelFor}`);
                var tp = input.value;
                if (!list_toppings.includes(tp)) {
                    list_toppings.push(tp);
                }
                //alert(tp);
                //! Obtiene el valor del atributo "value" de la etiqueta y convertirlo a número
                var labelValue = parseFloat(label.getAttribute("value"));
                
                // !Verificara si labelValue es un número válido y agregarlo al precio total
                if (!isNaN(labelValue)) {
                    subtotal+= labelValue;
                }
            }
        });
        if(size_small.checked)
        {
            //!Comprueba la cantidad de pizzas pedidas para la orden
            if (cantidad > 1)
            {
                 cant = small_z * cantidad;
                    //alert(`la cantidad es de  ${cant}`);
            }
            else
            {
                cant = small_z;
            }
        }
        else
        {
            //!Comprueba la cantidad de pizzas pedidas para la orden
            if (cantidad > 1) {
                cant = large_z * cantidad;
                //alert(`la cantidad es de  ${cant}`);
            }
            else {
                cant = large_z;
            }
        }
        totalPrice = subtotal + cant;
        var pricelb =  document.getElementById("price").innerHTML = "Price: U$ " + totalPrice.toFixed(2);
        //! Mostrara la suma de los precios seleccionados
        // alert("Total Price for Small Size: U$" + totalPrice);
        //alert(list_toppings);
    }

    const cart = document.getElementById("cart"); 

    cart.addEventListener("click", function () {
        const data = { 
            producto: prod_id,
            cantidad: cantidad,
            precio:cant,
            toppings: list_toppings,
            total: totalPrice,
            usuario: 1
        };

        fetch('/cart', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud'); 
                }
                return response.json();
            })
            .then(data => {
                
                console.log(data);
            })
            .catch(error => {
                
                console.error('Hubo un error:', error);
            });
    });

}

function reset() {
    var size_small = document.getElementById("flexRadioDefault2");
    var size_large = document.getElementById("flexRadioDefault1");
    var cantidad = 1 
    var xd = parseInt(document.getElementById("cantidad").value);
    if(!isNaN(xd))
    {
        cantidad =xd;
    }

    list_toppings = [];
    size_small.checked = true;
    size_large.checked = false;
}

async function getDataFromLink(url) {
    const request = await fetch(url)
    const data = await request.json()
    return data
}

function renderTemplate(foodName, foodDescription, foodCategoryId, foodId, foodSizeName, foodImage, foodSmallPrice) {
    return `
    <div class="categorias" style='width: 20rem;height: 30rem;'>
    <span class='btncat'>${foodSizeName}</span>
    <div class="card" style="width: 20rem;height: 30rem;">
        <input type="hidden" name="category_id" value='${foodCategoryId}'>
            <img src="${foodImage}" class="card-img-top" alt="${foodName} with ${foodSizeName} size">
        <div class="card-body">
            <h5 class="card-title">${foodName}</h5>
            <p class="card-text">${foodDescription}.</p>

            <!--!Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" onclick='reset()'
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="product-container">
                                <!--!Contenedor de la imagen del producto -->
                                <div class="container-img">
                                    <img src="" alt="Food-Img" id="imgfood">
                                </div>
                                <!--!Contenedor de la información -->
                                <div class="container-inf">
                                    <!--!Tamaño -->
                                <div class="list-size">
                                    <h4>Size</h4>
                                    <div class="form-check" onclick="totalprice('${foodId}')">
                                        <input class="form-check-input" type="radio" name="sizeRadio" id="flexRadioDefault1">
                                        <label class="form-check-label" for="flexRadioDefault1" id='large'></label>
                                    </div>
                                    <div class="form-check" onclick="totalprice('${foodId}')">
                                        <input class="form-check-input" type="radio" name="sizeRadio" id="flexRadioDefault2">
                                        <label class="form-check-label" for="flexRadioDefault2" id='small'></label>
                                    </div>
                                </div>

                                    <!--!Cantidad-->
                                    <div class="cantidad">
                                        <h4>Cantidad</h4>
                                        <input type="number" id="cantidad" name="cantidad" min="1" max="30" onclick="totalprice('${foodId}')">
                                    </div>
                                    <!--!Complementos -->
                                    <div class="list-toppings" onclick="totalprice('${foodId}')">
                                        <h4>Toppings</h4>
                                        <div class="form-check" id='toppings'>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer" style='justify-content: space-between;'>
                                <span id='price'><strong>Price: </strong>c$0:00</span>
                                <div class="options">
                                    <button type="button" class="btn btn-secondary" onclick='reset()'
                                        data-bs-dismiss="modal">Close</button>
                                        <button type=" button" class="btn btn-dark" id='cart'> <i class="bi bi-cart4"></i>
                                            Add To Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--!Button trigger modal -->
    <div onclick="info_food('${foodId}' , '${foodCategoryId}')" data-tooltip="Price:${foodSmallPrice}"
        class="button" id='btnorder' data-bs-toggle="modal" data-bs-target="#exampleModal">
        <div class="button-wrapper">
            <div class="text">Buy</div>
            <span class="icon">
                <svg viewBox="0 0 16 16" class="bi bi-cart2" fill="currentColor" height="16" width="16"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z">
                    </path>
                </svg>
            </span>
        </div>
    </div>
</div>
    `
}

function getLastFetch() {
    const lastFetch = localStorage.getItem('lastFetch')
    return lastFetch
}

function saveFetchToLocalStorage(url) {
    localStorage.setItem('lastFetch', url)
}

// mira esto como el main
document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear()
    saveFetchToLocalStorage('/category/food/1')
    
    const container = document.querySelector('.cat')
    const listOfCategories = document.querySelectorAll('.container-ct')
    const DEFAULT_URL = '/category/food/1'

    container.innerHTML = ''
    // IIFE -> osea una función que se ejecuta sola
    ;(async () => {
        const data = await getDataFromLink(DEFAULT_URL)
        data.forEach(food => {
            container.innerHTML += renderTemplate(food.name_food, food.description, food.category_id, food.id, food.size_food__name_size, food.image_food, food.small_price)
        })
        // renderTemplate(data.name, data.description, data.category_id, data.food_id, data.size_name, data.image_food, data.small_price)
    })();
    
    // for the moment xd
    
    listOfCategories.forEach($category => {
        $category.addEventListener('click', async (e) => {
            e.preventDefault()
            const link = e.target.getAttribute('href')
            if (link === getLastFetch()) {
                return
            }
            container.innerHTML = ''
            const data = await getDataFromLink(link)
            data.forEach(food => {
                container.innerHTML += renderTemplate(food.name_food, food.description, food.category_id, food.id, food.size_food__name_size, food.image_food, food.small_price)
            })
            saveFetchToLocalStorage(link)
            console.log(data)
        })
    })
})
