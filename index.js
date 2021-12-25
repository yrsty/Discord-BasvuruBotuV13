const { Client, Message, MessageEmbed, MessageButton, Collection, MessageActionRow, Permissions } = require("discord.js");
const fs = require("fs");
const config = require("./config.js");
const db = require("orio.db")
const ms = require("pretty-ms")

const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
});
module.exports = client;

let token
if(process.env.TOKEN){
  token = process.env.TOKEN
}
if(config.TOKEN){
  token = config.TOKEN
}
if(!token){
  console.log("Bu Proje Glitch.com Üzerinde ise .env Dosyasına Bir VDS veya PC'de ise config.js Dosyasına Discord Bot Tokeninizi Yazınız!")
} else { 
client.login(token).catch(e => {
  console.log("Projeye Yazılan Token Hatalı veya Discord Botunuzun Intentleri Kapalı!")
})
}




//PC VEYA VDS KURACAK İSENİZ SİLİN
const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  console.log(`Uptime Başarılı`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);
//PC VEYA VDS KURACAK İSENİZ SİLİN







client.on("ready", async () => {
console.log(`${client.user.tag} İsmi İle Bot Aktif!`)
client.user.setActivity(`Umut Bayraktar ♥ Code Share`)
const guild1 = client.guilds.cache.get(config.guild)
if(guild1){
if(guild1.channels.cache.find(a => a.name === "BAŞVURULAR")){
await guild1.channels.cache.filter(mr => mr.parent).filter(cs => cs.parent.name === "BAŞVURULAR").map(cs => cs.delete().catch(e => {console.log("Kanal Silmeye Yetkim Yetmiyor veya Kanal Zaten Yok!")}))
}}
setInterval(() => {
const guild = client.guilds.cache.get(config.guild)
if(guild){
const channel = guild.channels.cache.get(config.channel)
if(channel){
const role = guild.roles.cache.get(config.log.staff)
if(role){
const channel1 = guild.channels.cache.get(config.log.channel)
if(channel1){
const role2 = guild.roles.cache.get(config.sonuc.sRole)
if(role2){
let button = new MessageButton()
.setLabel("Başvur")
.setStyle("SECONDARY")
.setCustomId("başvuru")
.setEmoji("📨")
const row = new MessageActionRow().addComponents(button)
  
const embed = new MessageEmbed()
.setTitle(config.embed.title)
.setThumbnail(client.user.displayAvatarURL())
.setColor(config.embed.color)
.setDescription(config.embed.description)
.setTimestamp()
.setFooter("❤️ By Umut Bayraktar")

const data = db.get("ubmesaj")
if(data){
channel.messages.fetch(data.message).then(async msg => {
  
msg.edit({ embeds: [embed], components: [row] }).then(async cs => {
await db.set("ubmesaj", {
message: cs.id,
channel: cs.channel.id
})}).catch(e => {})
}).catch(err => {
channel.send({ embeds: [embed], components: [row] }).then(async cs => {
await db.set("ubmesaj", {
message: cs.id,
channel: cs.channel.id
})}).catch(e => {})
})
} else {
channel.send({ embeds: [embed], components: [row] }).then(async cs => {
await db.set("ubmesaj", {
message: cs.id,
channel: cs.channel.id
})}).catch(e => {})
}} else {
console.log("config.js Dosyasına sRole Kısmını Doldurmamışsın Yada Rol Yok!")
}} else {
console.log("config.js Dosyasına Log Channel ID Girilmemiş Yada Kanal Yok!")
}} else {
console.log("config.js Dosyasına Staff ID Girilmemiş Yada Rol Yok!")
}} else {
console.log("config.js Dosyasına Kanal ID Girilmemiş Yada Kanal Yok!")
}} else {
console.log("config.js Dosyasına Sunucu ID Girilmemiş Yada Sunucu Yok!")
}}, 20000)})





