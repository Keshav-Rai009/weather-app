import React, { useEffect, useState } from "react";
import WeatherIcon from "../assets/WeatherIcon.gif";
import config from "../config";
import Clock from "react-live-clock";
import ReactAnimatedWeather from "react-animated-weather";
import WeatherForcast from "./WeatherForecast";

const formatDate = (currDate) => {
  //console.log(currDate);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[currDate.getDay()];
  const date = currDate.getDate();
  const month = months[currDate.getMonth()];
  let year = currDate.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaultState = {
  lat: undefined,
  lon: undefined,
  errorMessage: undefined,
  temperatureC: undefined,
  temperatureF: undefined,
  city: undefined,
  country: undefined,
  humidity: undefined,
  description: undefined,
  icon: "CLEAR_DAY",
  sunrise: undefined,
  sunset: undefined,
  errorMsg: undefined,
  locationAllowed: false,
};

let timerID;

export default function UserLocation() {
  const [weatherState, setWeatherState] = useState(defaultState);

  useEffect(() => {
    async function fetchLocation() {
      if (navigator.geolocation) {
        try {
          const position = await getPosition();
          await getWeather(position.coords.latitude, position.coords.longitude);
          setWeatherState((weatherState) => ({
            ...weatherState,
            locationAllowed: true,
          }));
        } catch (error) {
          //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
          await getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        }
      } else {
        setWeatherState((weatherState) => ({
          ...weatherState,
          locationAllowed: false,
        }));
        alert("Geolocation not available....");
      }

      // keep updating the weather
      timerID = setInterval(
        () => getWeather(weatherState.lat, weatherState.lon),
        60 * 1000
      );
    }
    fetchLocation();

    // returned function will be called on component unmount
    return () => {
      clearInterval(timerID);
    };
  }, []);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const response = await fetch(
      `${config.BASE_URL}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${config.API_KEY}`
    );
    //
    const data = await response?.json();

    setWeatherState((weatherState) => ({
      ...weatherState,
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data?.main?.temp),
      temperatureF: Math.round(data?.main?.temp * 1.8 + 32),
      humidity: data?.main?.humidity,
      main: data?.weather?.[0]?.main,
      country: data?.sys?.country,
      // sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),

      // sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
    }));

    switch (weatherState.main) {
      case "Haze":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "CLEAR_DAY",
        }));
        break;
      case "Clouds":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "CLOUDY",
        }));
        break;
      case "Rain":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "RAIN",
        }));
        break;
      case "Snow":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "SNOW",
        }));
        break;
      case "Dust":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "WIND",
        }));
        break;
      case "Drizzle":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "SLEET",
        }));
        break;
      case "Fog":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "FOG",
        }));
        break;
      case "Smoke":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "FOG",
        }));
        break;
      case "Tornado":
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "WIND",
        }));
        break;
      default:
        setWeatherState((weatherState) => ({
          ...weatherState,
          icon: "CLEAR_DAY",
        }));
    }
  };

  return weatherState.locationAllowed ? (
    <>
      <div className="card-container">
        <div className="card-title" style={{ color: "white" }}>
          {/* <div class="row d-flex justify-content-center align-items-center h-100"> */}
          {/* <div class="col-md-12 col-xl-10"> */}
          <h2>{weatherState.city || "Bengaluru"}</h2>
          <h3>{weatherState.country || "IN"}</h3>
        </div>
        {/* <div className="mb-icon">
          {" "}
          <ReactAnimatedWeather
            icon={weatherState.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p>{weatherState.main}</p>
        </div> */}
        <div className="date-time" style={{ color: "white" }}>
          <div className="dmy">
            <div id="txt"></div>
            <div className="current-time">
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="current-date">{formatDate(new Date())}</div>
          </div>
          <div className="temperature">
            <p>
              {weatherState.temperatureC || "30"}°<span>C</span>
            </p>
          </div>
        </div>
      </div>
      <WeatherForcast icon={weatherState.icon} weather={weatherState.main} />
      {/* </div>
      </div> */}
    </>
  ) : (
    <>
      <div className="w-container">
        <img
          src={WeatherIcon}
          style={{ width: "50%", WebkitUserDrag: "none" }}
          alt=""
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </div>
    </>
  );
}
