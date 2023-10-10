
API_KEY = "6f020d1e5504c152772885e0fa19b151";

async function getCurrentWeather(lat, lon){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`, {mode: "cors"});
        const weatherData = await response.json();
        return weatherData
    } catch{}
}

async function getCoordinates(name){
    try{
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`, {mode: "cors"});
        const data = await response.json();
        const latLon = {
            lat: data[0].lat,
            lon: data[0].lon,
        }
        return latLon;
    } catch {}
}

async function weather(name){
    try{
        const coordinates = getCoordinates(name);
        const data = await getCurrentWeather( (await coordinates).lat, (await coordinates).lon );

        const namelocation =  data.name;
        const countryCode = data.sys.country;
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        return {
            namelocation,
            countryCode,
            description,
            temperature,
            feelsLike,
            windSpeed,
            humidity
        }

    } catch {
        return "error"
    }
}

const renderWeatherComponent = (weatherObj) => {

    const main = document.createElement("main");
    document.querySelector("body").appendChild(main);

    const locationName = document.createElement("h1");
    locationName.id = 'location';
    locationName.textContent = `${weatherObj.namelocation}, ${weatherObj.countryCode}`;
    main.appendChild(locationName)

    const description = document.createElement("h2");
    description.id = "description";
    description.textContent =  `${weatherObj.description}`;
    main.appendChild(description);

    const bottomContainer = document.createElement("div");
    bottomContainer.id = "buttomContainer";
    main.appendChild(bottomContainer);

    const leftSide = document.createElement("div");
    leftSide.id = "leftSide";
    bottomContainer.appendChild(leftSide);

    const temperature = document.createElement("h2");
    temperature.id = "temperature";
    temperature.textContent = `${weatherObj.temperature}`;
    leftSide.appendChild(temperature);

    const units = document.createElement("h4");
    units.id = "units";
    units.textContent = "K";
    leftSide.appendChild(units);

    const rightSide = document.createElement("div");
    rightSide.id = "rightSide";
    bottomContainer.appendChild(rightSide);

    const feelsLike = document.createElement("p");
    feelsLike.id = "feelsLike";
    feelsLike.textContent = `Feels like: ${weatherObj.feelsLike} K`;
    rightSide.appendChild(feelsLike);

    const windspeed = document.createElement("p");
    windspeed.id = "wind";
    windspeed.textContent = `Wind: ${weatherObj.windspeed}`;
    rightSide.appendChild(windspeed);

    const humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.textContent = `Humidity: ${weatherObj.humidity}%`;
    rightSide.appendChild(humidity)

}

async function renderer (weatherObject, first = false){

    const weatherData = await weatherObject;

    if (first == true){
        renderWeatherComponent(weatherData);
    } else {
        document.querySelector("main").remove();
        document.querySelector("input").value == "";
        renderWeatherComponent(weatherData);
    }
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderer(weather(document.querySelector("input").value));
})

renderer(weather("lyon"), true)