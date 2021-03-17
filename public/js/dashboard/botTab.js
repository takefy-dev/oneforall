function valueName() {
  var name = prompt("Veuillez entrer le nouveau nom de votre bot");
  if (name != null) {
    if (name.startsWith(" ")) return alert("Vous devez entrer un pseudo");
    $.post('/action/changeName', { name }, function (data) {
      if (data == 'changeNameOk') {
        var msg = `Vous avez changé le nom de votre bot en ${name}`

        $('#botOutput').html(
          `
                <div class="alert alert-success" role="alert">
                  <b>Succès :</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
        );
      }

      if (data == "USERNAME_RATE_LIMIT") {
        var msg = `Vous changez le pseudo de votre bot trop rapidement. Veuilez essayer plus tard.`

        $('#botOutput').html(
          `
                <div class="alert alert-danger" role="alert">
                  <b>Succès :</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
        );
      }
      if (data == "USERNAME_TOO_MANY_USERS") {
        var msg = `Trop d'utilisateur possède ce pseudo, veuillez en essayer un autre.`

        $('#botOutput').html(
          `
                <div class="alert alert-danger" role="alert">
                  <b>Succès :</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
        );
      }
    })

  }
}


function valueActivity() {
  var type = prompt("Quel est le type de d'activité (PLAYING / STREAMING / WATCHING)");
  if (type != null) {


    if (type.startsWith(" ")) return alert("Vous devez entrer un type ");
    if ((type.includes("PLAYING") || type.includes("STREAMING") || type.includes("WATCHING")) == false) return alert("Vous devez entrer un type entre PLAYING / STREAMING / WATCHING");
    var activity = prompt("Quel est le message de l'activité ?");
   
    if (activity != null) {
      if (type.startsWith(" ")) return alert("Vous devez entrer une activité");
      var msg = `Vous avez changé le l'activité de votre bot en ${activity}`
      if(type == "STREAMING"){
        client.user.setPresence({ activity: { name: activity, type: type, url: "https://www.twitch.tv/discord"} })
      }else{
        client.user.setPresence({ activity: { name: activity, type: type } })
      }
      
      $('#botOutput').html(
        `
                <div class="alert alert-success" role="alert">
                  <b>Succès :</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
      );

    }
  }



  // var msg = `Vous changez le pseudo de votre bot trop rapidement. Veuilez essayer plus tard.`

  // $('#botOutput').html(
  //   `
  //         <div class="alert alert-danger" role="alert">
  //           <b>Succès :</b> ${msg}
  //           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  //             <span aria-hidden="true">&times;</span>
  //           </button>
  //         </div>
  //         `
  // );


  // var msg = `Trop d'utilisateur possède ce pseudo, veuillez en essayer un autre.`

  // $('#botOutput').html(
  //   `
  //         <div class="alert alert-danger" role="alert">
  //           <b>Succès :</b> ${msg}
  //           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  //             <span aria-hidden="true">&times;</span>
  //           </button>
  //         </div>
  //         `
  // );




}


