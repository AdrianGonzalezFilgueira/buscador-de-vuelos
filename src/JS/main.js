// Guardamos la dirección de llamada a la API en una variable
const apiUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers";

// Creamos una función asíncrona
async function fetchApi() {
  // Envolvemos su funcionalidad en un try para poder realizar un catch al final y lanzar un aviso en caso de error
  try {
    // Llamamos a la API con un fetch, y añadimos la autorización (token) que previamente conseguimos
    const response = await fetch(apiUrl, {
      headers: { Authorization: "Bearer dAZsBb1ARKsSpraJUgygqzcA8vV6" },
    });
    //Recibimos los datos de la API y los almacenamos en una variable
    const data = await response.json();
    console.log(data);
  } catch (error) {
    // Manejamos los posibles errores con un catch
    console.log(error);
  }
}

fetchApi();
