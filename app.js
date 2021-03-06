let searchbox = document.querySelector('.search-box')
var key = "83016fd0bbca8249b18aa33eb1ce64ad"
var cities = new Array()

if(navigator.serviceWorker){
   navigator.serviceWorker.register("sw.js");
}

searchbox.addEventListener('keypress', setSearch);

function setSearch (evt){
    //enter button is 13
    if(evt.keyCode == 13){
        searchboxQuery(searchbox.value)
}
};

const searchboxQuery =  (query) => {
    console.log(query)
    let city = query

    var api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    
    fetch(api)
    .then(data => {
        return data.json()
    }).then(weather => {
        if(weather.cod == "200"){
            console.log('yes')
            var result = `<div class="result">
            <h3 id="location">${weather.name}<span id="country">${weather.sys.country}</span></h3>
            <h4 id="wind">Wind: ${weather.wind.speed} km/ hr</h4> 
            <h4 id="max-temperature">Max Temperature: ${weather.main.temp} &deg;C</h4>   
            <h4 id="date">${weather.weather[0].description}</h4> 
            </div>`
            console.log(result)
            cities.push(weather.id)
            document.querySelector('.resultx').innerHTML += result
            console.log(weather)
            if(typeof(Storage) !== "undefined"){
                localStorage.setItem(weather.id, JSON.stringify(weather))
                localStorage.setItem("cities", JSON.stringify(cities))
            }
            
    
        }else{
            console.log("Error occured " + weather.message)
        }
    }).catch(err => {
        console.log(err)
    })
    }

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        
        console.log(long, lat)
        var api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${key}&units=metric`

fetch(api)
.then(data => {
    return data.json()
}).then(weather => {
    console.log(weather)
    if(weather.cod == "200"){
        if(typeof(Storage) !== "undefined"){
            localStorage.setItem("currentLocation", JSON.stringify(weather))
        }
        document.querySelector('#ls-max-temp').innerHTML = weather.list[Math.floor(Math.random()*40)].main.temp_min + " &deg;C"
        document.querySelector('#ls-min-temp').innerHTML = weather.list[Math.floor(Math.random()*40)].main.temp_max + " &deg;C"
        document.querySelector('#ls-rain').innerHTML = weather.list[Math.floor(Math.random()*40)].weather[0].description
        document.querySelector('#ls-visibility').innerHTML = weather.list[Math.floor(Math.random()*40)].main.humidity + " %"
        document.querySelector('#ls-wind').innerHTML = weather.list[Math.floor(Math.random()*40)].wind.speed + " km /hr"
        document.querySelector('#ls-city').innerHTML = weather.city.name + " " + weather.city.country

    }else{
        console.log("Error occured " + weather.message)
    }
}).catch(err => {
    console.log(err)
})
    })
}

var lscities = JSON.parse(localStorage.getItem("cities"))

console.log(lscities)
lscities.forEach(place =>{
            var weather = localStorage.getItem(place);
            weather = JSON.parse(weather)
            console.log(weather)
            var result = `<div class="p-result">
            <h3 id="location">${weather.name}<span id="country">${weather.sys.country}</span></h3>
            <h4 id="wind">Wind: ${weather.wind.speed}</h4> 
            <h4 id="max-temperature">Max Temperature: ${weather.main.temp} &deg;F</h4>   
            <h4 id="date">${weather.weather[0].description}</h4> 
            
            <hr>
            </div>`

            document.querySelector('.p-results').innerHTML += result
})


