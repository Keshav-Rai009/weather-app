import React, { Component } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import config from "../config";

export default class WeatherForcast extends Component {
  constructor(props) {
    super(props);
    this.state = { city: "Delhi", weather: "", error: "" };
  }

  defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  getWeatherForCity = async (city) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}weather?q=${this.state.city}&units=metric&APPID=${config.API_KEY}`
      );
      if (response?.status !== 200) throw response;
      const weatherData = await response?.json();
      this.setState({ weather: weatherData });
    } catch (error) {
      this.setState({
        error: { message: "is not a valid city name", city },
        //weather: null,
      });
      alert("Invalid city : " + this.state.city);
    }
  };

  componentDidMount = (props) => {
    this.getWeatherForCity("Delhi");
  };

  render() {
    return (
      <div className="forecast">
        <div className="forecast-icon">
          <ReactAnimatedWeather
            icon={this.props.icon}
            color={this.defaults.color}
            size={this.defaults.size}
            animate={this.defaults.animate}
          />
        </div>
        <div className="today-weather">
          <h3>{this.props.weather}</h3>
          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Search any city"
              onChange={(e) => this.setState({ city: e.target.value })}
              value={this.state.city}
            />
            <div className="img-box">
              {" "}
              <img
                src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                onClick={this.getWeatherForCity}
                alt=""
              />
            </div>
          </div>
          <ul>
            {this.state.weather?.main ? (
              <div>
                {" "}
                <li className="cityHead">
                  <p>
                    {this.state.weather.name}, {this.state.weather.sys.country}
                  </p>
                  <img
                    className="temp"
                    src={`https://openweathermap.org/img/wn/${this.state.weather.weather[0].icon}.png`}
                    alt=""
                  />
                </li>
                <li>
                  Temperature{" "}
                  <span className="temp">
                    {Math.round(this.state.weather.main.temp)}°c (
                    {this.state.weather.weather[0].main})
                  </span>
                </li>
                <li>
                  Humidity{" "}
                  <span className="temp">
                    {Math.round(this.state.weather.main.humidity)}%
                  </span>
                </li>
                <li>
                  Visibility{" "}
                  <span className="temp">
                    {Math.round(this.state.weather.visibility)} mi
                  </span>
                </li>
                <li>
                  Wind Speed{" "}
                  <span className="temp">
                    {Math.round(this.state.weather.wind.speed)} Km/h
                  </span>
                </li>
              </div>
            ) : (
              <li>
                {this.state.error.city} {this.state.error.message}
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
