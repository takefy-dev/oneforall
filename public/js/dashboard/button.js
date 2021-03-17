var msg;


$('#start').click(function () {
    
    $.post('/action/start', function (data){
        console.log(data);
        if(data == "start"){
            msg = "Votre bot est maintenant opérationnel."
            $('#actionOutput').html(
                `
                  <div class="alert alert-success" role="alert">
                    <b>Succès:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }
        if(data == "errStart"){
            
            msg = "Votre bot est déjà démarré"
            $('#actionOutput').html(
                `
                  <div class="alert alert-danger" role="alert">
                    <b>Erreur:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }

        if(data == "errToManyTimes"){
            
          msg = "Vous devez attendre 10min avant de pouvoir démarré le bot à nouveau"
          $('#actionOutput').html(
              `
                <div class="alert alert-danger" role="alert">
                  <b>Erreur:</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
            );
      }
       
    });
});

$('#restart').click(function () {
    $.post('/action/restart', function (data) {
        if(data == "restart"){
            msg = "Votre a parfaitement redémarré."
            $('#actionOutput').html(
                `
                  <div class="alert alert-success" role="alert">
                    <b>Succès:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }
        if(data == "errRestart"){
            
            msg = "Votre bot n'est pas démarré"
            $('#actionOutput').html(
                `
                  <div class="alert alert-danger" role="alert">
                    <b>Erreur:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }
        if(data == "errToManyTimes"){
            
          msg = "Vous devez attendre 10min avant de pouvoir redémarré le bot à nouveau"
          $('#actionOutput').html(
              `
                <div class="alert alert-danger" role="alert">
                  <b>Erreur:</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
            );
      }
    });
});

$('#stop').click(function () {
    $.post('/action/stop', function (data) {
        if(data == "stop"){
            msg = "Votre est maintenant arrété."
            $('#actionOutput').html(
                `
                  <div class="alert alert-success" role="alert">
                    <b>Succès:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }
        if(data == "errStop"){
            
            msg = "Votre bot n'est pas démarré"
            $('#actionOutput').html(
                `
                  <div class="alert alert-danger" role="alert">
                    <b>Erreur:</b> ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  `
              );
        }
        if(data == "errToManyTimes"){
            
          msg = "Vous devez attendre 10min avant de pouvoir arrêter le bot à nouveau"
          $('#actionOutput').html(
              `
                <div class="alert alert-danger" role="alert">
                  <b>Erreur:</b> ${msg}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
            );
      }
    });
});