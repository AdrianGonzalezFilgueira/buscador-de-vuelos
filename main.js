//Hacemos una llamada fetch para recoger datos

const apiUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers";

async function fetchApi() {
  try {
    const response = await fetch(apiUrl, {
      headers: { Authorization: "Bearer dAZsBb1ARKsSpraJUgygqzcA8vV6" },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

fetchApi();
