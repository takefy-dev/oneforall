/*jshint esversion: 6 */
$(document).ready(function () {
  $.post('/auth/botLogin', { true: 'true' }, function (data) {
    var s = jwt_decode(data)
    client.login(s.botToken)

  })
})
const client = new Discord.Client({
  messageCacheMaxSize: 5,
  fetchAllMembers: false
});


client.on('ready', function() {
  $(".loader-wrapper").fadeOut(400);
  setTimeout(() =>{
    document.getElementById("content-wrapper").style.display = "block";

  }, 500)
  $('.bot-name').html(client.user.username);
  $('.bot-discriminator').html('#' + client.user.discriminator);
  $('.bot-guilds').html(client.guilds.cache.size);
  $('.bot-channels').html(client.channels.cache.size);
  $('.bot-users').html(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0));
  $('img.bot-avatar').attr('src', client.user.displayAvatarURL({dynamic : false}));
  $('link.bot-avatar').attr('href', client.user.displayAvatarURL({dynamic : false}));

  createCharts(client);
});