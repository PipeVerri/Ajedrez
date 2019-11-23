var sourcePiece = "";
var idPieza;
var iMove;
var matriz = [new Array(8),new Array(8),new Array(8),new Array(8),new Array(8),new Array(8),new Array(8),new Array(8)];
var cuadriculaAnterior = "";
var clickAgarrar = false;
var clickSoltar = false;
var tiene_iMove = "";
var tipoPieza = ""
var turno = "white";
$(document).ready(function() {
  actualizar_matriz();

  $(".pieza").click(function(e) {
    iniciar_jugada(e, this);
  });

$(".celda").click(function(e) {
  terminarJugada(e, this);
});

  $("#container-tablero").mousemove(function(e) {
    if(sourcePiece != "") {
      if($("#pieza-en-movimiento").length == 0) {
        $(this).append("<img src='" + sourcePiece + "' id='pieza-en-movimiento' />");

      }
      $("#pieza-en-movimiento").css({top: e.clientY + 10, left: e.clientX + 10, position: "absolute"});
    }
  });
  $("#button-deshacer").click(deshacerJugada);
  $(document).keyup(function(e) {
    if(e.keyCode == 27) {
      deshacerJugada();
    }
  });
});

function iniciar_jugada(e,pthis) {
  if(clickAgarrar == false) {
  var clasePieza = $(pthis).hasClass("white")?"white":"black";
  if(clasePieza == turno) {
  agarrarPieza();
  e.stopPropagation();
  sourcePiece = $(pthis).attr("src");
  tipoPieza = $(pthis).data("pieza");
  cuadriculaAnterior = $(pthis).parent().attr("id");
  idPieza = $(pthis).parent().attr("id");
  iMove = $(pthis).hasClass("iMove");
  tiene_iMove=iMove?"iMove ":"";
  $(pthis).remove();
  $("#button-deshacer").prop("disabled", false);
  validar_jugada(tipoPieza, clasePieza);
  }
 }
}


function agarrarPieza() {
  clickSoltar = false;
  clickAgarrar = true;
}

function soltarPieza() {
  clickAgarrar = false;
  clickSoltar = true;
}

function deshacerPieza() {
  clickAgarrar = false;
  clickSoltar = true;
}

function terminarJugada(e, tthis) {
  if(sourcePiece != "" && clickAgarrar == true) {
    soltarPieza();
    $(tthis).html("");
    $(tthis).html("<img src='" + sourcePiece + "' class='iMove pieza " + turno + "' data-pieza='" + tipoPieza + "' onclick='iniciar_jugada(event,this)'/>");
    sourcePiece = "";
    tipoPieza = ""
    cuadriculaAnterior = "";
    $("#pieza-en-movimiento").remove();
    $("#button-deshacer").prop("disabled", true);
    $(".casillaPosible").removeClass("casillaPosible");
    turno = turno == "white"?"black":"white";
    actualizar_matriz();
  }
}

function actualizar_matriz() {
  $("#container-tablero .celda").each(function() {
    var id = $(this).attr("id")
    var splitId = id.split("-")
    var fila = splitId[1] - 1;
    var columna = splitId[2] - 1;
    if($(this).find("img").length > 0) {
      var clase = $(this).find("img").hasClass("white")?"white":"black";
      var tipo = $(this).find("img").data("pieza");
      matriz[fila][columna] = clase + "-" + tipo
    }
    else {
      matriz[fila][columna] = "";
    }
  });
}

function deshacerJugada() {
  if(clickAgarrar == true) {
  deshacerPieza();
  $("#" + cuadriculaAnterior).html("<img src='" + sourcePiece + "' class='" + tiene_iMove + "pieza " + turno + "' data-pieza='" + tipoPieza + "' onclick='iniciar_jugada(event,this)'/>");
  sourcePiece = "";
  cuadriculaAnterior = "";
  $("#pieza-en-movimiento").remove();
  $("#button-deshacer").prop("disabled", true);
  $(".casillaPosible").removeClass("casillaPosible");
 }
}

function validar_jugada(tipo, color) {
  switch (tipo) {
    case "peon":
      movimientoPeon(tipo, color);
      break;
  }
}

function movimientoPeon(tipo, color) {
  var filasPosibles = [];
  var columnasPosibles = [];
  var idArray = idPieza.split("-");
  var fila = parseInt(idArray[1]);
  var columna = parseInt(idArray[2]);
  //para obtener filas posibles
  if(color == "white") {
    if(iMove) {
      filasPosibles.push(fila - 1);
    }else {
      filasPosibles.push(fila - 1);
      filasPosibles.push(fila - 2);
    }
  }else {
    if(iMove) {
      filasPosibles.push(fila + 1);
    }else {
      filasPosibles.push(fila + 1);
      filasPosibles.push(fila + 2);
    }
  }
  //para obtener columnas posibles
    if(columna == 8) {
      columnasPosibles.push(columna);
      columnasPosibles.push(columna - 1);
    }else if(columna == 1) {
      columnasPosibles.push(columna);
      columnasPosibles.push(columna + 1);
     }
     else {
       columnasPosibles.push(columna - 1);
       columnasPosibles.push(columna + 1);
       columnasPosibles.push(columna);
     }
     for(var i = 0; i < filasPosibles.length; i++) {
       var f = filasPosibles[i];
       for(var k = 0; k < columnasPosibles.length; k++) {
         var c = columnasPosibles[k];
         var celda = "#celda-" + f + "-" + c;
         $(celda).addClass("casillaPosible")
       }
     }
  console.log(filasPosibles, columnasPosibles);
}
