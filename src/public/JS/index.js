const contenedoTarj = document.getElementById("product-container")

function crearTarjProductInicio(productos){
    productos.forEach(producto => {
        const newCel = document.createElement("div");
        newCel.classList = "tarjeta-producto";
        contenedoTarj.appendChild(newCel); //
    });
}
console.log("hola")

crearTarjProductInicio(movil);