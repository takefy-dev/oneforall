const StateManager = require('../../utils/StateManager');

const wbCr = async function checkWbWlOn(guildID) {
this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'webhookCreate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].webhookCreate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const wbUp = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'webhookUpdate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].webhookUpdate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const wbDel = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'webhookDelete' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].webhookDelete;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const rlCr = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'roleCreate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].roleCreate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const rlUp = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'roleUpdate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].roleUpdate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const rlDel = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'roleDelete' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].roleUpdate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const chCr = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'channelCreate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].channelCreate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};
const chUp = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'channelUpdate' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].channelUpdate;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};
const chDel = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'channelDelete' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].channelDelete;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};
const spam = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'spam' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].spam;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};
const ban = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'ban' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].ban;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};

const bot = async function checkWbWlOn(guildID) {
    this.connection = StateManager.connection;

    const isWlFetched = await this.connnection.query(`SELECT 'bot' FROM antiraidWlBp WHERE guildId = '${guildID}'`);
    const isWbWlRes = isWlFetched[0][0].bot;
    var isWlOn = false
    if (isWbWlRes == "1") {
        isWlOn = true;
    }
    return isWlOn;

};
module.exports = {
    wbCr,
    wbUp,
    wbDel,
    rlCr,
    rlDel,
    rlUp,
    chCr,
    chUp,
    chDel,
    spam,
    bot,
    ban

}