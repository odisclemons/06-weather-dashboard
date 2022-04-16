var buttonContainer = $("#button-container");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "orlando"
var curDt = moment().format("M/DD/YYYY")
var cityName = $('#city-name')

var city = ""
var dt = $('#dt')
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
    //let query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    console.log(name)
    city = name
    return fetch(query)
  })
    .then((res) => res.json()).then(data => {
      console.log(city)
      //first take the current forcast for today
      let { temp, wind_speed, humidity, uvi, weather } = data.current

      spnTemp.text(`${temp}°F`)
      spnWind.text(`${wind_speed} MPH`)
      spnHumidity.text(`${humidity}%`)
      spnUv.text(uvi)

      // set the city name and date at the top of page
      cityName.text(city)
      dt.text(`(${curDt})`)
      weatherIcon.html(`<img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="weather icon" />`)

      updateLocalStorage(city)
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
  let coordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  return fetch(coordsUrl)
    .then(response => response.json()).then(data => {
      let { lat, lon, name } = data[0]
      console.log(data[0]);
      return { lat, lon, name }
    })
}
