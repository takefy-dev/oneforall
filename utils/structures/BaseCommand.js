module.exports = class BaseCommand {
    constructor (name, category, aliases, cooldown){
        this.name = name;
        this.category = category;
        this.aliases = aliases;
        this.cooldown = cooldown;
    }

}