const help = require('./help');

class Commands {
    constructor(message){
        this.message = message.content.toLowerCase();
    }

    execute(){
        switch(this.message) {
            case '/jarko help':
                message.reply(help);
            // case 
        }
    }
}

module.exports = new Commands()