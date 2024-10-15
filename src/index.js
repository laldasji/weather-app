import './style.css';
import './style2.css';

import clearDay from "./images/WeatherIcons/clear-day.svg";
import clearNight from "./images/WeatherIcons/clear-night.svg";
import cloudy from "./images/WeatherIcons/cloudy.svg";
import fog from "./images/WeatherIcons/fog.svg";
import hail from "./images/WeatherIcons/hail.svg";
import partlyCloudyDay from "./images/WeatherIcons/partly-cloudy-day.svg";
import partlyCloudyNight from "./images/WeatherIcons/partly-cloudy-night.svg";
import rainSnowShowersDay from "./images/WeatherIcons/rain-snow-showers-day.svg";
import rainSnowShowersNight from "./images/WeatherIcons/rain-snow-showers-night.svg";
import rainSnow from "./images/WeatherIcons/rain-snow.svg";
import rain from "./images/WeatherIcons/rain.svg";
import showersDay from "./images/WeatherIcons/showers-day.svg";
import showersNight from "./images/WeatherIcons/showers-night.svg";
import sleet from "./images/WeatherIcons/sleet.svg";
import snowShowersDay from "./images/WeatherIcons/snow-showers-day.svg";
import snowShowersNight from "./images/WeatherIcons/snow-showers-night.svg";
import snow from "./images/WeatherIcons/snow.svg";
import thunderRain from "./images/WeatherIcons/thunder-rain.svg";
import thunderShowersDay from "./images/WeatherIcons/thunder-showers-day.svg";
import thunderShowersNight from "./images/WeatherIcons/thunder-showers-night.svg";
import thunder from "./images/WeatherIcons/thunder.svg";
import wind from "./images/WeatherIcons/wind.svg";

let icon = {
    "clear-day" : clearDay,
    "clear-night" : clearNight,
    "cloudy" : cloudy,
    "fog" : fog,
    "hail" : hail,
    "partly-cloudy-day" : partlyCloudyDay,
    "partly-cloudy-night" : partlyCloudyNight,
    "rain-snow-showers-day" : rainSnowShowersDay,
    "rain-snow-showers-night" : rainSnowShowersNight,
    "rain-snow" : rainSnow,
    "rain" : rain,
    "showers-day" : showersDay,
    "showers-night" : showersNight,
    "sleet" : sleet,
    "snow-showers-day" : snowShowersDay,
    "snow-showers-night" : snowShowersNight,
    "snow" : snow,
    "thunder-rain" : thunderRain,
    "thunder-showers-day" : thunderShowersDay,
    "thunder-showers-night" : thunderShowersNight,
    "thunder" : thunder,
    "wind" : wind,
};

const getSearchResponse = document.querySelector('#getSearchResponse');
const inputSearchLocation = document.querySelector('#inputSearchLocation');

const showError = document.querySelector('#showError');
const currentWeather = document.querySelector('#currentWeather');
const futureWeather = document.querySelector('#futureWeather');

function displayDataInHTML(displayVal) {
    const image = document.createElement('img');
    image.src = `${icon[displayVal.currentConditions.icon]}`;
    currentWeather.textContent = '';
    currentWeather.appendChild(image);
    let information = [
        `<b>${displayVal.resolvedAddress}</b>`,
        `<i>Last Updated: ${displayVal.currentConditions.datetime} hrs</i>`,
        `${displayVal.days[0].description}`,
        `Current Temperature: ${displayVal.currentConditions.temp} °C`,
        `Feels like: ${displayVal.currentConditions.feelslike} °C`,
        `Humidity: ${displayVal.currentConditions.humidity}%`,
        `Probability of Precipitation: ${displayVal.currentConditions.precipprob}%`,
        `Snow: ${displayVal.currentConditions.snow} cm`,
        `Snow Depth: ${displayVal.currentConditions.snowdepth} cm`,
        `Wind Speed: ${displayVal.currentConditions.windspeed} km/h`,
        `Air Pressure: ${displayVal.currentConditions.pressure} hPa`,
        `Cloud Cover: ${displayVal.currentConditions.cloudcover}%`,
        `UV Index : ${displayVal.currentConditions.uvindex}`
    ];
    for (const i in information) {
        const info = document.createElement('p');
        info.innerHTML = information[i];
        currentWeather.appendChild(info);
    }
    console.log("\nNow for the next 7 days!\n");
    futureWeather.textContent = '';
    const headings = [
        ``,
        'Date',
        'MAX',
        'MIN',
        'Feels like',
        'Humidity',
        'Precipitation',
        'Snow'
    ];
    for (const i in headings) {
        const newSpan = document.createElement('span');
        newSpan.classList.add('days');
        newSpan.classList.add('heading');
        newSpan.textContent = headings[i];
        futureWeather.appendChild(newSpan);
    }
    for (let i = 1; i <= 7; i++) {
        let currentDay = displayVal.days[i];
        const date = new Date(currentDay.datetime);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dayImage = document.createElement('img');
        dayImage.src = icon[currentDay.icon];
        futureWeather.appendChild(dayImage);
        const dailyInfo = [
            date.toLocaleDateString('en-US', options),
            `${currentDay.tempmax} °C`,
            `${currentDay.tempmin} °C`,
            `${currentDay.feelslike} °C`,
            `${currentDay.humidity}%`,
            `${currentDay.precipprob}%`,
            `${currentDay.snow} cm`,
        ];
        for (const i in dailyInfo) {
            const newSpan = document.createElement('span');
            newSpan.classList.add('days');
            newSpan.textContent = dailyInfo[i];
            futureWeather.appendChild(newSpan);
        }
    }
}

async function getJSON(inputSearchLocation) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${inputSearchLocation}?unitGroup=metric&include=days%2Ccurrent&key=8PG3SETFKKAR3XY355T4CR5YR&contentType=json`, { mode: 'cors' });
    if (response.status !== 200) {
        switch (response.status) {
            case 400:
                showError.textContent = 'bad request.';
                break;
            case 401:
                showError.textContent = 'unauthorised access';
                break;
            case 404:
                showError.textContent = 'data not found!';
                break;
            case 429:
                showError.textContent = 'too may requests, please try later!';
                break;
            case 500:
                showError.textContent = 'internal server error...';
                break;
        }
        showError.style.display = 'grid';
        throw new Error('Response error!');
    }
    showError.style.display = 'none';
    const displayVal = await response.json();
    displayDataInHTML(displayVal);
}

function getInformation(searchKey) {
    getJSON(searchKey).catch((err) => {
        console.log(err);
        console.log('ERROR HERE! LONG TIME NO SEE');
    });
}

function performSearch() {
    if ((inputSearchLocation.value).length > 1) {
        const searchKey = inputSearchLocation.value;
        getInformation(searchKey);
    }
    else {
        console.log('invalid input!');
    }
}

// add eventListeners
getSearchResponse.addEventListener('click', performSearch);
inputSearchLocation.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') performSearch();
})