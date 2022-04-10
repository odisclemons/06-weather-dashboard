var searchCol = $("#search-col");
var cities = [
  "Austin",
  "Chicago",
  "New York",
  "Orlando",
  "San Francisco",
  "Seattle",
  "Denver",
];

function init() {
  cities.map((city) => {
    let cityButton = `<button type="button" class="btn btn-sm btn-city">${city}</button>`;
    searchCol.append(cityButton);
  });
}

init();
