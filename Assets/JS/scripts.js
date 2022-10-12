API_KEY = "bd16f5ef224423a097f3ef14062bba6a";
var addressForm = $("#addressForm");
var results = $("#resultColumn");

addressForm.on('click', function(target){
    target.preventDefault();
    // only proceed there is a valid string
    if($('#inputAddress').val())
        geoEndpoint($('#inputAddress').val());
});


// Valid City Name
// Invalid City Name
// empty String
function geoEndpoint(name, state="", country="", limit="", apiKey = API_KEY)
{
    var geoLocate = 'http://api.openweathermap.org/geo/1.0/direct?q=';
    if(name)
        geoLocate = geoLocate + name;

    geoLocate = geoLocate + ",&appid=" + apiKey;
    console.log(geoLocate);
    fetch(geoLocate)
    .then((response) => response.json())
    .then((data)=> {
        if(data.length)
        {
            // console.log(data[0].lat);
            // console.log(data[0].lon);
            // console.log("Latitude: " + data[0].lat + "/nLongitude: " + data[0].lon);
            results.text("Latitude: " + data[0].lat + " Longitude: " + data[0].lon);
            forecastEndpoint(data[0].lat,data[0].lon);
        }
        else
        {
            results.text("This city doesn't exist.  Try again");
        }
        
    })
    .catch(console.error);
}

function forecastEndpoint(lat,lon,apiKey =API_KEY){

    var forecast = 'https://api.openweathermap.org/data/2.5/forecast?cnt=5&lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    console.log(forecast);
    fetch(forecast)
    .then((response) => response.json())
    .then((data)=> {
        console.log(data);
    })
    .catch(console.errror);
}