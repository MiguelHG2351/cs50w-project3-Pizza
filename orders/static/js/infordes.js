function info_food(id, cid) {
    fetch('menu/order/' + id +'/'+ cid)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud falló: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Procesa los datos JSON
            console.log(data);
        })
        .catch(error => {
            // Maneja el error
            console.error('Error: ' + error.message);
        });
}

