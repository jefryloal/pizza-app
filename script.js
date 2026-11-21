const DOMICILIO = 2000;

const boton = document.getElementById("calcular");

boton.addEventListener("click", manejarBoton);

document.getElementById("cantidad").addEventListener("input", actualizarTodo);
document.getElementById("pizza").addEventListener("change", actualizarTodo);

document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", actualizarTodo);
});

function formatoCOP(valor) {
    return "$" + valor.toLocaleString("es-CO");
}

function validarCantidad() {
    let cantidad = document.getElementById("cantidad").value;
    let error = document.getElementById("errorCantidad");

    if (cantidad === "" || cantidad <= 0 || isNaN(cantidad)) {
        error.textContent = "⚠️ Ingresa una cantidad válida";
        return false;
    }

    error.textContent = "";
    return true;
}

function obtenerExtras() {
    let extras = document.querySelectorAll('input[type="checkbox"]:checked');

    let total = 0;
    let lista = "";

    extras.forEach(e => {
        total += parseInt(e.value);
        lista += e.parentElement.textContent + "<br>";
    });

    document.getElementById("contadorExtras").textContent = extras.length;

    return { total, lista };
}

function calcularTotal() {
    if (!validarCantidad()) return null;

    let pizza = document.getElementById("pizza");
    let precioPizza = parseInt(pizza.value);
    let cantidad = parseInt(document.getElementById("cantidad").value);

    let extras = obtenerExtras();

    let subtotal = (precioPizza + extras.total) * cantidad;
    let total = subtotal + DOMICILIO;

    return { subtotal, total, extras };
}

function actualizarTodo() {
    let datos = calcularTotal();
    if (!datos) return;

    document.getElementById("totalPreview").textContent = formatoCOP(datos.total);
}

function manejarBoton() {

    if (boton.textContent === "Nuevo pedido") {
        resetearTodo();
        boton.textContent = "Calcular pedido";
        return;
    }

    if (!validarCantidad()) return;

    let pizza = document.getElementById("pizza");
    let nombrePizza = pizza.options[pizza.selectedIndex].text;
    let cantidad = document.getElementById("cantidad").value;

    let datos = calcularTotal();

    let resultado = document.getElementById("resultado");

    resultado.innerHTML = `
        <strong>🧾 Pedido confirmado</strong><br><br>
        🍕 ${nombrePizza}<br>
        🔢 Cantidad: ${cantidad}<br><br>

        ➕ Extras:<br>${datos.extras.lista || "Ninguno"}<br>

        💵 Subtotal: ${formatoCOP(datos.subtotal)}<br>
        🚚 Domicilio: ${formatoCOP(DOMICILIO)}<br><br>

        <strong>💰 Total: ${formatoCOP(datos.total)}</strong><br><br>
        ✅ Pedido listo
    `;

    resultado.classList.add("mostrar");

    boton.textContent = "Nuevo pedido";
}

function resetearTodo() {
    document.getElementById("cantidad").value = 1;

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    document.getElementById("resultado").innerHTML = "";
    document.getElementById("resultado").classList.remove("mostrar");

    document.getElementById("totalPreview").textContent = "$0";
    document.getElementById("contadorExtras").textContent = "0";
}