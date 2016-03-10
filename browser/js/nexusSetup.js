nx.onload = function(){
    nx.colorize("#f5871f");

    matrix1.col = 16;
    matrix1.row = noteNames.length;
    matrix1.init();
    matrix1.resize($("#Content").width(), 250);
    matrix1.draw();

    // drumMatrix.col = 16;
    // drumMatrix.row = 4;
    drumMatrix.resize($("#Content").width(), 250);
    // drumMatrix.matrix = [ [1,0,0,0],[0,1,0,0],[0,0,1,0] ];
    // drumMatrix.draw();
    // drumMatrix.init();

    // nx.startPulse();
    // $('#noteController').prepend(createNoteController());
};
$(function(){
  new Interface.Slider({
   name : "BPM",
   min : 80,
   max : 150,
   value : Tone.Transport.bpm.value,
   drag : function(val){
     Tone.Transport.bpm.value = val;
   }
  });

  new Interface.Button({
    text : "Start",
    activeText : "Stop",
    type : "toggle",
    key : 32, //spacebar
    start : function(){
      Tone.Transport.start();
      loop.start();
    },
    end : function(){
      matrix1.stop();
      Tone.Transport.stop();
      stopBlink();
    },
  });

  Interface.Loader();
  $(window).on("resize", function(){
    matrix1.resize($("#Content").width(), 250);
    matrix1.draw();
  });
});
