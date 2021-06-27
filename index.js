const Discord = require("discord.js");

const Client = new Discord.Client();

const ytdl = require("ytdl-core");

const prefix = "/";

Client.on("ready", () => {
    console.log("Bot Allumé !");
});

Client.on("guildMemberAdd", member => {
    member.guild.channels.cache.find(channel => channel.id === "857377306465271858").send(member.displayName + "** Bienvenue** sur le discord ! 💫\nNous somes actuellement **" + member.guild.memberCount + "** sur le Discord.");
});

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
        if(message.content.startsWith(prefix + "stats")){
            let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
            let totalmembers = message.guild.members.cache.size
            let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
            let totalrole = message.guild.roles.cache.get('846251270153961482').members.map(member => member.user.tag).length;

            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Statistiques')
                .setAuthor('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png')
                .setDescription('**💫 Voici les statistiques ! 💫**')
                .addFields(
                    { name: '**Nombre de membres 👥 : **', value: totalmembers, inline: true },
                    { name: '**Membres Connectés ✅ : **', value: onlines, inline: true },
                    { name: '**Nombre de Bots sur le serveur 🤖 : **', value: totalbots, inline: true },
                    { name: '**Nombre d\'arrivants ❤ : **', value: totalrole, inline: true },
                )
                .setTimestamp()
                .setFooter('Support Mastr', 'https://i.imgur.com/ZKJkwhr.png');

            message.channel.send(embed);
        }
    }
});

Client.login(process.env.token);