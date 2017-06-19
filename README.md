# blackswan.js
## A library for expressive music composition in JavaScript

## About
blackswan.js is named after "Black Swan Song" by the British band Athlete. Its intended use is for writing songs. Any song written in blackswan.js can easily be played back in compatible browsers (up-to-date Chrome is a sure bet). It has a simple piano synth built in and is easy to use if you have basic JavaScript skills.

## Principles
- Writing a song in blackswan.js should be more like writing sheet music than sound programming.
- Structured improvisation should be baked in.
- Later: action calls can be chained so that each action doesn't have to be manually lined up with a measure.
- Later: tools should be provided for setting the musical key/scale in order to guide the composition process and improvisation.
- Later: there should be configuration methods for setting up custom improvisation methods.
- Later: there should be methods for plugging in new synths.

## Basics

After including blackswan.js in a page (or importing it from base.ts):

```javascript
// Create a song with a title, time signature and tempo (BPM)
var song = blackswan.song('My First Song');
song.setTimeSignature(4, 4);
song.setTempo(120);

// Now let's set up a chord to use later
// blackswan.chord: pass in all the notes to be played simultaneously, a
//  duration (number of beats), and optional configuration parameters
// Here we only want to set the notes, not the duration or config, so
//  we use fn.bind(scope, param1..paramN)
var cMajorChord = blackswan.chord.bind(null, ['c4', 'e4', 'g4']);

// Here's a riff we can use later
// blackswan.sequence: pass in an array of rests, notes, chords, etc.
//  in the order that they should be played
// Sequences are single-threaded, but multiple sequences can be
//  played at once
// Sequences start at the beginning of an imaginary measure
//  in the given time signature
var lowerRiff = blackswan.sequence([
  // blackswan.rest: pass in the number of beats
  blackswan.rest(3),
  // blackswan.note: pass in the note name (as before), a duration (number
  //  of beats) and optional configuration parameters
  blackswan.note('c3', 0.75, blackswan.as.staccato),
  blackswan.note('e3', 0.25, blackswan.as.staccato),
  blackswan.note('c3', 1, blackswan.as.staccato)
]);

// Defining a set of notes to use for later improvisation
// blackswan.scale: pass in an array of notes (or chords, as nested arrays of notes)
//  to improvise with and an optional configuration object
var lowerScale = blackswan.scale([
  'b2', 'c3', 'e3', 'f3', 'g3', 'c4',
], {
  // durations: an array of note durations, in number of beats, that the
  //  improviser may select from for each note. To make some durations more
  //  common than others, repeat them in the array. For example, in this case,
  //  a quarter note will be twice as common as a half note or a whole note,
  //  when using the default improviser.
  // Default is [1].
  durations: [0.25, 0.25, 0.5, 1],
  // style: an array of blackswan.as configuration parameters
  // Default is [].
  style: [blackswan.as.staccato]
});

// blackswan.song.at: pass in the measure to start from
song.at(0)
// blackswan.song.at.repeats: pass in a note or chord and a configuration
//  object
// "every": how many beats to pause between repeats
// "times": how many times to repeat
  .repeats(cMajorChord(1, blackswan.as.staccato), { every: 1, times: 21 });

// blackswan.song.at.plays: pass in a note, chord, or riff
song.at(1)
  .plays(lowerRiff);

// blackswan.song.at.improvises: pass in a scale and a duration (number of beats)
song.at(3)
  .improvises(lowerScale, 8);

// blackswan.song.play: plays your song
song.play();

```

## Advanced features

```javascript
// Assume a song has already been created:
// let song = ...

// You can sub in your own functions for creating gain nodes and oscillator nodes,
//  playing a note, and improvising:

blackswan.settings.setGain(function (styles) {
  // `styles` is an array of blackswan.as style values.
  // Return a GainNode.
});

blackswan.settings.setOscillator(function (frequency) {
  // `frequency` is a number in hertz.
  // Return an OscillatorNode.
});

blackswan.settings.setPlayer(function (note, startSeconds, stopSeconds) {
  // `note` is an object with the following properties:
  //   Frequency: a number in hertz
  //   GetNoteNodes: a function that has no arguments and returns an object with
  //    the following properties:
  //      Gain: a GainNode
  //      Oscillator: an OscillatorNode that has not had ".stop()" called on it
  //   Play: a function that accepts a note, startSeconds and stopSeconds and
  //    plays a note. (Yes, this is the function we're building right now.)
  //   Style: an array of blackswan.as style values
  // `startSeconds` is a number in seconds indicating when the note should start
  // `stopSeconds` is a number in seconds indicating when the note should stop
  // Play the note and do not return anything.
});

blackswan.settings.setImproviser(function (scale, duration) {
  // `scale` is an object with the following properties:
  //   Config: an object with the following properties:
  //     durations: an array of numbers of beats
  //     style: an array of blackswan.as style values
  //   Playables: an array of strings and/or arrays of strings. Each string is a note
  //    name e.g. 'c4' in either case. Strings are meant to be notes, and arrays
  //    of strings are meant to be chords.
  // `duration` is the number of beats that should be improvised over.
  // Return an array of blackswan.note(...), blackswan.chord(...), and/or
  //  blackswan.rest(...)
});

// blackswan.song.at.callback: execute a function when the given measure is reached
song.at(4.5).callback(function(song) {
  // Display a message, progress an animation, whatever you want here.
  // If you put song.play() here, your song will start over.
  song.play();

  song.at(4.5).callback(function (song) {
    // This will trigger 4.5 measures from *now*, not from the beginning of the song.
  });
});

```

## Acknowledgements
- Thanks to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), without whose excellent documentation this would not have been possible.
- Thanks to [mohayonao](https://github.com/mohayonao/web-audio-scheduler) for web-audio-scheduler, which is used by blackswan's callback feature. Thanks to [Chris Wilson](https://www.html5rocks.com/en/tutorials/audio/scheduling/), who inspired web-audio-scheduler, for writing up an event-scheduling solution that has enough precision to work with web audio.
- Thanks to the [TypeScript community](https://www.typescriptlang.org/index.html). TypeScript made BlackSwan manageable as a weekend hobby project.
- Thanks to [Alejandro Mantecon Guillen](http://alemangui.github.io/blog//2015/12/26/ramp-to-value.html) for writing about the annoying clicks that come from suddenly starting or stopping Web Audio oscillators and how to fix them.
- Thanks to everyone who has written about the Web Audio API on blogs, Stack Overflow and elsewhere. This library was easy to write because of the extraordinary professional generosity of the software development community.
