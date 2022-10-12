API_KEY = "bd16f5ef224423a097f3ef14062bba6a";
var geoLocate = 'http://api.openweathermap.org/geo/1.0/direct?q=${city name},${state code},${country code}&limit=${limit}&appid=${API key}'
var addressForm = $("#addressForm")

addressForm.on('click', function(target){
    target.preventDefault();
    geoEndpoint($('#inputAddress').val());
});

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
        console.log(data);
    })
    .catch(console.error);
}