import { getMoonrise, getMoonset, Moon } from "./sunrise/moon.js";
import { getSunrise, getSunset } from "./sunrise/sunrise.js";

const dt = new Date();

let d = dt.getDate();
let mt = dt.getMonth();
let y = dt.getFullYear();

const sunriseText = document.getElementById("sunriseText");
const sunsetText = document.getElementById("sunsetText");
const moonriseText = document.getElementById("moonriseText");
const moonsetText = document.getElementById("moonsetText");

navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const sunrise = getSunrise(lat, lng, 90.8333);
    const sunset = getSunset(lat, lng, 90.8333);

    const moonrise = getMoonrise(dt, lat, lng);
    const moonset = getMoonset(dt, lat, lng)

    sunriseText.innerHTML = "Sunrise: " + sunrise + " AM";
    sunsetText.innerHTML = "Sunset: " + sunset + " PM";

    moonriseText.innerHTML = "Moonrise: " + moonrise;
    moonsetText.innerHTML = "Moonset: " + moonset;
});

const moon = new Moon();

const moonPhase = document.getElementById("moonPhaseText");

if (moon.phase(y, mt, d) === "New moon")
    moonPhase.innerHTML = "Moon Phase: New Moon";
else if (moon.phase(y, mt, d) === "Waxing crescent")
    moonPhase.innerHTML = "Moon Phase: Waxing Crescent";
else if (moon.phase(y, mt, d) === "First quarter")
    moonPhase.innerHTML = "Moon Phase: First Quarter";
else if (moon.phase(y, mt, d) === "Waxing gibbous")
    moonPhase.innerHTML = "Moon Phase: Waxing Gibbous";
else if (moon.phase(y, mt, d) === "Full moon")
    moonPhase.innerHTML = "Moon Phase: Full Moon";
else if (moon.phase(y, mt, d) === "Waning gibbous")
    moonPhase.innerHTML = "Moon Phase: Waning Gibbous";
else if (moon.phase(y, mt, d) === "Last quarter")
    moonPhase.innerHTML = "Moon Phase: Last Quarter";
else if (moon.phase(y, mt, d) === "Waning crescent")
    moonPhase.innerHTML = "Moon Phase: Waning Crescent";
