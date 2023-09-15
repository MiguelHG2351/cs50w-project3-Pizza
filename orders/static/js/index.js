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
    var cantidad = parseInt(document.getElementById("cantidad").value) = 1;

    list_toppings = [];
    size_small.checked = true;
    size_large.checked = false;
}



