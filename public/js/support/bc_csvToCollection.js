var db = firebase.apps[0].firestore();
const txtCSV = document.querySelector("#txtCSV");
const btnLoad = document.querySelector("#btnLoad");

btnLoad.addEventListener("click", function () {
  lecturaCSV(txtCSV.files[0]).then((r) => {
    txtCSV.value = "";
  });
});

async function lecturaCSV(archivo) {
  const nomarch = archivo.name.split(".")[0];
  const lector = new FileReader();
  lector.readAsText(archivo);
  await esperarSegundos();

  if (lector.result != null) {
    let data = lector.result.split("\n");
    let etiquetas = data[0].split(";");
    
    for (let index = 1; index < data.length; index++) {
      const valores = data[index].split(";");
      let salida = {};
      
      for (let index2 = 0; index2 < etiquetas.length; index2++) {
        salida[etiquetas[index2]] = limpiarDato(valores[index2]);
      }
      
      db.collection(nomarch)
        .add(salida)
        .then(function (docRef) {
          console.log("ID del registro: " + docRef.id);
        })
        .catch(function (FirebaseError) {
          console.log("Error al registrar el dato: " + FirebaseError);
        });
    }
  }
}

function limpiarDato(dato) {
  // Intenta convertir el dato a un número
  let numero = Number(dato);

  if (!isNaN(numero)) {
    // Si se pudo convertir a número, devolverlo
    return numero;
  } else if (!isNaN(parseFloat(dato))) {
    // Intenta convertir el dato a un número flotante
    return parseFloat(dato);
  } else {
    // Intenta convertir el dato a una fecha
    let fecha = new Date(dato);

    if (!isNaN(fecha.getTime())) {
      // Si se pudo convertir a fecha, devolverlo
      return fecha;
    } else {
      // Si no es número ni fecha, devolver la cadena "na"
      return dato ? dato.trim() : "na";
    }
  }
}

function esperarSegundos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}
