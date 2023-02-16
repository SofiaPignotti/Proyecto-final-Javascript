// Fetch a la API del clima
window.addEventListener('load', () => {
  let lon;
  let lat;
  let api_key = '7fcaef8031a847bea98b89a7c14d3f99'
  let cityName = document.querySelector('.city')
  let temperatureValue = document.querySelector('.value')
  let temperatureDescription = document.querySelector('description')
  let sunRise = document.querySelector('sun-rise')
  let sunSet = document.querySelector('sun-set')
  let weatherIcon = document.querySelector('weather-icon-img')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      lon = position.coords.longitude
      lat = position.coords.latitude
      const api = `https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${lon}&key=${api_key}&lang=es`
      fetch(api)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const { city_name, temp } = data.data[0]
          const { icon, descprition } = data.data[0].weather

          // Elementos del DOM

          cityName.textContent = city_name;
          temperatureValue.textContent = Math.floor(temp) + "°C";
          temperatureDescription.textContent = descprition
          weatherIcon.src = `https://weatherbit.io/static/img/icons/${icon}.png`;

        })
        .catch(err => console.error(err));
    })

  }
})



function deleteTransactionObject(transactionId) {
  // Obtengo las transacciones de mi baes de datos
  let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
  // Busco el indice o la posicion de la transaccion que quiero elimnar
  let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactiondId == transactionId)
  // Elimino el elemento en esa posición
  transactionObjArr.splice(transactionIndexInArray, 1)
  // Convierto nuevamente el objeto  JSON
  let transactionArrayJson = JSON.stringify(transactionObjArr);
  // Guardo el array en formato JSON en el localStorage
  localStorage.setItem("transactionData", transactionArrayJson);

}

function insertRow(transactionObj) {

  let transactionTableRef = document.getElementById("transactionTable");

  let newTransactionRowRef = transactionTableRef.insertRow(-1);
  newTransactionRowRef.setAttribute("data-transaction-id", transactionObj.transaccionId)

  let newTypeCellRef = newTransactionRowRef.insertCell(0);
  newTypeCellRef.textContent = transactionObj.transactionType;

  newTypeCellRef = newTransactionRowRef.insertCell(1);
  newTypeCellRef.textContent = transactionObj.transactionDescription;

  newTypeCellRef = newTransactionRowRef.insertCell(2);
  newTypeCellRef.textContent = transactionObj.transactionAmount;

  newTypeCellRef = newTransactionRowRef.insertCell(3);
  newTypeCellRef.textContent = transactionObj.transactionCategory;

  let newDeleteCell = newTransactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar"
  newDeleteCell.appendChild(deleteButton)

  deleteButton.addEventListener("click", (event) => {
    let transactionRow = event.target.parentNode.parentNode
    let transaccionId = transactionRow.getAttribute("data-transaction-id")
    transactionRow.remove()
    deleteTransactionObject()
  })
}
// Traer todos los elementos del localSotorage al cargar el DOM

document.addEventListener("DOMContentLoaded", function (event) {
  draw_category();
  let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"))
  transactionObjArray.forEach(element => {
    console.log(element)
    insertRow(element)
  })
})

const form = document.getElementById("transactionForm")
form.addEventListener("submit", function (event) {
  event.preventDefault()
  let transactionFormData = new FormData(form);
  let transactionObj = convertFormDataToTransactionObj(transactionFormData)
  console.log(transactionObj)
  insertRow(transactionObj)
  saveTransactionObject(transactionObj)
  form.reset()

  // Generar nuevo Id para cada transacción
  function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId))
    return newTransactionId;
  }

  function convertFormDataToTransactionObj(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("description");
    let transactionAmount = transactionFormData.get("mount");
    let transactionCategory = transactionFormData.get("category");
    let transactionId = getNewTransactionId()
    return {
      "transactionType": transactionType,
      "transactionDescription": transactionDescription,
      "transactionAmount": transactionAmount,
      "transactionCategory": transactionCategory,
      "transactionId": transactionId,
    }
  }





  function saveTransactionObject(transactionObj) {
    // Obtengo lo que hay en mi localStorage
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    // Añado a mi array mi transactionObj
    myTransactionArray.push(transactionObj)
    // convierto el array a JSON
    let transactionArrayJson = JSON.stringify(myTransactionArray);
    // Guardo el array en formato JSON en el localStorage
    localStorage.setItem("transactionData", transactionArrayJson);


  }
  // Le paso como parametro el transactionId de la transacción que quiero eliminar


});

function draw_category() {
  let allCategories = [
    "Salario", "Comida", "Diversión", "Transporte", "Ventas", "Vestimenta"
  ]
  for (let index = 0; index < allCategories.length; index++) {
    insertCategory(allCategories[index])
  }
}

// Función para insertar una categoria dinamicamente
function insertCategory(newCategory) {
  const selectElement = document.getElementById("category");
  let htmlToInsert = `<option> ${newCategory} </option>`;
  selectElement.insertAdjacentHTML("beforeend", htmlToInsert)
}
