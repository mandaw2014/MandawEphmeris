var DEGREES_PER_HOUR = 360 / 24;

function getDayOfYear(date) {
    return Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 8.64e7);
}

function sinDeg(deg) {
    return Math.sin((deg * 2.0 * Math.PI) / 360.0);
}

function acosDeg(x) {
    return (Math.acos(x) * 360.0) / (2 * Math.PI);
}

function asinDeg(x) {
    return (Math.asin(x) * 360.0) / (2 * Math.PI);
}

function tanDeg(deg) {
    return Math.tan((deg * 2.0 * Math.PI) / 360.0);
}

function cosDeg(deg) {
    return Math.cos((deg * 2.0 * Math.PI) / 360.0);
}

function mod(a, b) {
    var result = a % b;
    if (result < 0)
        result += b;
    return result;
}

function calculate(lat, lng, sunrise, zenith) {
    if (zenith === void 0) { 
        zenith = 90.8333; 
    }

    var date = new Date();

    if (!zenith)
        zenith = 90.8333;
    var hoursFromMeridian = lng / DEGREES_PER_HOUR, dayOfYear = getDayOfYear(date), approxTimeOfEventInDays, sunMeanAnomaly, sunTrueLongitude, ascension, rightAscension, lQuadrant, raQuadrant, sinDec, cosDec, localHourAngle, localHour, localMeanTime, time;
    
    if (sunrise)
        approxTimeOfEventInDays = dayOfYear + (6 + hoursFromMeridian) / 24;
    else
        approxTimeOfEventInDays = dayOfYear + (18.0 - hoursFromMeridian) / 24;
    
    sunMeanAnomaly = 0.9856 * approxTimeOfEventInDays - 3.289;
    sunTrueLongitude = sunMeanAnomaly + 1.916 * sinDeg(sunMeanAnomaly) + 0.02 * sinDeg(2 * sunMeanAnomaly) + 282.634;
    ascension = 0.91764 * tanDeg(sunTrueLongitude);
    rightAscension = (360 / (2 * Math.PI)) * Math.atan(ascension);
    rightAscension = mod(rightAscension, 360);
    lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
    raQuadrant = Math.floor(rightAscension / 90) * 90;
    rightAscension = rightAscension + (lQuadrant - raQuadrant);
    rightAscension /= DEGREES_PER_HOUR;
    sinDec = 0.39782 * sinDeg(sunTrueLongitude);
    cosDec = cosDeg(asinDeg(sinDec));
    var cosLocalHourAngle = (cosDeg(zenith) - sinDec * sinDeg(lat)) / (cosDec * cosDeg(lat));
    localHourAngle = acosDeg(cosLocalHourAngle);
    
    if (sunrise)
        localHourAngle = 360 - localHourAngle;
    
    localHour = localHourAngle / DEGREES_PER_HOUR;
    localMeanTime = localHour + rightAscension - 0.06517 * approxTimeOfEventInDays - 6.622;
    time = localMeanTime - lng / DEGREES_PER_HOUR;
    time = mod(time, 24);
    var localHourAngleReverse = 360 - localHourAngle;
    var localHourReverse = localHourAngleReverse / DEGREES_PER_HOUR;
    var localMeanTimeReverse = localHourReverse + rightAscension - 0.06571 * approxTimeOfEventInDays - 6.622;
    var timeReverse = localMeanTimeReverse - lng / DEGREES_PER_HOUR;
    timeReverse = mod(timeReverse, 24);
    var midnight = new Date(0);
    midnight.setUTCFullYear(date.getUTCFullYear());
    midnight.setUTCMonth(date.getUTCMonth());
    midnight.setUTCDate(date.getUTCDate());
    var milli = midnight.getTime() + time * 60 * 60 * 1000;
    var calculatedTime = new Date(milli);
    var calculatedTimeReverse = new Date(midnight.getTime() + timeReverse * 60 * 60 * 1000);
    var calculatedTimeTest = calculatedTime;
    var calculatedTimeReverseTest = calculatedTimeReverse;
    
    for (var i = 0; i < 3; i++) {
        if ((calculatedTimeTest > date && date > calculatedTimeReverseTest) ||
            (calculatedTimeTest < date && date < calculatedTimeReverseTest)) {
            calculatedTime = calculatedTimeTest;
            break;
        }

        else if (i === 0) {
            calculatedTimeTest = new Date(calculatedTime.getTime() - 24 * 60 * 60 * 1000);
            
            if (Math.abs(calculatedTimeReverseTest.getTime() - calculatedTimeTest.getTime()) > 24 * 60 * 60 * 1000) {
                calculatedTimeTest = calculatedTime;
            }
        }

        else if (i === 1) {
            calculatedTimeTest = new Date(calculatedTime.getTime() + 24 * 60 * 60 * 1000);
            
            if (Math.abs(calculatedTimeReverseTest.getTime() - calculatedTimeTest.getTime()) > 24 * 60 * 60 * 1000) {
                calculatedTimeTest = calculatedTime;
            }
        }
    }

    return (calculatedTime.getHours() + ":" + calculatedTime.getMinutes());
}

export function getSunrise(lat, lng, zenith) {
    return calculate(lat, lng, true, zenith);
}

export function getSunset(lat, lng, zenith) {
    return calculate(lat, lng, false, zenith);
}

