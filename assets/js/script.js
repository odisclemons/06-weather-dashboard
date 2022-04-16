var buttonContainer = $("#button-container");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "orlando"
var dt = moment().format("M/DD/YYYY")
var cityNameDate = $('#city-name-date');
var inpSearch = $('#inp-search')
var btnSearch = $('#btn-search')

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

  // set the city name and date at the top of page
  cityNameDate.text(`${city || "Search for a city..."} (${dt})`)

  //click handler for search button click
  btnSearch.click(handleWeatherQuery)
})

function handleWeatherQuery(e) {
  e.preventDefault()
  if (inpSearch[0].value) city = inpSearch[0].value
  console.log(cities)
  if (!city) {
    alert("Please specify a location first...")
    return
  }

  let query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  //lets run the query and see what happens...
  fetch(query).then((res) => res.json()).then(data => {

    //get the keys we need from it
    let { coord, weather, main, wind, name } = data

    city = name
    spnTemp.text(`${main.temp}°F`)
    spnWind.text(`${wind.speed} MPH`)
    spnHumidity.text(`${main.humidity}%`)
    spnUv.text()
    cityNameDate.text(`${city || "Search for a city..."} (${dt})`)
    updateLocalStorage(city)
  })
}

function updateLocalStorage(newCity) {
  // if this new city is not already on the list, add it to the top of the list 
  console.log(cities, newCity, JSON.stringify([newCity, ...cities]))
  if (!cities.includes(newCity)) {
    localStorage.setItem('wdbCities', JSON.stringify([newCity, ...cities]))
    renderButtons()
  }

}

// make the buttons under search that show the recently search cities
// we only add cities that successfully return results from api
function renderButtons() {

  console.log('render cities', cities)
//first clear the buttons that are already there
buttonContainer.html(null)

if(!cities ?? !cities.length){
  buttonContainer.html('<h2>There are no recent cities yet...</h2>')
  return
}
  //loop through cities list and make a button for each one
  cities.map((city) => {
    console.log(city)
    let cityButton = `<button type="button" class="btn btn-sm btn-city" onclick="handleCityClick('${city}')">${city}</button>`;
    buttonContainer.append(cityButton);
  });
}

function handleCityClick(newCity){
  console.log('newCity:', newCity)
  city = newCity
  inpSearch.value = newCity
  handleWeatherQuery({ preventDefault: ()=>{}})
}