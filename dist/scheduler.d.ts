import { Improvisable, Playable, Repeatable } from './category-types';
import { Song } from './song';
import { Note } from './synth';
export interface ActionContext {
    Measure: number;
    Song: Song;
}
export interface Actions {
    improvises: (improvisable: Improvisable) => void;
    plays: (playable: Playable) => void;
    repeats: (repeatable: Repeatable) => void;
}
export interface Moment {
    Duration: number;
}
export interface Rest extends Moment {
}
export interface Sequence extends Array<Moment>, Playable {
}
export interface TimedChord extends Moment, Playable {
    Chord: TimedNote[];
}
export interface TimedNote extends Moment, Playable {
    Note: Note;
}
declare let Scheduler: {
    GetActions: (measure: number, song: Song) => Actions;
};
export { Scheduler };