client.on("interactionCreate", async (interaction) => {
if(!interaction.isButton()) return;
let user = interaction.guild.members.cache.get(interaction.user.id)
let channel = interaction.guild.channels.cache.get(interaction.channel.id)
let message = channel.messages.fetch(interaction.message.id)
let data = db.get("ubmesaj")

if(data){
let guild = client.guilds.cache.get(interaction.guild.id)
if(guild){
if(interaction.customId === "başvuru") {
let channel = guild.channels.cache.get(data.channel)
if(channel){
if(data.message == interaction.message.id){
if(db.get("başvurutimeout."+user.id)){
if(Date.now() > Number(db.get("başvurutimeout."+user.id)+config.sonuc.timeout)){
await db.delete("başvurutimeout."+user.id)
}}
if(!user.roles.cache.has(config.sonuc.sRole)){
if(!db.get("başvurutimeout."+user.id)){
const kontrol = guild.channels.cache.find(cs => cs.name === 'basvuru-'+user.id)
if(kontrol){
await interaction.reply({ content: '> **❌ Zaten açık bir başvuru talebin var!**', ephemeral: true}).catch(e => {})
} else {
let kontrol2 = guild.channels.cache.find(cs => cs.name === "BAŞVURULAR")
if(!kontrol2){
await guild.channels.create('BAŞVURULAR', {type: 'GUILD_CATEGORY'}).then(async tt => {
kontrol2 = tt
}).catch(e => {console.log("Kategori Oluşturmaya Yetkim Yetmiyor!")})
}
  
await guild.channels.create('basvuru-'+user.id, {
type: 'GUILD_TEXT',
parent: kontrol2,
permissionOverwrites: [{
id: guild.id,
deny: [Permissions.FLAGS.VIEW_CHANNEL],
},{
id: user.id,
allow: [Permissions.FLAGS.VIEW_CHANNEL,Permissions.FLAGS.SEND_MESSAGES],
}],}).then(async mr => {

let cevaplar = []
let num = 0;
const embed1 = new MessageEmbed()
.setTitle("BİLGİLENDİRME")
.setColor("BLUE")
.setDescription("**Aşşağıda Sana Sorulan Sorulara Cevap Vererek Başvuru Yapa Bilirsin. Sana Sıra ile `"+config.sorular.length+"` Soru Sorulacak, Sen Bir Soruya Yanıt Verince Bot Diğer Soruyu Sorar!\nToplam 10 Dakikan Var.**")
.setTimestamp()
.setFooter("❤️ By Umut Bayraktar")
await mr.send({embeds: [embed1]}).catch(e => {})
await mr.send("<@"+user.id+"> 1 Soru: "+config.sorular[num]).catch(e => {})

const collector1 = mr.createMessageCollector({time: 600000});
collector1.on('end', async collected => {
  setTimeout(async () => {
  return await mr.delete().catch(e => {console.log("Kanal Silmeye Yetkim Yetmiyor veya Kanal Zaten Yok!")})
  }, 10000)
  });

const filter = m => {
return m.content.includes(m.content) && m.author.id === user.id;
} 
const collector = mr.createMessageCollector({ filter, time: 600000});
  
collector.on('collect', async (msg) => {
if(config.sorular[num]){
cevaplar.push("**SORU "+Number(num+1)+": `"+config.sorular[num]+"`\nYANIT: `"+msg.content+"`**")
num = num+1
await mr.send(config.sorular[num] ? "<@"+user.id+"> "+Number(num+1)+" Soru: "+config.sorular[num] : "**Soruları Cevapladığın İçin Teşekkürler, Bütün Sorular Bitti. Başvurun Yetkili Ekibine İletildi Artık Beklemen Gerekli!**").catch(async e => {})
if(config.sorular.length === num){
collector.stop("success")
const log = guild.channels.cache.get(config.log.channel)
if(log){
const staff = guild.roles.cache.get(config.log.staff)
if(staff){

let button = new MessageActionRow().addComponents(
new MessageButton()
.setLabel("Onayla")
.setStyle("SUCCESS")
.setCustomId("onayla"),
new MessageButton()
.setLabel("Reddet")
.setStyle("DANGER")
.setCustomId("reddet"))

const embed = new MessageEmbed()
.setTitle("Yeni Başvuru Geldi")
.setColor("BLUE")
.setDescription("Başvuran: <@"+user.id+">\n\n"+cevaplar.map(cs => cs).join("\n\n"))
.setTimestamp()
.setFooter("❤️ By Umut Bayraktar")
await log.send({ embeds: [embed], components: [button] }).then(async cs => {
await db.set("başvuru."+cs.id, user.id)
}).catch(e => {})
}}}}}); 

collector.on('end', async collected => {
setTimeout(async () => {
return await mr.delete().catch(e => {console.log("Kanal Silmeye Yetkim Yetmiyor veya Kanal Zaten Yok!")})
}, 10000)
});
  
await interaction.reply({ content: '> **✅ Başvuru talebin için <#'+mr.id+'> kanalı açıldı. Bu kanala giderek soruları cevapla lütfen!**', ephemeral: true}).catch(e => {})
}).catch(e => {console.log("Kanal Oluşturmaya Yetkim Yetmiyor!")})
}} else {
await interaction.reply({ content: '> **❌ Zaten kısa süre önce reddedilmiş bir başvurun var. Tekrar başvurmak için `'+ms(Number(db.get("başvurutimeout."+user.id)+config.sonuc.timeout-Date.now()))+'` beklemen gerek!**', ephemeral: true}).catch(e => {})
}} else {
await interaction.reply({ content: '> **❌ Zaten yetkili rolüne sahipsin tekrar başvuru yapamazsın!**', ephemeral: true}).catch(e => {})
}}}}

  
if(interaction.customId === "onayla") {
if(user.roles.cache.has(config.log.staff)){
let csm = db.get("başvuru."+interaction.message.id)
if(csm){
csm = guild.members.cache.get(csm)
if(csm){
if(config.sonuc.staffRole){
config.sonuc.staffRole.map(async rs => {
const role = guild.roles.cache.get(rs)
if(role){
await csm.roles.add(role.id).catch(e => {console.log("Kullanıcıya Rol Vermeye Yetkim Yetmiyo veya Rol Zaten Yok!")})
}})
await db.delete("başvuru."+interaction.message.id)
await csm.send(config.sonuc.successMessage).then(async ss => {
await interaction.reply({ content: '> **✅ <@'+csm.id+'> İsimli kişiye yetkili rolü verildi ve dm üzerinden bilgilendirme mesajı yollandı!**', ephemeral: true}).catch(e => {})
}).catch(async e => {
await interaction.reply({ content: '> **✅ <@'+csm.id+'> İsimli kişiye yetkili rolü verildi ancak dm kutusu kapalı diye bilgilendirme yapılamadı!**', ephemeral: true}).catch(e => {})
})
await interaction.message.delete().catch(e => {})
}} else {
await db.delete("başvuru."+interaction.message.id)
await interaction.reply({ content: '> **Bu başvurunun sahibi sunucuda bulunamadı diye talep silindi!**', ephemeral: true}).catch(e => {})
await interaction.message.delete().catch(e => {})
}}} else {
await interaction.reply({ content: '> **Sadece <@&'+config.log.staff+'> rolüne sahip kişiler başvuru onaylaya bilir.**', ephemeral: true}).catch(e => {})
}}
  
  
if(interaction.customId === "reddet") {
if(user.roles.cache.has(config.log.staff)){
let csm = db.get("başvuru."+interaction.message.id)
if(csm){
csm = guild.members.cache.get(csm)
if(csm){
await db.delete("başvuru."+interaction.message.id)
await db.set("başvurutimeout."+csm.id, Date.now())
await csm.send(config.sonuc.deleteMessage).then(async ss => {
await interaction.reply({ content: '> **✅ <@'+csm.id+'> İsimli kişiye başvurusunun reddedildiği hakkında dm üzerinden bilgilendirme mesajı yollandı!**', ephemeral: true}).catch(e => {})
}).catch(async e => {
await interaction.reply({ content: '> **✅ <@'+csm.id+'> İsimli kişiye dm kutusu kapalı diye bilgilendirme yapılamadı!**', ephemeral: true}).catch(e => {})
})
await interaction.message.delete().catch(e => {})
} else {
await db.delete("başvuru."+interaction.message.id)
await interaction.reply({ content: '> **Bu başvurunun sahibi sunucuda bulunamadı diye talep silindi!**', ephemeral: true}).catch(e => {})
await interaction.message.delete().catch(e => {})
}}} else {
await interaction.reply({ content: '> **Sadece <@&'+config.log.staff+'> rolüne sahip kişiler başvuru reddede bilir.**', ephemeral: true}).catch(e => {})
}}
  
}}})