API_KEY = "bd16f5ef224423a097f3ef14062bba6a";
var addressForm = $("#addressForm");
var searchHistory = $("#cityList");
var fiveDayForecast = $('#5dayForecast');

function populateList(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if(storedCities)
    {
        searchHistory.empty();
        for( const[name, location] of Object.entries(storedCities)){
            let cityBtn = $('<btn>')
            cityBtn.addClass('btn btn-secondary my-1')
            cityBtn.attr("data-lon", location.lon)
            cityBtn.attr("data-lat", location.lat)
            cityBtn.text(name);
            searchHistory.append(cityBtn)
        }
    }
}

searchHistory.on('click', function(event){
    event.preventDefault();
    let object = event.target
    forecastEndpoint(object.dataset.lat,object.dataset.lon);
})

addressForm.on('click', function(target){
    target.preventDefault();
    // only proceed there is a valid string
    if($('#inputAddress').val()){
        geoEndpoint($('#inputAddress').val())
        $('#inputAddress').val('')
    }
        
            // geoEndpoint($('#inputAddress').val()
            // );
});


// Valid City Name
// Invalid City Name
function geoEndpoint(name, apiKey = API_KEY)
{
    var endpoint = `http://api.openweathermap.org/geo/1.0/direct?q="${name}"&appid=${API_KEY}`;
    fetch(endpoint)
    .then((response) => response.json())
    .then((data)=> {
        if(data.length == 0)
        // Can upgrade to a bootstrap model
            alert("no city found");
        else{
            let name = data[0].name;
            let lat = data[0].lat;
            let lon = data[0].lon;
            let cities = JSON.parse(localStorage.getItem("cities"));
            if(cities)
                cities[name] ={lat:lat,lon:lon};
            else{
                cities = { [name]:{lat:lat,lon:lon}}
            }

            localStorage.setItem("cities", JSON.stringify(cities));
            populateList();
            forecastEndpoint(lat,lon);
        }
            
            
    })
    .catch((err)=>{
        console.log(err)
    });
}

function forecastEndpoint(lat,lon,apiKey = API_KEY){
    console.log("testing forecast")
    var forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(forecast)
    .then((response) => response.json())
    .then((data)=> {
        $('#currentCityName').text(data.city.name)
        let date = new Date(data.list[0].dt * 1000)
        $('#currentDate').text('(' + date.toLocaleDateString("en-US") + ")");
        let link = data.list[0].weather[0].icon
        $('#currentWeatherCondition').attr("src", `http://openweathermap.org/img/wn/${link}@2x.png`)
        $('#currentTemp').text((((data.list[0].main.temp-273.15) * 9/5) + 32).toPrecision(4) + "°F")
        $('#currentWind').text(data.list[0].wind.speed + " MPH")
        $('#currentHumidity').text(data.list[0].main.humidity +" %")
        populateForecast(data.list);
    })
    .catch((err)=>{
        console.log(err);
    });
}

function populateForecast(list){
    fiveDayForecast.empty();
    let title = $('<h3>')
    title.text('5 Day Forecast')
    title.addClass('mt-2')
    fiveDayForecast.append(title);
    let flexCast = $('<div>')
    flexCast.addClass('d-flex justify-content-around flex-wrap')
    for(let i = 0; i < list.length; i+=8)
    {   
        let day = list[i];
        let card = $('<div>')
        card.addClass('card')
        let body = $('<div>')
        body.addClass('card-body')
        let header = $('<h5>')
        header.addClass('card-title')
        let date = new Date(day.dt * 1000)
        header.text('(' + date.toLocaleDateString("en-US") + ")")
        card.append(header);
        let icon = $('<img>')
        let link = day.weather[0].icon
        icon.attr("src", `http://openweathermap.org/img/wn/${link}@2x.png`)
        card.append(icon);
        let temp = $('<p>')
        temp.text("Temp: " + (((day.main.temp-273.15) * 9/5) + 32).toPrecision(4) + "°F")
        let wind = $('<p>')
        wind.text("Wind: " + day.wind.speed + " MPH")
        let humidity = $('<p>')
        humidity.text("Humidity: " + day.main.humidity +" %")
        card.append(temp)
        card.append(wind)
        card.append(humidity)
        flexCast.append(card);
        console.log(day);
    
    }
    fiveDayForecast.append(flexCast);
}
populateList();