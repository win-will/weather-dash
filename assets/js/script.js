var formEl = document.querySelector('#searchForm');
var currentEl = document.querySelector('#currentWeather');
var defaultCity = "Detroit";

getWeatherData (defaultCity);



formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var city = document.getElementById("citySearch").value;
    city = city.trim();
    cityArray = city.split(" ");
    city = "";

    for (let i = 0; i < cityArray.length; i++) {
        cityArray[i] = titleCaseCity(cityArray[i]);
        city = city + cityArray[i] + " ";
    }
    city = city.trim();

    getWeatherData (city);
 });

 function titleCaseCity(string) {
    string.toLowerCase();
    return string[0].toUpperCase() + string.slice(1);
}

function getWeatherData (city) {
    var apiUrlcurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=818ca6ea23a62a1b8411f6f523477977&units=imperial';
    var apiUrlforecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=818ca6ea23a62a1b8411f6f523477977&units=imperial';
     // The 0 there is the key, which sets the date to the epoch
    var currentData = null;
    

    fetch(apiUrlcurrent).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                // console.log(data.dt);
                var d = new Date(0);
                d.setUTCSeconds(data.dt);

                currentEl.children[0].innerHTML = "<h2>" + city + " " + d.toLocaleDateString() + `<img src="http://openweathermap.org/img/wn/` + data.weather[0].icon +`@2x.png" alt="` + data.weather[0].description +`" height="50" width="50"></h2>`;
                currentEl.children[1].children[0].textContent = "Temp:  " + data.main.temp + "1\u00b0F";
                currentEl.children[1].children[1].textContent = "Wind:  " + data.wind.speed + " MPH";
                currentEl.children[1].children[2].textContent = "Humdity:  " + data.main.humidity + "%";

                var apiUrluvi = 'https://api.openweathermap.org/data/2.5/uvi?&lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&appid=818ca6ea23a62a1b8411f6f523477977';
                fetch(apiUrluvi).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                            currentEl.children[1].children[3].textContent = "UV Index:  " + data.value;
                        });
                    }
                    else {

                        alert('Error fetching UVI: ' + response.statusText);
                    }
                });

            });
       

    
        } 
        else {
            alert('Error fetching current weather data: ' + response.statusText);
        }
    });

    fetch(apiUrlforecast).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var d = new Date(0);
                var forecastEl = null;
                var dataIndex = 7;
                // console.log(data.list[dataIndex]);
                for (i=0;i < 5;i++ ){

                    
                    
                    d.setUTCSeconds(data.list[dataIndex].dt);
                    forecastEl = document.querySelector('#date' + i);
                    forecastEl.children[0].children[0].innerHTML = "<h5>" + d.toLocaleDateString() + "</h5>";
                    forecastEl.children[0].children[1].innerHTML = `<img src="http://openweathermap.org/img/wn/` + data.list[dataIndex].weather[0].icon +`@2x.png" alt="` + data.list[dataIndex].weather[0].description +`" height="30" width="30">`;
                    forecastEl.children[0].children[2].textContent = "Temp: " + data.list[dataIndex].main.temp + "1\u00b0F";;
                    forecastEl.children[0].children[3].textContent = "Wind: " + data.list[dataIndex].wind.speed + " MPH";
                    forecastEl.children[0].children[4].textContent = "Humidity: " + data.list[dataIndex].main.humidity + "%";
                    dataIndex+=8;
                    d = new Date(0);

                }
                

                
            });


        } 
        else {
          alert('Error fetching forecast data: ' + response.statusText);
        }
      });


  };

  function getForcastData (city) {
    var apiUrl = 'https:\\api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=818ca6ea23a62a1b8411f6f523477977&units=imperial';
  
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
          });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  };