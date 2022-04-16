var buttonContainer = $("#button-container");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "orlando"
var curDt = moment().format("M/DD/YYYY")
var cityName = $('#city-name')

var forecastCardContainer = $('#forecast-card-container')

var city = ""
var dtText = $('#dt-text')
var weatherIcon = $('#weather-icon')

var inpSearch = $('#inp-search')
var btnSearch = $('#btn-search')
var btnClear = $('#btn-clear')

var spnTemp = $('#spn-temp')
var spnWind = $('#spn-wind')
var spnHumidity = $('#spn-humidity')
var spnUv = $('#spn-uv')

// get whatever we have in localStorage 
var storedCities = localStorage.getItem('wdbCities')

// if there is stuff there, stringify it or just set it to an empty array
var cities = storedCities?.length > 0 ? JSON.parse(storedCities) : [];

// when document is ready, do this stuff...
$(() => {
  //make the buttons under search
  renderButtons()

  //click handler for search button click
  btnSearch.click(handleWeatherQuery)

  // clear local storage
  btnClear.click(handleClearButtons)
})

function handleWeatherQuery(e) {
  e.preventDefault()
  if (inpSearch[0].value) city = inpSearch[0].value
  console.log(cities)
  if (!city) {
    alert("Please specify a location first...")
    return
  }


  //lets run the query and see what happens...
  getCoordinates().then(coords => {
    let { lat, lon, name } = coords
    let query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=imperial&appid=${apiKey}`
    console.log(name)
    city = name
    return fetch(query)
  })
    .then((res) => res.json()).then(data => {
      //first take the current forcast for today
      let { temp, wind_speed, humidity, uvi, weather } = data.current

      spnTemp.text(`${temp}°F`)
      spnWind.text(`${wind_speed} MPH`)
      spnHumidity.text(`${humidity}%`)
      spnUv.text(uvi)

      setUviColor(uvi)

      // set the city name and date at the top of page
      cityName.text(city)
      dtText.text(`(${curDt})`)
      weatherIcon.html(`<img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="weather icon" />`)

      updateLocalStorage(city)
      render5Day(data.daily)
    })
}

function updateLocalStorage(newCity) {
  // if this new city is not already on the list, add it to the top of the list 
  if (!cities.includes(newCity)) {
    cities = [newCity, ...cities]
    localStorage.setItem('wdbCities', JSON.stringify([newCity, ...cities]))
    renderButtons()
  }

}

// clear buttons
function handleClearButtons() {
  localStorage.clear('wdbCities')
  renderButtons()
}

// make the buttons under search that show the recently search cities
// we only add cities that successfully return results from api
function renderButtons() {

  console.log('render cities', cities)
  //first clear the buttons that are already there
  buttonContainer.html(null)

  if (!cities ?? !cities.length) {
    buttonContainer.html('<h2>There are no recent cities yet...</h2>')
    return
  }
  //loop through cities list and make a button for each one
  cities.map((city) => {
    let cityButton = `<button type="button" class="btn btn-sm btn-city" onclick="handleCityClick('${city}')">${city}</button>`;
    buttonContainer.append(cityButton);
  });
}

function handleCityClick(newCity) {
  city = newCity
  inpSearch.value = newCity

  // normally this would have a click event so I pass that object with an empty method
  // to make sure it doesnt err out
  handleWeatherQuery({ preventDefault: () => { } })
}

function getCoordinates() {
  let coordsUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  return fetch(coordsUrl)
    .then(response => response.json()).then(data => {
      let { lat, lon, name, dt } = data[0]
      console.log(data[0]);
      return { lat, lon, name }
    })
}

function render5Day(daily) {
  for (var i = 0; i < 5; i++) {
    let { weather, temp, humidity, wind_speed, dt } = daily[i]
    let newForeCastCard = `
        <div class="forecast-card">
            <h5>${moment().add(i + 1, 'day').format("M/DD/YYYY")}</h5>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="weather icon" />
            <p>Temp: ${temp.day}° F</p>
            <p>Wind: ${wind_speed} MPH</p>
            <p>Humidity: ${humidity}%</p>
        </div>
        `

    forecastCardContainer.append(newForeCastCard)
  }
}

//change background color of UV Index based on uvi
function setUviColor(uvi) {

  switch (true) {
    case uvi <= 2:
      spnUv.css({ 'background-color': 'green', "color": "white" })
      break;
    case (uvi > 2 && uvi < 6):
      spnUv.css({ "background-color": "yellow", "color": "black" })
      break;
    case (uvi >= 6 && uvi < 8):
      spnUv.css({ "background-color": "orange", "color": "white" })
      break;
    case (uvi >= 8):
      spnUv.css({ "background-color": "red", "color": "white" })
      break;
    default:
      spnUv.css({ "background-color": "white", "color": "black", "border-color": "black" })
  }
}