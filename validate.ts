import { PianoData } from './piano-data';

var validateNote = function(note: string): void {
  if (!~PianoData.Notes.indexOf(note)) {
    throw Error(`"${note}" is not a valid note name between "a" and "g".`);
  }
};

var validateOctave = function(octave: number|string): void {
  octave = Number(octave);

  if (isNaN(octave)) {
    throw Error(`Invalid octave "${octave}".`);
  }

  if (octave > 8 || octave < 0) {
    throw Error(`This octave is out of range (0 - 8) on a standard piano.`);
  }
};

var validateSign = function(sign: string): void {
  if (!~PianoData.FlatSigns.indexOf(sign) && !~PianoData.SharpSigns.indexOf(sign)) {
    throw Error(`Invalid sign "${noteName[1]}".`);
  }
};

var Validate = {
  Note: validateNote,
  Octave: validateOctave,
  Sign: validateSign
};

export { Validate };
