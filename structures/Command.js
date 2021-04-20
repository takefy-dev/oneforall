module.exports = class Command {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.category = options.category || 'Aucune catégorie'
        this.aliases = options.aliases || [''];
        this.ownerOnly = options.ownerOnly || false;
        this.guildOwnerOnly = options.guildOwnerOnly || false;
        this.onlyTopGg = options.onlyTopGg || false;
        this.userPermissions = options.userPermissions || ['SEND_MESSAGES'];
        this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES'];

    }
    async run(client, message,args){

    }
}