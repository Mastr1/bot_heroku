const Discord = require("discord.js");

const Client = new Discord.Client();

const ytdl = require("ytdl-core");

const prefix = "/";

//Bot allumé et activité !
Client.on("ready", () => {
    console.log("Bot Allumé !")
    Client.user.setStatus("dnd");
    setTimeout(() => {
        Client.user.setActivity(".gg/ZBB8ZAWxh7 💨", {type: "WATCHING"});
    }, 100)
});

//Bienvenue
Client.on("guildMemberAdd", member => {
    member.guild.channels.cache.find(channel => channel.id === "857377306465271858").send(member.displayName + "** Bienvenue** sur le discord ! 💫\nNous somes actuellement **" + member.guild.memberCount + "** sur le Discord.");
});

//Ban
Client.on("message", message => {
    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Le membre Mentionné est invalide ou NUL ! 💥");
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send(mention.displayName + " ***à été banni avec succés ! ✅***")
                }
                else {
                    message.reply("⛔ ***Impossible de bannir ce membre !*** ⛔")
                }
            }
        }
    }
    
    if(message.content.startsWith(prefix + "kick")){
        let mention = message.mentions.members.first();

        if(mention == undefined){
            message.reply("Le membre Mentionné est invalide ou NUL ! 💥");
        }
        else {
            if(mention.kickable){
                mention.kick();
                message.channel.send(mention.displayName + " ***à été kick avec succés ! ✅***")
            }
            else {
                message.reply("⛔ ***Impossible de kick ce membre !*** ⛔")
            }
        }
    }
});

//play (musique)
Client.on("message", message => {
    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection => {
                let args = message.content.split(" ");

                if(!args[1]){
                    message.reply("***Aucune Musique Indiqué ou lien invalide ! ***💨");
                    connection.disconnect();
                }
                
                let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio"}));

                dispatcher.on("finish", () => {
                    dispatcher.destroy();
                    connection.disconnect();
                });

                dispatcher.on("error", err => {
                    console.log("Erreur de dispatcher :" + err);
                });
            }).catch(err => {
                message.reply("Erreur lors de la connection : " + err);
            });
        }
        else {
            message.reply("Vous n'êtes pas dans un channel vocal ! ❌");
        }
    }
});

//clear
Client.on("message", message => {
    if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");
            
            if(args[1] == undefined){
                message.reply("**Le nombres de message NUL ou invalide ! ❌**");
            }
            else {
                let number = parseInt(args[1]);

                if(isNaN(number)){
                    message.reply("**Le nombres de message NUL ou invalide ! ❌**");
                }
                else {
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("Supression de " + messages.size + " messages réussi !✅");
                    }).catch(err => {
                        console.log("Erreur de clear : " + err);
                    })
                }
            }
        }
    }
});

Client.on("message", message => {
    if(message.author.bot) return;
    if(message.content.startsWith(prefix + "cmds")){

        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Support Mastr !')
            .setAuthor('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png')
            .setDescription('**💫 Voici les Commandes du Bot ! 💫**')
            .addFields('**📢 Modérations 📢**', '/ban (pour bannir un membre)', '/kick (pour kick un membre)', '/clear (nombre entre 1 - 100)(pour supprimer des messages)')
            .setTimestamp()
            .setFooter('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png');

        message.channel.send(embed);
    }
});

Client.on("message", message => {
    if(message.member.hasPermission("ADMINISTRATOR")){
    if(message.content.startsWith(prefix + "live")){

        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Stream de Mastr')
            .setAuthor('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png')
            .setDescription('**💫 Voici le Stream ! 💫**')
            .addField('Lien du Live', 'https://www.twitch.tv/mastrontwitch', true)
            .setTimestamp()
            .setFooter('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png');

        message.channel.send(embed);
    }
    } 
});




Client.login(process.env.token);