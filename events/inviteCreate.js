const StateManager = require('../utils/StateManager');
const inviteOn = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
  {
    name: 'inviteCreate',
  },
  module.exports = async (handler, invite) => {
    const isOnss = inviteOn.get(invite.guild.id);
    if (isOnss == "1") {
      StateManager.emit('newInv', invite.guild.id, await invite.guild.fetchInvites())
    } else {
      return;
    }
  }
);
StateManager.on('inviteOn', (guildId, soutienMsgs) => {
  inviteOn.set(guildId, soutienMsgs);
})

StateManager.on('inviteOnFetched', (guildId, soutienOn) => {
  inviteOn.set(guildId, soutienOn);
})