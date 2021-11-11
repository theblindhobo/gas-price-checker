const fetch = require('node-fetch');
const { client } = require('../index.js');

const { theblindhobo } = require('../config.json');
const { channelId } = require('../config.json');

require('dotenv').config();


let timeout = false;
const removeTimeout = () => {
  timeout = false;
};


const checkGasPrices = async () => {
  if(!timeout) {
    // check price
    await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        let fastGas = data.result.FastGasPrice;
        if(fastGas < 81) {
          timeout = true;
          setTimeout(removeTimeout, 15 * 60 * 1000); // 15mins
          client.channels.cache.get(channelId.gasPrices)
            .send(`<@${theblindhobo}> Fast Gas is **${fastGas}** gwei right now!`);
        }
      })
      .catch(error => console.log(error.message));
  }
};


const routinelyCheck = async () => {
  try {
    await checkGasPrices();
    await setTimeout(routinelyCheck, 1000);
  } catch(error) {
    console.log(error);
  }
};

module.exports = { routinelyCheck };
