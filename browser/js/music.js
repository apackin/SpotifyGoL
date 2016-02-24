
  const body = $('body');

  function startBlink() {
    body.addClass('blink');
  }

  function stopBlink() {
    body.removeClass('blink');
  }

  function blinkForTime(time) {
    startBlink();
    setTimeout(stopBlink, time);
  }

var keyboardNotes = {
  "A" : "/audio/casio/A1.mp3",
  "A#" : "/audio/casio/As1.mp3",
  "A2" : "/audio/casio/A2.mp3",
  "C" : "/audio/casio/C2.mp3",
  "C#" : "/audio/casio/Cs2.mp3",
  "D" : "/audio/casio/D2.mp3",
  "D#" : "/audio/casio/Ds2.mp3",
  "E" : "/audio/casio/E2.mp3",
  "F" : "/audio/casio/F2.mp3",
  "F#" : "/audio/casio/Fs2.mp3",
  "G" : "/audio/casio/G2.mp3",
  "G#" : "/audio/casio/Gs1.mp3",
};

  var numActiveCells = 0;
  var bassAlreadyDropped = false;
  var numSeqPasses = 0;
  //setup a polyphonic sampler
  var keys = new Tone.PolySynth(4, Tone.Sampler, keyboardNotes, {
    "volume" : 4,
  }).toMaster();
  var noteNames = ["A", "C", "D", "E", "G", "C", "D#", "G"];

  function createNoteController() {
    var noteSelecters = '';
    var noteOptions = '';

    for (var notes in keyboardNotes){
      noteOptions += '<option value="' + notes + '">' + notes + '</option>';
    }

    noteNames.forEach(function(note, idx, notesArray){
      noteSelecters += '<select class="NoteSelecter" name="note' + idx +'Ctrl"><option selected disabled>'+ note +'</option>' + noteOptions + '</select>';
      // make selecter element with options map.noteNames
    });

    return noteSelecters;
}

  // other /nonworking/ option
  // var keys = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster();
  // var noteNames = ["F#3", "E3", "C#3", "A3", "F#3", "E3", "C#3", "A3"];


  var loop = new Tone.Sequence(function(time, col){
    var column = matrix1.matrix[col];
    matrix1.stop();
    matrix1.sequence(Tone.Transport.bpm.value*4);
    for (var i = 0; i < noteNames.length; i++){
      if (column[i] === 1){
        keys.triggerAttackRelease(noteNames[i], "32n", time);
        numActiveCells++;
      }
    }
    if(col===15) {
      numSeqPasses++;
      console.log(col);
      console.log(Tone.Transport.bpm.value);
      endOfRow(30);
      numActiveCells= 0;
    } 

  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


  function endOfRow (bassDropThreshold){
      function fnCheckLife (){return $('#lifeCheck').is(':checked');}
      function fnAutoUpbeat (){return $('#bpmIncrease').is(':checked');}

      if (fnCheckLife()) matrix1.life();

      if (numActiveCells > bassDropThreshold) {
        if (!bassAlreadyDropped) {
          // bassDropFunc(); 
          // should the background bass change on drop?
          bassPart.stop();
          funcHat();
          bassAlreadyDropped = true;
        }
        startBlink();
      } else if (bassAlreadyDropped){
        bassFunc();
        stopBlink();
        if (numActiveCells < bassDropThreshold-5 && fnCheckLife()){
          makeCellsLive(0.1);
        }
      }

      if (!bassAlreadyDropped){
        if (fnCheckLife() && Tone.Transport.bpm.value<100 && numSeqPasses>10 || numSeqPasses>20){
          makeCellsLive(0.05);
        }
        if (fnAutoUpbeat()) Tone.Transport.bpm.value += (5*(numActiveCells/64));
      }
  }

  function makeCellsLive(chance){
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 16; j++) {
        if(Math.random()<chance)
        matrix1.setCell(j,i,true);
      }
    }
  }
  /*
   BASS
  //  */
  var bass = new Tone.MonoSynth({
    "volume" : -4,
    "envelope" : {
      "attack" : 0.1,
      "decay" : 0.3,
      "release" : 2,
    },
    "filterEnvelope" : {
      "attack" : 0.001,
      "decay" : 0.01,
      "sustain" : 0.5,
      "baseFrequency" : 100,
      "octaves" : 2.6
    }
  }).toMaster();

  var bassPart = new Tone.Sequence(function(time, note){
    bass.triggerAttackRelease(note, "16n", time);
  }, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start();

  var notes = ["A","B","C","D","E","F","G"];

  bassFunc = function() {
    // bassPart.at(0, "D5");
    var octiveShift = Math.floor(Math.random() * 3) - 1;
    var baseNote = 2 + Math.floor(Math.random() * 2);
    bassPart.at(0, notes[baseNote] + (2+octiveShift));
    bassPart.at(1).at(0, notes[baseNote] + (3+octiveShift));

    // bassPart.at(1).at(1).at(0, notes[baseNote] + (3+octiveShift));
    // bassPart.at(1).at(1).at(1, notes[baseNote+1] + (2+octiveShift));

    bassPart.at(2, notes[baseNote+2] + (2+octiveShift));
    bassPart.at(3).at(0, notes[baseNote+1] + (2+octiveShift));
    bassPart.at(3).at(1, notes[baseNote-2] + (1+octiveShift));
  };

  bassDropFunc = function() {
    bassPart.at(0, ["C2", "C3", "C2"]);
    bassPart.at(1, ["D2", "E2", "D2", "C2"]);
    bassPart.at(2, ["C2", "C1"]);
    bassPart.at(3, ["D2", "E2", "D2", "C2"]);
    funcHat();
  };

  /*
   KICK
  //  */
  var kick = new Tone.DrumSynth({
    "envelope" : {
      "sustain" : 0,
      "attack" : 0.02,
      "decay" : 0.8
    },
    "octaves" : 10
  }).toMaster();

  var kickPart = new Tone.Loop(function(time){
    kick.triggerAttackRelease("C2", "8n", time);
  }, "2n").start("2m");


  // // /*
  // //  SNARE
  // //  */
  var snare = new Tone.NoiseSynth({
    "volume" : -5,
    "envelope" : {
      "attack" : 0.001,
      "decay" : 0.2,
      "sustain" : 0
    },
    "filterEnvelope" : {
      "attack" : 0.001,
      "decay" : 0.1,
      "sustain" : 0
    }
  }).toMaster();

  var snarePart = new Tone.Loop(function(time){
    snare.triggerAttack(time);
  }, "2n").start("4n");


  //set the transport
  Tone.Transport.bpm.value = 90;


//DRUMS//

//and a compressor

var funcHat = function() {
  Tone.Transport.bpm.value = 120;
  var drumCompress = new Tone.Compressor({
    "threshold" : -30,
    "ratio" : 6,
    "attack" : 0.3,
    "release" : 0.1
  }).toMaster();

  var distortion = new Tone.Distortion({
    "distortion" : 0.4,
    "wet" : 0.4
  });

  //hats
  var hats = new Tone.Sampler("/audio/505/hh.mp3", {
    "volume" : 4,
    "envelope" : {
      "attack" : 0.001,
      "decay" : 0.02,
      "sustain" : 0.01,
      "release" : 0.01
    },
    "filterEnvelope" : {
      "attack" : 0.001,
      "decay" : 0.02,
      "sustain" : 1,
      "baseFrequency" : 6000,
      "octaves" : -3.3
    },
    "filter" : {
      "type" : "highpass"
    }
  }).chain(distortion, drumCompress);

  var hatsLoop = new Tone.Loop({
    function(time){
      hats.triggerAttackRelease(0, "8n", time);
    },
    "interval" : "16n",
    "probability" : 0.8
  }).start();


  // Loop(function(time){
  //  kick.triggerAttackRelease("C2", "8n", time);
  // }, "2n").start("2m");

  //SNARE PART
  var snare2 = new Tone.Sampler("/audio/505/snare.mp3", {
    "volume" : 4,
    "envelope" : {
      "attack" : 0.01,
      "decay" : 0.05,
      "sustain" : 0
    },
    "filterEnvelope" : {
      "attack" : 0.001,
      "decay" : 0.01,
      "sustain" : 0,
      "baseFrequency" : 3000,
      "octaves" : 2
    },
  }).chain(distortion, drumCompress);

  var snarePart2 = new Tone.Sequence(function(time, velocity){
    snare2.triggerAttackRelease(0, "8n", time, velocity);
  }, [null, 1, null, [1, 0.3]]).start(0);

  var kick2 = new Tone.DrumSynth({
    "volume" : 4,
    "pitchDecay" : 0.01,
    "octaves" : 6,
    "oscillator" : {
      "type" : "square4"
    },
    "envelope" : {
      "attack" : 0.001,
      "decay" : 0.2,
      "sustain" : 0
    }
  }).connect(drumCompress);

  var kickPart2 = new Tone.Sequence(function(time, probability){
    if (Math.random() < probability){
      kick2.triggerAttack("C1", time);
    }
  }, [1, [1, [null, 0.3]], 1, [1, [null, 0.5]], 1, 1, 1, [1, [null, 0.8]]], "2n").start();
  
  // BASS
  var bass2 = new Tone.SimpleFM({
    "volume" : 15,
    "harmonicity" : 1,
    "modulationIndex" : 3.5,
    "carrier" : {
      "oscillator" : {
        "type" : "custom",
        "partials" : [0, 1, 0, 2]
      },
      "envelope" : {
        "attack" : 0.08,
        "decay" : 0.3,
        "sustain" : 0,
      },
    },
    "modulator" : {
      "oscillator" : {
        "type" : "square"
      },
      "envelope" : {
        "attack" : 0.1,
        "decay" : 0.2,
        "sustain" : 0.3,
        "release" : 0.01
      },
    }
  }).toMaster();


  var bassPart2 = new Tone.Part(function(time, event){
    if (Math.random() < event.prob){
      bass2.triggerAttackRelease(event.note, event.dur, time);
    }
  }, [{time : "0:0", note : "C2", dur : "4n + 8n", prob: 1}, {time : "0:2", note : "C2", dur : "8n", prob : 0.6}, 
    {time : "0:2 + 4t", note : "C2", dur : "8n", prob : 0.4}, {time : "0:2 + 4t*2", note : "C2", dur : "8n", prob : 0.9},
    {time : "1:0", note : "C2", dur : "4n + 8n", prob : 1}, {time : "1:2", note : "C2", dur : "8n", prob : 0.6}, 
    {time : "1:2 + 4t", note : "C2", dur : "8n", prob : 0.4}, {time : "1:2 + 4t*2", note : "E2", dur : "8n", prob : 0.9},
    {time : "2:0", note : "F2", dur : "4n + 8n", prob : 1}, {time : "2:2", note : "F2", dur : "8n", prob : 0.6}, 
    {time : "2:2 + 4t", note : "F2", dur : "8n", prob : 0.4}, {time : "2:2 + 4t*2", note : "F2", dur : "8n", prob : 0.9},
    {time : "3:0", note : "F2", dur : "4n + 8n", prob : 1}, {time : "3:2", note : "F2", dur : "8n", prob : 0.6}, 
    {time : "3:2 + 4t", note : "F2", dur : "8n", prob : 0.4}, {time : "3:2 + 4t*2", note : "B1", dur : "8n", prob : 0.9}]).start(0);

  bassPart2.loop = true;
  bassPart2.loopEnd = "4m";
};
