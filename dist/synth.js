// This file contains code for generating the piano synth.
// All variables are pluggable so that a user-configured synth
//  can be used seamlessly, and arbitrary notes can be played with
//  arbitrary articulation and voicing.
let _context = new AudioContext();
function defaultOscillator(frequency) {
    let oscillator = _context.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    return oscillator;
}
let _oscillator = defaultOscillator;
let _memoizedNotes = [];
function getMemoizedNote(frequency, articulation) {
    return _memoizedNotes.find((note) => note.Frequency === frequency && note.Articulation.every((art) => !!~articulation.indexOf(art)));
}
function synthesizeNote(frequency, articulation) {
    let memoizedNote = getMemoizedNote(frequency, articulation);
    return memoizedNote || {
        Articulation: articulation,
        Frequency: frequency,
        Oscillator: _oscillator(frequency)
    };
}
function setOscillator(oscillator) {
    _oscillator = oscillator;
}
function playNote(note) {
    // Should probably connect sooner and disconnect later...
    //  depends on what gives the best performance
    note.Oscillator.connect(_context.destination);
    note.Oscillator.start(0);
}
function stopNote(note) {
    note.Oscillator.stop();
    note.Oscillator.disconnect(_context.destination);
}
var Synth = {
    SetOscillator: setOscillator,
    StopNote: stopNote,
    SynthesizeNote: synthesizeNote,
    PlayNote: playNote,
};
export { Synth };
//# sourceMappingURL=synth.js.map