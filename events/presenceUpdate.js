const StateManager = require('../utils/StateManager');
const Discord = require('discord.js')
const soutienId = new Map();
const soutienMsg = new Map();
const soutienisOn = new Map();

const { Event } = require('advanced-command-handler');
module.exports = new Event(
  {
    name: 'presenceUpdate',
  },
  module.exports = async (handler, oldMember, newMember) => {
    // console.log(newMember)
    this.connection = StateManager.connection;
    if(!handler.client.BotPerso) return;
    handler.client.guilds.cache.forEach(guild => {
      
      if (!oldMember) return;
      const msg = soutienMsg.get(guild.id);
      const roleId = soutienId.get(guild.id);
      const isOn = soutienisOn.get(guild.id);
      let status = newMember.user.presence.activities.map(a => a.state)
      if (guild.members.cache.get(newMember.user.id) == undefined) return;

      if (isOn == "0") {
        return;

      } else if (oldMember == undefined || newMember == undefined) {
        return;
      }

      else if (oldMember.status != newMember.status || oldMember == undefined || newMember == undefined) {
        return;
      }
      else if (isOn == "1") {
        if (status[0] != null && status[0].includes(msg)) {
          guild.members.cache.get(newMember.user.id).roles.add(roleId)
        } else {
          if (guild.members.cache.get(newMember.user.id) == undefined) return;
          if (guild.members.cache.get(newMember.user.id).roles.cache.some((r) => r.id === roleId)) {
            guild.members.cache.get(newMember.user.id).roles.remove(roleId)
          }
        }
      }
    });
  }
)

StateManager.on('soutienIdFetched', (guildId, soutienIds) => {
  soutienId.set(guildId, soutienIds);
})

StateManager.on('soutienIdUpdate', (guildId, soutienIds) => {
  soutienId.set(guildId, soutienIds);
})

StateManager.on('soutienMsgFetched', (guildId, soutienMsgs) => {
  soutienMsg.set(guildId, soutienMsgs);
})

StateManager.on('soutienMsgUpdate', (guildId, soutienMsgs) => {
  soutienMsg.set(guildId, soutienMsgs);
})
StateManager.on('soutienOn', (guildId, soutienMsgs) => {
  soutienisOn.set(guildId, soutienMsgs);
})

StateManager.on('soutienOnFetched', (guildId, soutienOn) => {
  soutienisOn.set(guildId, soutienOn);
})



