var searchCol = $("#search-col");
var apiKey = "2bdae6894825c3874876330aedc1f2a6";
var city = "Orlando" || "Search for a city..."
var dt = moment().format("M/DD/YYYY")
var cityNameDate = $('#city-name-date');

var cities = [
  "Austin",
  "Chicago",
  "New York",
  "Orlando",
  "San Francisco",
  "Seattle",
  "Denver",
];

$(()=>{
  cities.map((city) => {
    let cityButton = `<button type="button" class="btn btn-sm btn-city">${city}</button>`;
    searchCol.append(cityButton);
  });

  console.log(cityNameDate)

  cityNameDate.text(`${city} (${dt})`)
})