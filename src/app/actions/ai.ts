"use server";

import type { RhythmIdeaInput, RhythmIdeaOutput } from '@/ai/flows/rhythm-architect-flow';
import { generateRhythmIdea as generateRhythmIdeaFlow } from '@/ai/flows/rhythm-architect-flow';

import type { GenerateFullSongInput, GenerateFullSongOutput } from '@/ai/flows/generate-full-song';
import { generateFullSong as generateFullSongFlow } from '@/ai/flows/generate-full-song';

import type { RephraseInput, RephraseOutput } from '@/ai/flows/lyrical-lab';
import { rephraseLine as rephraseLineFlow } from '@/ai/flows/lyrical-lab';

import type { RhymeTennisInput, RhymeTennisOutput } from '@/ai/flows/rhyme-tennis-flow';
import { rhymeTennis as rhymeTennisFlow } from '@/ai/flows/rhyme-tennis-flow';

import type { SummonMuseOutput } from '@/ai/flows/muse-whisper';
import { summonMuse as summonMuseFlow } from '@/ai/flows/muse-whisper';

import type { LyricalMoodInput, LyricalMoodOutput } from '@/ai/flows/lyrical-mood-ring';
import { analyzeLyricalMood as analyzeLyricalMoodFlow } from '@/ai/flows/lyrical-mood-ring';

import type { ArtistInspirationInput, ArtistInspirationOutput } from '@/ai/flows/artist-inspiration';
import { getArtistInspiration as getArtistInspirationFlow } from '@/ai/flows/artist-inspiration';

import type { GenerateChordsInput, GenerateChordsOutput } from '@/ai/flows/ai-chord-generator';
import { generateChords as generateChordsFlow } from '@/ai/flows/ai-chord-generator';

import type { MelodyIdeaInput, MelodyIdeaOutput } from '@/ai/flows/melody-maker-memo';
import { generateMelodyIdea as generateMelodyIdeaFlow } from '@/ai/flows/melody-maker-memo';

import type { GenerateBridgePromptInput, GenerateBridgePromptOutput } from '@/ai/flows/bridge-builder';
import { generateBridgePrompt as generateBridgePromptFlow } from '@/ai/flows/bridge-builder';

import type { GeneratePhrasesInput, GeneratePhrasesOutput } from '@/ai/flows/ai-phrases-flow';
import { generatePhrases as generatePhrasesFlow } from '@/ai/flows/ai-phrases-flow';

import type { ChordVoicingInput, ChordVoicingOutput } from '@/ai/flows/chord-voicing-suggester';
import { getChordVoicingSuggestions as getChordVoicingSuggestionsFlow } from '@/ai/flows/chord-voicing-suggester';

import type { SuggestInstrumentsInput, SuggestInstrumentsOutput } from '@/ai/flows/suggest-instruments';
import { suggestInstruments as suggestInstrumentsFlow } from '@/ai/flows/suggest-instruments';

import type { ReharmonizeChordsInput, ReharmonizeChordsOutput } from '@/ai/flows/reharmonize-chords-flow';
import { reharmonizeChords as reharmonizeChordsFlow } from '@/ai/flows/reharmonize-chords-flow';

import type { GenerateSongStructureInput, GenerateSongStructureOutput } from '@/ai/flows/generate-structure';
import { generateSongStructure as generateSongStructureFlow } from '@/ai/flows/generate-structure';

import type { AlbumTitleInput, AlbumTitleOutput } from '@/ai/flows/album-title-generator';
import { generateAlbumTitle as generateAlbumTitleFlow } from '@/ai/flows/album-title-generator';

import type { RhymeSchemeInput, RhymeSchemeOutput } from '@/ai/flows/rhyme-scheme-generator';
import { generateRhymeScheme as generateRhymeSchemeFlow } from '@/ai/flows/rhyme-scheme-generator';

import type { StudySongInput, StudySongOutput } from '@/ai/flows/study-song-flow';
import { studySong as studySongFlow } from '@/ai/flows/study-song-flow';

import type { SectionExpanderInput, SectionExpanderOutput } from '@/ai/flows/section-expander-flow';
import { expandSection as expandSectionFlow } from '@/ai/flows/section-expander-flow';

import type { MetaphorInput, MetaphorOutput } from '@/ai/flows/metaphor-builder-flow';
import { generateMetaphor as generateMetaphorFlow } from '@/ai/flows/metaphor-builder-flow';


// Generic wrapper for AI flow calls
async function callAIFlow<InputType, OutputType>(
  flowFunction: (input: InputType) => Promise<OutputType>,
  input: InputType
): Promise<{ success: boolean; data?: OutputType; error?: string }> {
  try {
    const result = await flowFunction(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(`Error in AI flow: ${flowFunction.name}`, e);
    return { success: false, error: e.message || 'An unknown error occurred' };
  }
}

export async function generateRhythmIdea(input: RhythmIdeaInput) {
  return callAIFlow(generateRhythmIdeaFlow, input);
}
export async function generateFullSong(input: GenerateFullSongInput) {
  return callAIFlow(generateFullSongFlow, input);
}
export async function rephraseLine(input: RephraseInput) {
  return callAIFlow(rephraseLineFlow, input);
}
export async function rhymeTennis(input: RhymeTennisInput) {
  return callAIFlow(rhymeTennisFlow, input);
}
export async function summonMuse() {
  return callAIFlow(summonMuseFlow, undefined); // summonMuseFlow takes no arguments
}
export async function analyzeLyricalMood(input: LyricalMoodInput) {
  return callAIFlow(analyzeLyricalMoodFlow, input);
}
export async function getArtistInspiration(input: ArtistInspirationInput) {
  return callAIFlow(getArtistInspirationFlow, input);
}
export async function generateChords(input: GenerateChordsInput) {
  return callAIFlow(generateChordsFlow, input);
}
export async function generateMelodyIdea(input: MelodyIdeaInput) {
  return callAIFlow(generateMelodyIdeaFlow, input);
}
export async function generateBridgePrompt(input: GenerateBridgePromptInput) {
  return callAIFlow(generateBridgePromptFlow, input);
}
export async function generatePhrases(input: GeneratePhrasesInput) {
  return callAIFlow(generatePhrasesFlow, input);
}
export async function getChordVoicingSuggestions(input: ChordVoicingInput) {
  return callAIFlow(getChordVoicingSuggestionsFlow, input);
}
export async function suggestInstruments(input: SuggestInstrumentsInput) {
  return callAIFlow(suggestInstrumentsFlow, input);
}
export async function reharmonizeChords(input: ReharmonizeChordsInput) {
  return callAIFlow(reharmonizeChordsFlow, input);
}
export async function generateSongStructure(input: GenerateSongStructureInput) {
  return callAIFlow(generateSongStructureFlow, input);
}
export async function generateAlbumTitle() {
  return callAIFlow(generateAlbumTitleFlow, {}); // generateAlbumTitleFlow takes empty object or specific type if defined
}
export async function generateRhymeScheme(input: RhymeSchemeInput) {
  return callAIFlow(generateRhymeSchemeFlow, input);
}
export async function studySong(input: StudySongInput) {
  return callAIFlow(studySongFlow, input);
}
export async function expandSection(input: SectionExpanderInput) {
  return callAIFlow(expandSectionFlow, input);
}
export async function generateMetaphor(input: MetaphorInput) {
  return callAIFlow(generateMetaphorFlow, input);
}
