const fa = document.getElementsByClassName("fa-bars");
const section = document.getElementById("section");

const dt = new Date();
let h = dt.getHours();
let m = dt.getMinutes();

if(m < 10) {
  m = "0" + m;
}

let d = dt.getDate();
let mt = dt.getMonth();
let y = dt.getFullYear();

if(mt === 0) 
  mt = 1;
else if(mt === 1) 
  mt = 2;
else if(mt === 2) 
  mt = 3;
else if(mt === 3) 
  mt = 4;
else if(mt === 4) 
  mt = 5;
else if(mt === 5) 
  mt = 6;
else if(mt === 6) 
  mt = 7;
else if(mt === 7) 
  mt = 8;
else if(mt === 8) 
  mt = 9;
else if(mt === 9) 
  mt = 10;
else if(mt === 10) 
  mt = 11;
else if(mt === 11) 
  mt = 12;

let lat;
let lng;

navigator.geolocation.getCurrentPosition(function(pos) {
  lat = pos.coords.latitude;
  lng = pos.coords.longitude;
});

setTimeout(function SunsetSunrise() {
  const sunriseText = document.getElementById("sunriseText");
  const sunsetText = document.getElementById("sunsetText");

  const locationText = document.getElementById("location");
  const dayLength = document.getElementById("daylength");
  
  const locationMoon = document.getElementById("locationMoon");
  const moonriseText = document.getElementById("moonriseText");
  const moonsetText = document.getElementById("moonsetText");

  const sunUrl = `https://api.ipgeolocation.io/astronomy?apiKey=4bd64ff218d740c5ab3ca43a913b26a9`;

  fetch(sunUrl).then(response => response.json()).then(data => {
    const sunrise = data["sunrise"];

    sunriseText.innerHTML = "Sunrise time: " + sunrise + " AM";

    const sunset = data["sunset"];
    sunsetText.innerHTML = "Sunset time: " + sunset + " PM";

    const day = data["day_length"];
    dayLength.innerHTML = "Day Length: " + day + " hours";

    const location = data["location"]["country_name"];
    locationText.innerHTML = "Sunrise and Sunset Times in " + location + ":";

    locationMoon.innerHTML = "Moonrise and Moonset Times in " + location + ":";

    const moonrise = data["moonrise"];
    const moonset = data["moonset"];
    moonriseText.innerHTML = "Moonrise time: " + moonrise;

    moonsetText.innerHTML = "Moonset time: " + moonset;
  })
  .catch(() => {

  });

  const sunriseNav = document.getElementById("sunriseNav");

  sunriseNav.addEventListener("click", () => {
    window.scrollTo(0, window.innerHeight + 10000);
  })
}, 1000)

var Moon = {
  phase: function(year, month, day) {
    var c = e = jd = b = 0;

    if(month = 3) {
      year--;
      month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    b = parseInt(jd); // int(jd) -> b, take integer part of jd
    jd -= b; // subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); // scale fraction from 0-8 and round

    if(b >= 8) b = 0;

    switch (b) {
      case 0:
        return "New moon";
        break;
      case 1:
        return "Waxing crescent";
        break;
      case 2:
        return "First quarter";
        break;
      case 3:
        return "Waxing gibbous";
        break;
      case 4:
        return "Full moon";
        break;
      case 5:
        return "Waning gibbous";
        break;
      case 6:
        return "Last quarter";
        break;
      case 7:
        return "Waning crescent";
        break;
    }
  }
};

const moonPhase = document.getElementById("moonPhaseText");

if(Moon.phase(y, mt, d) === "New moon")
  moonPhase.innerHTML = "Moon Phase: New Moon";
else if(Moon.phase(y, mt, d) === "Waxing crescent")
  moonPhase.innerHTML = "Moon Phase: Waxing Crescent";
else if(Moon.phase(y, mt, d) === "First quarter")
  moonPhase.innerHTML = "Moon Phase: First Quarter";
else if(Moon.phase(y, mt, d) === "Waxing gibbous")
  moonPhase.innerHTML = "Moon Phase: Waxing Gibbous";
else if(Moon.phase(y, mt, d) === "Full moon")
  moonPhase.innerHTML = "Moon Phase: Full Moon";
else if(Moon.phase(y, mt, d) === "Waning gibbous")
  moonPhase.innerHTML = "Moon Phase: Waning Gibbous";
else if(Moon.phase(y, mt, d) === "Last quarter")
  moonPhase.innerHTML = "Moon Phase: Last Quarter"; 
else if(Moon.phase(y, mt, d) === "Waning crescent")
  moonPhase.innerHTML = "Moon Phase: Waning Crescent";