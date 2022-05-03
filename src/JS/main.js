"use strict";
import { currentDate } from "./helpers.js";

// Función asíncrona para solicitar el token de acceso para la API
async function fetchToken() {
  try {
    const responseToken = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=DzFz6xgx71Nr8B1hOi2BUjZHxVFGCcb4&client_secret=n0fSOjZX4L1PNBKq",
      }
    );
    const dataToken = await responseToken.json();
    const token = dataToken.access_token;
    return token;
  } catch (error) {
    console.log(error);
  }
}
function inputValues() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let locations = {
      origin: document.querySelector("#origin").value,
      destination: document.querySelector("#destination").value,
    };
    return locations;
    /* origin = "";
  destination = ""; */
  });
}

async function fetchApi() {
  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${
        inputValues().origin
      }&destinationLocationCode=${
        inputValues().destination
      }&departureDate=${currentDate()}&adults=1&nonStop=false&max=250`,
      { headers: { Authorization: `Bearer ${await fetchToken()}` } }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

fetchToken();
fetchApi();
