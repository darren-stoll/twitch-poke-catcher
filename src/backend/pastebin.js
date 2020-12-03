const axios = require('axios');
// require('dotenv').config();
var FormData = require('form-data');
var data = new FormData();
data.append('api_dev_key', process.env.PASTEBIN_KEY);
data.append('api_option', 'paste');


const pastebin = (text) => {
  data.append('api_paste_code', text);
  var config = {
    method: 'post',
    url: 'https://pastebin.com/api/api_post.php',
    headers: { 
      ...data.getHeaders()
    },
    data : data
  };
  
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}



module.exports = pastebin;