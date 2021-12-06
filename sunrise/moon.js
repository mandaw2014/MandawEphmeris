let PI   = Math.PI,
    sin  = Math.sin,
    cos  = Math.cos,
    tan  = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad  = PI / 180;

let dayMs = 1000 * 60 * 60 * 24, J1970 = 2440588, J2000 = 2451545;

let e = rad * 23.4397;

function toJulian(date) {
    return date.valueOf() / dayMs - 0.5 + J1970;
}

function fromJulian(j) {
    return new Date((j + 0.5 - J1970) * dayMs);
}

function toDays(date) {
    return toJulian(date) - J2000;
}

function rightAscension(l, b) {
    return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
}

function declination(l, b) {
    return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}

function azimuth(H, phi, dec) {
    return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}

function altitude(H, phi, dec) {
    return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

function siderealTime(d, lw) {
    return rad * (280.16 + 360.9856235 * d) - lw;
}

function astroRefraction(h) {
    if(h < 0)
        h = 0;
    
    return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

function moonCoords(d) {
    let L = rad * (218.316 + 13.176396 * d),
        M = rad * (134.963 + 13.064993 * d),
        F = rad * (93.272 + 13.229350 * d),

        l  = L + rad * 6.289 * sin(M),
        b  = rad * 5.128 * sin(F),
        dt = 385001 - 20905 * cos(M);

    return {
        ra: rightAscension(l, b),
        dec: declination(l, b),
        dist: dt
    };
}

function hoursLater(date, h) {
    return new Date(date.valueOf() + h * dayMs / 24);
}

function getMoonPosition(date, lat, lng) {
    let lw = rad * -lng,
        phi = rad * lat,
        d = toDays(date),

        c = moonCoords(d),
        H = siderealTime(d, lw) - c.ra,
        h = altitude(H, phi, c.dec),
        
        pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

    h = h + astroRefraction(h);

    return {
        azimuth: azimuth(H, phi, c.dec),
        altitude: altitude(H, phi, c.dec),
        distance: c.dist,
        paralliticAngle: pa
    };
}

function calculate(date, lat, lng, inUTC) {
    let t = new Date(date);
    if(inUTC)
        t.setUTCHours(0, 0, 0, 0);
    else
        t.setHours(0, 0, 0, 0);
    
    let hc = 0.133 * rad,
        h0 = getMoonPosition(t, lat, lng).altitude - hc,
        h1, h2, rise, set, a, b, xe, ye, d, roots, x1, x2, dx;

    for(let i = 1; i <= 24; i += 2) {
        h1 = getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
        h2 = getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

        a = (h0 + h2) / 2 - h1;
        b = (h2 - h0) / 2;
        xe = -b / (2 * a);
        ye = (a * xe + b) * xe + h1;
        d = b * b - 4 * a * h1;
        roots = 0;

        if(d >= 0) {
            dx = Math.sqrt(d) / (Math.abs(a) * 2);
            x1 = xe - dx;
            x2 = xe + dx;
            if(Math.abs(x1) <= 1) 
                roots++;
            if(Math.abs(x2) <= 1)
                roots++;
            if(x1 < -1)
                x1 = x2;
        }

        if(roots === 1) {
            if(h0 < 0)
                rise = i + x1;
            else
                set = i + x1;
        }
        else if(roots === 2) {
            rise = i + (ye < 0 ? x2 : x1);
            set = i + (ye < 0 ? x1 : x2);
        }

        if(rise && set)
            break;

        h0 = h2;
    }

    let result = {};

    if(rise)
        result.rise = hoursLater(t, rise);
    if(set)
        result.set = hoursLater(t, set);

    if(!rise && !set)
        result[ye > 0 ? "alwaysUp" : "alwaysDown"] = true;
    
    return result;
}

export function getMoonrise(date, lat, lng) {
    return (calculate(date, lat, lng, true).rise.getHours() + ":" + calculate(date, lat, lng, true).rise.getMinutes());
}

export function getMoonset(date, lat, lng) {
    return (calculate(date, lat, lng, true).set.getHours() + ":" + calculate(date, lat, lng, true).set.getMinutes());
}

export class Moon {
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