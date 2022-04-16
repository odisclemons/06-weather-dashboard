var searchCol = $("#search-col");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "" || "Search for a city..."
var dt = moment().format("M/DD/YYYY")
var cityNameDate = $('#city-name-date');
var search = $('#inp-search')

var weatherQuery

// get whatever we have in localStorage 
var storedCities = localStorage.getItem('wdbCities') 

// if there is stuff there, stringify it or just set it to an empty array
var cities = storedCities ? JSON.stringify(storedCities) : [];

// when document is ready, do this stuff...
$(()=>{
  //loop through cities list and make a button for each one
  cities.map((city) => {
    let cityButton = `<button type="button" class="btn btn-sm btn-city">${city}</button>`;
    searchCol.append(cityButton);
  });

  // set the city name and date at the top of page
  cityNameDate.text(`${city} (${dt})`)
})

function handleWeatherQuery(){
  fetch()
}