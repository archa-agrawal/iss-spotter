const request = require('request-promise-native');


const fetchMyIP = () => {
  return request('https://pi.ipify.org?format=json');
};
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};
const fetchISSFlyOverTimes = (body) => {
  const parsedObj = JSON.parse(body);
  const coordObj = {latitude: parsedObj.latitude, longitude: parsedObj.longitude};
  return request(`https://iss-pass.herokuapp.com/json/?lat=${coordObj.latitude}&lon=${coordObj.longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const parsedData = JSON.parse(data);
      return parsedData.response;
    });
};

module.exports = nextISSTimesForMyLocation;