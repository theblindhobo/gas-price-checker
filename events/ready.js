const { routinelyCheck } = require('../functions/gas.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}.`);

    routinelyCheck();

  },
};
