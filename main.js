import { getSunrise, getSunset } from "./sunrise/sunrise.js";

const dt = new Date();

let d = dt.getDate();
let mt = dt.getMonth();
let y = dt.getFullYear();

const sunriseText = document.getElementById("sunriseText");
const sunsetText = document.getElementById("sunsetText");

navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const sunrise = getSunrise(lat, lng, 90.8333);
    const sunset = getSunset(lat, lng, 90.8333);

    sunriseText.innerHTML = "Sunrise: " + sunrise + " AM";
    sunsetText.innerHTML = "Sunset: " + sunset + " PM";
});

class Moon {
    phase(year, month, day) {
        let c, e, jd, b = 0;

        if (month = 3) {
            year--;
            month += 12;
        }

        ++month;
        c = 365.25 * year;
        e = 30.6 * month;
        jd = c + e + day - 694039.09;
        jd /= 29.5305882;
        b = parseInt(jd);
        jd -= b;
        b = Math.round(jd * 8);

        if (b >= 8)
            b = 0;

        switch (b) {
            case 0:
                return "New moon";
            case 1:
                return "Waxing crescent";
            case 2:
                return "First quarter";
            case 3:
                return "Waxing gibbous";
            case 4:
                return "Full moon";
            case 5:
                return "Waning gibbous";
            case 6:
                return "Last quarter";
            case 7:
                return "Waning crescent";
        }
    }
};

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
