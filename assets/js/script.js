var formEl = document.querySelector('#searchForm');
var currentEl = document.querySelector('#currentWeather');
var searchHistoryEl = document.querySelector('#cityHistory');
var addButtons = false;

//initialize array with any stored history
var citiesArray = getHistory();
console.log(formEl.children[1].placeholder);

//Add buttons if there is a first launch, refresh, or relaunch of app
if (citiesArray.length) {

    // addHistoryButtons();
    addButtons = true;
    getCurrentWeather(citiesArray[citiesArray.length - 1]);
    
}
else {

    getCurrentWeather("Detroit");

}


formEl.addEventListener('submit', function (event) {
    event.preventDefault();

    var city = document.getElementById("citySearch").value;

    //clean up input from search form
    city = city.trim();
    cityArray = city.split(" ");
    city = "";

    for (let i = 0; i < cityArray.length; i++) {
        cityArray[i] = titleCaseCity(cityArray[i]);
        city = city + cityArray[i] + " ";
    }
    
    city = city.trim();
    getCurrentWeather(city);

});

function titleCaseCity(string) {
    string.toLowerCase();
    return string[0].toUpperCase() + string.slice(1);
}

function getCurrentWeather(city) {
    var apiUrlcurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=818ca6ea23a62a1b8411f6f523477977&units=imperial';
    
    fetch(apiUrlcurrent).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
       
                var d = new Date(0);
                d.setUTCSeconds(data.dt);

                currentEl.children[0].innerHTML = "<h2>" + city + " (" + d.toLocaleDateString() + `) <img src="http://openweathermap.org/img/wn/` + data.weather[0].icon +`@2x.png" alt="` + data.weather[0].description +`" height="50" width="50"></h2>`;
                currentEl.children[1].children[0].textContent = "Temp:  " + data.main.temp + "1\u00b0F";
                currentEl.children[1].children[1].textContent = "Wind:  " + data.wind.speed + " MPH";
                currentEl.children[1].children[2].textContent = "Humdity:  " + data.main.humidity + "%";
                getUVI(data,city);

                if (addButtons) {
                    updateSearchHistory(city);
                    addButtons = false;
                }

            });
    
        } 
        else {
            //alert('Error fetching current weather data: ' + response.statusText);
            console.log('Error fetching current weather data: ' + response.statusText);
            
        }
    });

}

function getForcast(city) {
    var apiUrlforecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=818ca6ea23a62a1b8411f6f523477977&units=imperial';

    fetch(apiUrlforecast).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                
                var forecastEl = null;
                var d = new Date(0)
                var dataIndex  = 7;
             
                for (let i=0; i < 5;i++,dataIndex+=8,d = new Date(0)){
                    
                    d.setUTCSeconds(data.list[dataIndex].dt);
                    
                    forecastEl = document.querySelector('#date' + i);
                    forecastEl.children[0].children[0].innerHTML = "<h5>" + d.toLocaleDateString() + "</h5>";
                    forecastEl.children[0].children[1].innerHTML = `<img src="http://openweathermap.org/img/wn/` + data.list[dataIndex].weather[0].icon +`@2x.png" alt="` + data.list[dataIndex].weather[0].description +`" height="50" width="50">`;
                    forecastEl.children[0].children[2].textContent = "Temp: " + data.list[dataIndex].main.temp + "1\u00b0F";;
                    forecastEl.children[0].children[3].textContent = "Wind: " + data.list[dataIndex].wind.speed + " MPH";
                    forecastEl.children[0].children[4].textContent = "Humidity: " + data.list[dataIndex].main.humidity + "%";
                               
                }
                
            });

        } 
        else {
            // alert('Error fetching forecast data: ' + response.statusText);
            console.log('Error fetching forecast data: ' + response.statusText);
          
        }
    });

}

function getUVI(response,city) {
    var apiUrluvi = 'https://api.openweathermap.org/data/2.5/uvi?&lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&appid=818ca6ea23a62a1b8411f6f523477977';
    
    fetch(apiUrluvi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var uviColor = "bg-secondary";
                if (0 <= Number(data.value) < 1){
                    uviColor = "bg-success";
                }
                else if (Number(data.value) < 3.6){
                    uviColor = "bg-warning";
                }
                else if (3.6 <= Number(data.value)){
                    uviColor = "bg-danger";
                }
                else {
                    console.log("Error: Color value not found defaulting to gray")
                }
                currentEl.children[1].children[3].innerHTML = `UV Index: <span class="` + uviColor + ` text-white uvi d-inline-flex justify-content-center">` + data.value + `</span>`;
                getForcast(city);
                
            });
        }
        else {

            //alert('Error fetching UVI: ' + response.statusText);
            console.log('Error fetching UVI: ' + response.statusText);

        }
    }); 
}

function addHistoryButtons(){
    
    while (searchHistoryEl.children[0].hasChildNodes()) {
        searchHistoryEl.children[0].removeChild(searchHistoryEl.children[0].firstChild);
    }

    for (let i = citiesArray.length - 1; i > -1; i--) {
        var li = document.createElement("li");

        li.innerHTML = `<button class="btn searchHistory">` + citiesArray[i] + `</button>`;
        searchHistoryEl.children[0].appendChild(li);
    }
    
    for (i=0;i < searchHistoryEl.children[0].childElementCount;i++){

        searchHistoryEl.children[0].children[i].children[0].addEventListener("click", function (event){
            event.preventDefault();
            event.stopPropagation();

            getCurrentWeather(this.textContent);
            getForcast(this.textContent);
        
        });

    }
        
}

function updateSearchHistory(city){

    if (!(citiesArray.includes(city))) {
        if (citiesArray.length === 8){

            citiesArray.shift();
            citiesArray.push(city);
        }
        else {
            citiesArray.push(city);
        }

        localStorage.setItem("searchHistory", JSON.stringify(citiesArray));
    }

    formEl.children[1].placeholder = city;

    addHistoryButtons();
}

function getHistory() {
    var emptyArray = [];
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    
    if (searchHistory === null) {
        localStorage.setItem("searchHistory", JSON.stringify(emptyArray));
        return emptyArray;
    }
    
    return searchHistory;
}


