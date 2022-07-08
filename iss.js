const request = require('request');


const fetchMyIp = (cb) => {
  request('https://api.ipify.org?format=json', (err, response, body) => {
    if (err) {
      cb(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      cb(err(msg), null);
      return;
    }
    let ip;
    ip = JSON.parse(body);
    ip = ip.ip;
    
    cb(err, ip);
  });
};

const fetchCoordsByIP = (ip, cb) => {
  const url = "http://ipwho.is/" + ip;
  request(url, (err, response, body) => {
    
    if (err) {
      let errorMsg = 'invalid url';
      cb(errorMsg);
      return;
    }
    
    let data = JSON.parse(body);
    if (data.success) {
      let dataObj = {latitude: data.latitude, longitude: data.longitude};
      cb(err, dataObj);
      return;
    }
    let error = `It didn't work! Error: Success status was false. Server message says: Invalid IP address when fetching for IP ${ip}`;
    cb(error);
  });

};

const fetchISSFlyOverTimes = (coordObj, cb) => {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coordObj.latitude}&lon=${coordObj.longitude}`;
  request(url, (err, response, body) => {
    if (err) {
      let errMsg = 'something went wrong';
      cb(errMsg, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover time.`;
      cb(msg, null);
      return;
    }
    const parsedBody = JSON.parse(body);
    const flyOverTime = parsedBody.response;
    cb(err, flyOverTime);
  });
};

const nextISSTimesForMyLocation = (cb) => {
  fetchMyIp((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    fetchCoordsByIP(ip, (error, dataObj) => {
      if (error) {
        console.log(error);
        return;
      }
      fetchISSFlyOverTimes(dataObj, (error, data) => {
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
        console.log(data);
      });
    });
  });
};

module.exports = nextISSTimesForMyLocation;