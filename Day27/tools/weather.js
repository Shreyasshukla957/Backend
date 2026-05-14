async function weather({ place }) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=${place}&aqi=no`,
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

module.exports = weather;
