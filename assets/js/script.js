var searchCol = $("#search-col");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "" 
var dt = moment().format("M/DD/YYYY")
var cityNameDate = $('#city-name-date');
var inpSearch = $('#inp-search')
var btnSearch = $('#btn-search')


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
  cityNameDate.text(`${city || "Search for a city..."} (${dt})`)
  btnSearch.click(handleWeatherQuery)
})

function handleWeatherQuery(e){
  e.preventDefault()
  if(inpSearch[0].value) city = inpSearch[0].value
  console.log(city)
  if(!city) {
    alert("Please specify a location first...")
    return 
  }
  let query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  fetch(query).then((res)=> res.json()).then(data => console.log(data))
}