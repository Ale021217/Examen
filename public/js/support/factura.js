function consultarFactura() {
    // Obtén el número de factura ingresado por el usuario
    const numeroFactura = document.getElementById('OrderID').value;

    // Obtén la referencia a la colección de facturas en Firestore
    const facturasRef = db.collection('Orders');

    // Realiza la consulta a Firestore
    facturasRef.doc(numeroFactura).get().then((doc) => {
        if (doc.exists) {
            // Si la factura existe, muestra la información
            mostrarInformacionFactura(doc.data());
        } else {
            // Si la factura no existe, muestra un mensaje de error
            mostrarErrorFacturaNoEncontrada();
        }
    }).catch((error) => {
        // Maneja errores de la consulta
        console.error('Error al consultar la factura:', error);
    });
}

function mostrarInformacionFactura(factura) {
    const infoFacturaContainer = document.getElementById('infoFactura');
    infoFacturaContainer.innerHTML = `
        <h3>Factura #${factura.numero}</h3>
        <p>Cliente: ${factura.cliente}</p>
        <p>Contacto: ${factura.tituloContacto} ${factura.nombreContacto}</p>
        <p>Destino: ${factura.pais}, ${factura.ciudad}, ${factura.codigoPostal}</p>
        <p>Facturada: ${formatoFecha(factura.fechaFactura)}</p>
        <p>Requerida: ${formatoFecha(factura.fechaRequerida)}</p>
        <p>Despachada: ${formatoFecha(factura.fechaDespachada)}</p>
        <p>Empleado: ${factura.nombreEmpleado}</p>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio Unitario</th>
                    <th scope="col">Descuento</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>
                ${factura.productos.map(producto => `
                    <tr>
                        <td>${producto.codigo}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.precioUnitario}</td>
                        <td>${producto.descuento}</td>
                        <td>${producto.total}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p>Total: ${factura.total}</p>
    `;
}

function mostrarErrorFacturaNoEncontrada() {
    const infoFacturaContainer = document.getElementById('infoFactura');
    infoFacturaContainer.innerHTML = '<p class="text-danger">Factura no encontrada. Verifique el número de factura.</p>';
}

function formatoFecha(fecha) {
    const opcionesFecha = { day: 'numeric', month: 'short', year: 'numeric' };
    return fecha.toDate().toLocaleDateString('es-ES', opcionesFecha);
}
