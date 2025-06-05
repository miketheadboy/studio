
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Wand2, BookOpen, Music, Shuffle, ListFilter, Star, Copy, Trash2, MessageSquare, Settings2, Rows, Columns, Music2, Guitar, SlidersHorizontal, Users, Library, Brain, Search, RefreshCw, Mic2, Edit3, Palette, FileText, Save, FolderOpen, X, ChevronDown, Plus, ChevronsUpDown, Settings, Sparkles, Loader2, Send, FilePlus2 } from 'lucide-react';

import * as ai from '@/app/actions/ai';
import type { MelodyIdeaOutput } from '@/ai/flows/melody-maker-memo';


// Helper types and interfaces
interface Phrase {
  text: string;
  adjective: string;
  noun: string;
  commonality: number;
  syllablesAdjective: number;
  syllablesNoun: number;
  totalSyllables: number;
}

interface ProjectData {
  title?: string;
  keyTempo?: string;
  moodTheme?: string;
  songCanvas?: string;
  ideaCatcher?: string;
  melodicIdeas?: string;
}

const AppClientPage: FC = () => {
  const { toast } = useToast();

  // State for various inputs and outputs
  const [musePrompt, setMusePrompt] = useState("Awaiting thematic prompts...");
  const [museLoader, setMuseLoader] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("Generate a title idea.");
  const [albumTitleLoader, setAlbumTitleLoader] = useState(false);
  const [dylanQuote, setDylanQuote] = useState("What's the word on the wire today?");
  const [bridgeContext, setBridgeContext] = useState("");
  const [bridgePrompt, setBridgePrompt] = useState("Suggestions for your bridge...");
  const [bridgeLoader, setBridgeLoader] = useState(false);
  const [melodyIdeaOutput, setMelodyIdeaOutput] = useState<MelodyIdeaOutput | string>("Melodic concepts await generation...");
  const [melodyIdeaLoader, setMelodyIdeaLoader] = useState(false);
  const [rhythmIdea, setRhythmIdea] = useState("Rhythmic concepts await discovery...");
  const [rhythmIdeaLoader, setRhythmIdeaLoader] = useState(false);
  const [desiredQuality, setDesiredQuality] = useState("");
  const [artistInspiration, setArtistInspiration] = useState("Artist examples will appear here.");
  const [artistInspirationLoader, setArtistInspirationLoader] = useState(false);
  const [songStudyQuery, setSongStudyQuery] = useState("");
  const [studySongResult, setStudySongResult] = useState("Song study suggestions will appear here.");
  const [studySongLoader, setStudySongLoader] = useState(false);
  
  const [wordAssociationChat, setWordAssociationChat] = useState<{sender: string, text: string}[]>([]);
  const [wordAssociationInput, setWordAssociationInput] = useState("");
  const [wordAssociationLoader, setWordAssociationLoader] = useState(false);

  const [lineToRephrase, setLineToRephrase] = useState("");
  const [rephraseStyle, setRephraseStyle] = useState("Default");
  const [rephrasedLine, setRephrasedLine] = useState("Rephrased line will appear here.");
  const [lyricalLabLoader, setLyricalLabLoader] = useState(false);

  const [lyricsToAnalyze, setLyricsToAnalyze] = useState("");
  const [lyricalMood, setLyricalMood] = useState("Lyrical mood analysis pending.");
  const [lyricalMoodLoader, setLyricalMoodLoader] = useState(false);

  const [metaphorConcept, setMetaphorConcept] = useState("");
  const [metaphorFeeling, setMetaphorFeeling] = useState("");
  const [metaphorResult, setMetaphorResult] = useState("Metaphorical insights await.");
  const [metaphorLoader, setMetaphorLoader] = useState(false);

  const [rhymeSchemeInputText, setRhymeSchemeInputText] = useState("");
  const [rhymeSchemeResult, setRhymeSchemeResult] = useState("Rhyme scheme analysis will appear here.");
  const [rhymeSchemeLoader, setRhymeSchemeLoader] = useState(false);

  const [sectionExpanderInputText, setSectionExpanderInputText] = useState("");
  const [sectionExpanderType, setSectionExpanderType] = useState("verse");
  const [sectionExpanderResult, setSectionExpanderResult] = useState("Expanded lyrical section will appear here.");
  const [sectionExpanderLoader, setSectionExpanderLoader] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState("");
  const [chordProgression, setChordProgression] = useState("Select a mood for chord progressions.");

  const [originalChords, setOriginalChords] = useState("");
  const [reharmStyle, setReharmStyle] = useState("Jazzier");
  const [reharmIntensity, setReharmIntensity] = useState("Subtle");
  const [reharmonizedChords, setReharmonizedChords] = useState("Reharmonized chords will appear here.");
  const [reharmonizerLoader, setReharmonizerLoader] = useState(false);
  
  const [stdProgKey, setStdProgKey] = useState("C");
  const [stdProgScale, setStdProgScale] = useState("Major");
  const [stdProgNumChords, setStdProgNumChords] = useState(4);
  const [stdProgComplexity, setStdProgComplexity] = useState("1");
  const [stdProgResult, setStdProgResult] = useState("Generated standard progression.");
  const [stdProgLoader, setStdProgLoader] = useState(false);

  const [randomProgFeel, setRandomProgFeel] = useState("");
  const [randomProgResult, setRandomProgResult] = useState("Generated random progression.");
  const [randomProgLoader, setRandomProgLoader] = useState(false);

  const [chordsForVoicing, setChordsForVoicing] = useState("");
  const [voicingSuggestions, setVoicingSuggestions] = useState("Chord voicing ideas will appear here.");
  const [voicingLoader, setVoicingLoader] = useState(false);

  const [instrumentationVibe, setInstrumentationVibe] = useState("");
  const [instrumentationStyleEra, setInstrumentationStyleEra] = useState("General Folk/Americana");
  const [instrumentationResult, setInstrumentationResult] = useState("Instrumentation ideas will appear here.");
  const [instrumentationLoader, setInstrumentationLoader] = useState(false);

  const [fullSongTheme, setFullSongTheme] = useState("");
  const [fullSongStyle, setFullSongStyle] = useState("");
  const [fullSongStructure, setFullSongStructure] = useState("VCVCBC");
  const [fullSongKeywords, setFullSongKeywords] = useState("");
  const [fullSongVerseCount, setFullSongVerseCount] = useState(3);
  const [fullSongDraft, setFullSongDraft] = useState("Your AI-generated song draft will appear here.");
  const [fullSongLoaderState, setFullSongLoaderState] = useState(false);

  const [songWorkingTitle, setSongWorkingTitle] = useState("");
  const [songKeyTempo, setSongKeyTempo] = useState("");
  const [songMoodTheme, setSongMoodTheme] = useState("");
  const [ideaCatcherText, setIdeaCatcherText] = useState("");
  const [melodicIdeasText, setMelodicIdeasText] = useState("");
  const [songCanvasText, setSongCanvasText] = useState("");
  const [songCanvasFont, setSongCanvasFont] = useState("var(--font-special-elite), cursive"); // Default to typewriter
  const [projectStatusMessage, setProjectStatusMessage] = useState("");
  
  const [tipBoxText, setTipBoxText] = useState("");
  const [isTipBoxVisible, setIsTipBoxVisible] = useState(false);

  const [geminiModalOpen, setGeminiModalOpen] = useState(false);
  const [geminiModalTitle, setGeminiModalTitle] = useState("AI Musings");
  const [geminiModalContent, setGeminiModalContent] = useState("");
  const [geminiModalLoader, setGeminiModalLoader] = useState(false);
  const [geminiModalSourceElementId, setGeminiModalSourceElementId] = useState<string | null>(null);


  const [showPhraseList, setShowPhraseList] = useState(false);
  const [rawPhrases, setRawPhrases] = useState<Phrase[]>([]); 
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);
  const [favoritePhrases, setFavoritePhrases] = useState<string[]>([]);
  const [phraseSearchTerm, setPhraseSearchTerm] = useState("");
  const [phraseCommonalityFilter, setPhraseCommonalityFilter] = useState("all");
  const [phraseMinSyllables, setPhraseMinSyllables] = useState("");
  const [phraseMaxSyllables, setPhraseMaxSyllables] = useState("");
  const [phraseSortOption, setPhraseSortOption] = useState("alpha-asc");
  const [phraseLetterFilter, setPhraseLetterFilter] = useState("All");
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [phraseListLoading, setPhraseListLoading] = useState(false);
  const [randomlySelectedPhrase, setRandomlySelectedPhrase] = useState("");


  // Constants from user's JS
  const DYLAN_QUOTES = [
    "You don't need a weatherman to know which way the wind blows.", "A man is a success if he gets up in the morning and gets to bed at night, and in between he does what he wants to do.", "All I can do is be me, whoever that is.", "Behind every beautiful thing, there's some kind of pain.", "I was born a long way from where I belong and I am on my way home.", "Sometimes it's not enough to know what things mean, sometimes you have to know what things don't mean.", "To live outside the law, you must be honest.", "I define nothing. Not beauty, not patriotism. I take each thing as it is, without prior rules about what it should be.", "People seldom do what they believe in. They do what is convenient, then repent.", "Yesterday's just a memory, tomorrow is never what it's supposed to be.", "May your heart always be joyful, may your song always be sung.", "He not busy being born is busy dying.", "The answer, my friend, is blowin' in the wind.", "I'll let you be in my dreams if I can be in yours.", "Take me on a trip upon your magic swirlin' ship.", "Money doesn't talk, it swears.", "All the truth in the world adds up to one big lie.", "I was so much older then, I'm younger than that now.", "Chaos is a friend of mine.", "I accept chaos, I'm not sure whether it accepts me.", "A song is anything that can walk by itself.", "I consider myself a poet first and a musician second.", "You can't be wise and in love at the same time.", "Inspiration is hard to come by. You have to take it where you find it.", "I think a hero is any person really intent on making this a better place for all people.", "What's money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.", "All this talk about equality. The only thing people really have in common is that they are all going to die.", "I say there're no depressed words just depressed minds."
  ];
  const SONGWRITING_TIPS = [
    "Try the Phrase Spark for a new line. Or hit 'Random Phrase' for unexpected inspiration.", "Need a title? The Album Title Generator can spark an idea.", "Draw from the Poet's Corner for a dose of Dylan.", "Experiment with a mood in the Chord Corner for progressions.", "Generate a progression in The Chord Forge, standard or random.", "Twist chords with The Chord Alchemist.", "Feeling blocked? Thematic Prompts can offer a new direction.", "Start writing in The Songwriter's Canvas, even if it's rough. Refine later.", "Use the Song Structure tools to outline in the Canvas.", "Search for keywords in the Phrase Spark.", "Listen to a song in your target style, then return fresh.", "Need bridge ideas? Try Bridge Builder Prompts.", "Explore your song's core emotion with the Lyrical Mood Ring.", "Contemplating melody? Check Melody Maker's Memo.", "Need a beat? The Rhythm Architect offers ideas.", "Stuck on a line? Use the Word Lab to rephrase it.", "Build imagery with The Metaphor Builder.", "Get Sound Palette ideas for instrumentation.", "Find inspiration from artists in Mentor's Corner.", "Study a song with Mentor's Discography.", "For a complete start, try the AI Song Draft Generator."
  ];
  const CHORD_PROGRESSIONS: Record<string, { name: string; progressions: string[] }> = {
    bluesySwagger: { name: "Blues/Roots Rock", progressions: ["I - IV - V (e.g. A - D - E)", "I - I - I - I <br>IV - IV - I - I <br>V - IV - I - V (12-bar)", "I - vi - ii - V (e.g. C - Am - Dm - G)"] },
    altRockEdge: { name: "Alt-Rock/Indie", progressions: ["I - IV - V (Loud & Fast!)", "I - V - vi - IV (e.g. G - D - Em - C)", "vi - IV - I - V (e.g. Am - F - C - G)"] },
    folkBallad: { name: "Folk/Americana Ballad", progressions: ["Am - G - C - F", "C - G/B - Am - F", "Em - C - G - D", "G - D/F# - Em - C"] },
    folkStoryteller: { name: "Folk Storyteller", progressions: ["G - C - D - G", "Am - G - C - G", "C - F - G - C", "D - G - A - D"] },
    indieFolkDream: { name: "Indie Folk/Dream Pop", progressions: ["Imaj7 - IVmaj7 - ii7 - V7", "vi7 - IVmaj7 - Imaj7 - V7sus", "Cmaj7 - Fmaj7 - Gsus - G"] },
    rootsRockGroove: { name: "Roots Rock/Soul Groove", progressions: ["Em7 - A7 (loop)", "i7 - IV7 (loop, e.g. Am7 - D7)", "Am - Dm - G - C"] },
    wistfulAcoustic: { name: "Wistful Acoustic", progressions: ["C - G/B - Am - Em/G - F - C/E - Dm7 - Gsus - G", "G - D/F# - Em - C", "D - A/C# - Bm - G"] },
    dustBowlBallad: { name: "Minor Key Ballad (Dust Bowl)", progressions: ["Am - Dm - Am - E7", "i - iv - V7 - i (e.g. Em - Am - B7 - Em)", "Cm - Gm - Ab - Eb"] },
    appalachianFolk: { name: "Traditional/Appalachian Folk", progressions: ["I - V - I (e.g. G - D - G)", "I - IV - I - V - I (e.g. D - G - D - A - D)", "Modal: D - C - G - D (Mixolydian)"] },
    roadhouseRocker: { name: "Classic Rock/Roadhouse", progressions: ["E - A - B7", "I - bVII - IV - I (e.g. A - G - D - A)", "G - C - G - D"] }
  };

  const countSyllables = (word: string): number => {
    if (!word) return 0;
    word = word.toLowerCase().trim();
    if (word.length === 0) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
  };

  const processRawPhrases = useCallback(() => {
    const initialRawPhrases = [ 
      "Absolute chaos", "Velvet rain", "Dusty road", "Midnight train", "Golden tear",
      "Autumn wind", "Bitter truth", "Canyon echo", "Desert bloom", "Endless road",
      "Fading light", "Frozen tear", "Gentle hum", "Ghostly sigh", "Haunted mile",
      "Hollow sound", "Iron will", "Jagged edge", "Lost cause", "Lucid dream",
      "Magic hour", "Neon glow", "Noble heart", "Open sky", "Quiet night",
      "Raging fire", "Sacred ground", "Shattered glass", "Silent scream", "Silver moon",
      "Steel resolve", "Stolen kiss", "Sudden chill", "Sweet despair", "Tender touch",
      "Twilight zone", "Twisted vine", "Velvet fog", "Violent storm", "Wandering soul",
      "Whispered word", "Wild desire", "Worn-out shoes", "Amber glow", "Ashen sky",
      "Barren field", "Borrowed time", "Broken vow", "Burning bridge", "Changing tide",
      "Crooked smile", "Crystal stream", "Dancing flame", "Distant shore", "Empty room",
      "Fallen star", "Fatal flaw", "Final bow", "Forgotten song", "Frozen heart",
      "Guiding light", "Hidden scar", "Humble prayer", "Inner voice", "Last goodbye",
      "Lonely hour", "Misty dawn", "Narrow path", "New beginning", "Old guitar",
      "Pale moonlight", "Perfect crime", "Phantom limb", "Quiet town", "Rebel yell",
      "Restless heart", "Rising sun", "Rocky ground", "Sacred oath", "Sad cafe",
      "Secret wish", "Shadow play", "Shining armor", "Silver lining", "Simple truth",
      "Sleeping giant", "Slow burn", "Smoking gun", "Sole survivor", "Somber mood",
      "Southern drawl", "Steel guitar", "Stone cold", "Stormy weather", "Strange brew",
      "Streetlight halo", "Sudden fear", "Summer rain", "Sweet surrender", "Tangled web",
      "Tattered flag", "Temple bell", "Thin disguise", "Thousand lies", "Thunder road",
      "Timeless tale", "Troubled mind", "True north", "Twilight years", "Twisted fate",
      "Unbroken chain", "Uncommon man", "Unknown soldier", "Unseen hand", "Untold story",
      "Velvet glove", "Victory lap", "Vintage wine", "Wasted youth", "Weathered face",
      "Whiskey neat", "White knuckle", "Wild frontier", "Winter chill", "Wooden spoon",
      "Wounded knee", "Yellow moon", "Yesterday's news", "Young blood", "Zero hour", "Zigzag Trail", "Zillion Stars"
    ];
    const processed = initialRawPhrases.map(phrase => {
        const parts = phrase.split(' ');
        const noun = parts.pop() || "";
        const adjective = parts.join(' ');
        const syllablesAdjective = countSyllables(adjective);
        const syllablesNoun = countSyllables(noun);
        return {
            text: phrase,
            adjective: adjective,
            noun: noun,
            commonality: Math.floor(Math.random() * 5) + 1, 
            syllablesAdjective: syllablesAdjective,
            syllablesNoun: syllablesNoun,
            totalSyllables: syllablesAdjective + syllablesNoun
        };
    });
    setRawPhrases(processed);
  }, []);

  useEffect(() => {
    processRawPhrases();
    const savedFavorites = localStorage.getItem('lyricCompanionFavorites_v3');
    if (savedFavorites) {
      setFavoritePhrases(JSON.parse(savedFavorites));
    }
    loadProject();
  }, [processRawPhrases]);


  const applyPhraseFiltersAndSort = useCallback(() => {
    let tempFilteredPhrases = showingFavoritesOnly 
      ? rawPhrases.filter(p => favoritePhrases.includes(p.text)) 
      : [...rawPhrases];

    if (!showingFavoritesOnly) {
        if (phraseSearchTerm) {
            tempFilteredPhrases = tempFilteredPhrases.filter(phrase =>
                phrase.text.toLowerCase().includes(phraseSearchTerm.toLowerCase())
            );
        }
        if (phraseLetterFilter !== 'All') {
            tempFilteredPhrases = tempFilteredPhrases.filter(phrase =>
                phrase.adjective.toLowerCase().startsWith(phraseLetterFilter.toLowerCase())
            );
        }
        if (phraseCommonalityFilter !== 'all') {
            tempFilteredPhrases = tempFilteredPhrases.filter(phrase =>
                phrase.commonality === parseInt(phraseCommonalityFilter)
            );
        }
        const minSyll = parseInt(phraseMinSyllables);
        const maxSyll = parseInt(phraseMaxSyllables);
        if (!isNaN(minSyll)) {
            tempFilteredPhrases = tempFilteredPhrases.filter(phrase => phrase.totalSyllables >= minSyll);
        }
        if (!isNaN(maxSyll)) {
            tempFilteredPhrases = tempFilteredPhrases.filter(phrase => phrase.totalSyllables <= maxSyll);
        }
    }

    switch (phraseSortOption) {
        case 'alpha-asc': tempFilteredPhrases.sort((a, b) => a.text.localeCompare(b.text)); break;
        case 'alpha-desc': tempFilteredPhrases.sort((a, b) => b.text.localeCompare(a.text)); break;
        case 'commonality-desc': tempFilteredPhrases.sort((a, b) => b.commonality - a.commonality || a.text.localeCompare(b.text)); break;
        case 'commonality-asc': tempFilteredPhrases.sort((a, b) => a.commonality - b.commonality || a.text.localeCompare(b.text)); break;
        case 'syllables-asc': tempFilteredPhrases.sort((a, b) => a.totalSyllables - b.totalSyllables || a.text.localeCompare(b.text)); break;
        case 'syllables-desc': tempFilteredPhrases.sort((a, b) => b.totalSyllables - a.totalSyllables || a.text.localeCompare(b.text)); break;
    }
    setFilteredPhrases(tempFilteredPhrases);
  }, [rawPhrases, showingFavoritesOnly, favoritePhrases, phraseSearchTerm, phraseLetterFilter, phraseCommonalityFilter, phraseMinSyllables, phraseMaxSyllables, phraseSortOption]);

  useEffect(() => {
    applyPhraseFiltersAndSort();
  }, [applyPhraseFiltersAndSort]);
  
  const toggleFavoritePhrase = (phraseText: string) => {
    const newFavorites = favoritePhrases.includes(phraseText)
        ? favoritePhrases.filter(fav => fav !== phraseText)
        : [...favoritePhrases, phraseText];
    setFavoritePhrases(newFavorites);
    localStorage.setItem('lyricCompanionFavorites_v3', JSON.stringify(newFavorites));
  };

  const handleGetAIPhrases = async () => {
    setPhraseListLoading(true);
    try {
        const result = await ai.generatePhrases({ count: 10 });
        if (result.success && result.data) {
            const newPhrasesToAdd = result.data.phrases.map((phrase: string) => {
                const parts = phrase.split(' ');
                const noun = parts.pop() || "";
                const adjective = parts.join(' ');
                const syllablesAdjective = countSyllables(adjective);
                const syllablesNoun = countSyllables(noun);
                return {
                    text: phrase,
                    adjective,
                    noun,
                    commonality: Math.floor(Math.random() * 3) + 1,
                    syllablesAdjective,
                    syllablesNoun,
                    totalSyllables: syllablesAdjective + syllablesNoun,
                };
            });
            setRawPhrases(prev => [...newPhrasesToAdd, ...prev]); // Add new phrases to the top
            toast({ title: "AI Phrases Generated!", description: `${newPhrasesToAdd.length} new phrases added.` });
        } else {
            toast({ title: "Error", description: result.error || "Failed to generate AI phrases.", variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setPhraseListLoading(false);
    }
  };


  const handleStuckButtonClick = () => {
    const randomIndex = Math.floor(Math.random() * SONGWRITING_TIPS.length);
    setTipBoxText(SONGWRITING_TIPS[randomIndex]);
    setIsTipBoxVisible(true);
  };
  
  const appendToTextarea = (textareaId: string, textToAppend: string | undefined) => {
    if (!textToAppend || textToAppend.trim() === '') return;
    
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (textarea) {
        const currentText = textarea.value;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        
        const textBefore = currentText.substring(0, selectionStart);
        const textAfter  = currentText.substring(selectionEnd, currentText.length);
        
        const separator = (textBefore.length > 0 && !textBefore.endsWith('\n\n')) ? '\n\n' : (textBefore.length > 0 && !textBefore.endsWith('\n') ? '\n' : '');
        
        const newText = textBefore + separator + textToAppend.trim() + textAfter;
        
        if (textareaId === 'songCanvasTextArea') setSongCanvasText(newText);
        else if (textareaId === 'ideaCatcherTextAreaInput') setIdeaCatcherText(newText);
        else if (textareaId === 'melodicIdeasTextAreaInput') setMelodicIdeasText(newText);
        else if (textareaId === 'fullSongOutputTextarea') setFullSongDraft(newText);


        requestAnimationFrame(() => {
          const updatedTextarea = document.getElementById(textareaId) as HTMLTextAreaElement;
          if (updatedTextarea) {
            updatedTextarea.scrollTop = updatedTextarea.scrollHeight;
            const newCursorPosition = selectionStart + separator.length + textToAppend.trim().length;
            updatedTextarea.setSelectionRange(newCursorPosition, newCursorPosition);
            updatedTextarea.focus();
          }
        });
    }
  };

  const openGeminiModalWithSuggestion = async (title: string, action: () => Promise<{success: boolean, data?: any, error?: string}>, targetElementId: string | null = null) => {
    setGeminiModalTitle(title);
    setGeminiModalContent("");
    setGeminiModalLoader(true);
    setGeminiModalOpen(true);
    setGeminiModalSourceElementId(targetElementId);

    const result = await action();
    if (result.success && result.data) {
      let content = "";
      if (typeof result.data === 'string') {
        content = result.data;
      } else if (typeof result.data === 'object') {
        const primaryKey = Object.keys(result.data).find(key => typeof result.data[key] === 'string');
        if (primaryKey) {
          content = result.data[primaryKey];
        } else {
          content = JSON.stringify(result.data, null, 2); 
        }
      }
      setGeminiModalContent(content);
    } else {
      setGeminiModalContent(`Error: ${result.error || "Failed to get suggestion."}`);
    }
    setGeminiModalLoader(false);
  };
  
  const handleSendFromModalToCanvas = () => {
    if (geminiModalContent && !geminiModalContent.startsWith("Error:")) {
      appendToTextarea('songCanvasTextArea', geminiModalContent);
      setGeminiModalOpen(false);
    }
  };


  const handleToolAction = async (
    action: () => Promise<{success: boolean, data?: any, error?: string}>, 
    setter: (value: any) => void, 
    loaderSetter: (value: boolean) => void,
    initialText: string 
  ) => {
    loaderSetter(true);
    setter("Thinking..."); // Universal "thinking" message
    const result = await action();
    if (result.success && result.data) {
      let content: any;
      // Specific handling for different data structures
      if (typeof result.data === 'string') content = result.data;
      else if (result.data.overallConcept && typeof result.data.overallConcept === 'string') content = result.data; // MelodyIdeaOutput
      else if (result.data.prompt && typeof result.data.prompt === 'string') content = result.data.prompt; // Muse, Bridge
      else if (result.data.title && typeof result.data.title === 'string') content = result.data.title; // Album title
      else if (result.data.artistExamples && typeof result.data.artistExamples === 'string') content = result.data.artistExamples;
      else if (result.data.songSuggestion && typeof result.data.songSuggestion === 'string') { // Study song
         content = `Song Suggestion: ${result.data.songSuggestion}\n\nHow to Study It:\n${result.data.studyPlan}\n\nKey Takeaways:\n${result.data.keyTakeaways}`;
      }
      else if (result.data.rephrasedLine && typeof result.data.rephrasedLine === 'string') content = result.data.rephrasedLine;
      else if (result.data.moodAnalysis && typeof result.data.moodAnalysis === 'string') content = result.data.moodAnalysis;
      else if (result.data.metaphor && typeof result.data.metaphor === 'string') content = result.data.metaphor;
      else if (result.data.rhymeScheme && typeof result.data.rhymeScheme === 'string') content = result.data.rhymeScheme;
      else if (result.data.expandedSection && typeof result.data.expandedSection === 'string') content = result.data.expandedSection;
      else if (result.data.chordProgression && typeof result.data.chordProgression === 'string') content = result.data.chordProgression;
      else if (result.data.reharmonizedChords && typeof result.data.reharmonizedChords === 'string') content = result.data.reharmonizedChords;
      else if (result.data.suggestions && typeof result.data.suggestions === 'string') content = result.data.suggestions; // Voicing
      else if (result.data.instruments && typeof result.data.instruments === 'string') content = result.data.instruments; // Instrumentation
      else if (result.data.structure && typeof result.data.structure === 'string') content = result.data.structure; // Song structure
      else if (result.data.rhythmIdea && typeof result.data.rhythmIdea === 'string') content = result.data.rhythmIdea;
      else content = JSON.stringify(result.data, null, 2); // Fallback
      setter(content);
    } else {
      setter(`Error: ${result.error || "Failed to get suggestion."}`);
    }
    loaderSetter(false);
  };

  const saveProject = () => {
    const projectData: ProjectData = {
      title: songWorkingTitle,
      keyTempo: songKeyTempo,
      moodTheme: songMoodTheme,
      songCanvas: songCanvasText,
      ideaCatcher: ideaCatcherText,
      melodicIdeas: melodicIdeasText,
    };
    localStorage.setItem('mikesSongwritingProject_v1', JSON.stringify(projectData));
    setProjectStatusMessage(`Project saved! (${new Date().toLocaleTimeString()})`);
    setTimeout(() => setProjectStatusMessage(""), 3000);
  };

  const loadProject = () => {
    const savedData = localStorage.getItem('mikesSongwritingProject_v1');
    if (savedData) {
      const projectData: ProjectData = JSON.parse(savedData);
      setSongWorkingTitle(projectData.title || "");
      setSongKeyTempo(projectData.keyTempo || "");
      setSongMoodTheme(projectData.moodTheme || "");
      setSongCanvasText(projectData.songCanvas || "");
      setIdeaCatcherText(projectData.ideaCatcher || "");
      setMelodicIdeasText(projectData.melodicIdeas || "");
      setProjectStatusMessage("Project loaded successfully!");
    } else {
      setProjectStatusMessage("No saved project found.");
    }
    setTimeout(() => setProjectStatusMessage(""), 3000);
  };

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const clearProject = () => {
    localStorage.removeItem('mikesSongwritingProject_v1');
    setSongWorkingTitle("");
    setSongKeyTempo("");
    setSongMoodTheme("");
    setSongCanvasText("");
    setIdeaCatcherText("");
    setMelodicIdeasText("");
    setProjectStatusMessage("Saved project cleared.");
    setTimeout(() => setProjectStatusMessage(""), 3000);
    setConfirmClearOpen(false);
  };

  const exportSongDraft = () => {
    let draftContent = `Title: ${songWorkingTitle || 'Untitled'}\n`;
    draftContent += `Key/Tempo: ${songKeyTempo || 'Not set'}\n`;
    draftContent += `Mood/Theme: ${songMoodTheme || 'Not set'}\n\n`;
    if (ideaCatcherText.trim()) draftContent += `--- QUICK NOTES / SCRATCHPAD ---\n${ideaCatcherText.trim()}\n\n`;
    if (melodicIdeasText.trim()) draftContent += `--- MELODIC IDEAS / CONTOUR ---\n${melodicIdeasText.trim()}\n\n`;
    draftContent += `--- SONG DRAFT & LYRICS ---\n${songCanvasText || '(No main draft content)'}\n`;

    navigator.clipboard.writeText(draftContent)
      .then(() => setProjectStatusMessage('Song draft copied to clipboard!'))
      .catch(() => setProjectStatusMessage('Failed to copy draft.'));
    setTimeout(() => setProjectStatusMessage(""), 3000);
  };

  const structureBlockButtons = [
    { label: "Verse 1", structure: "[VERSE 1]" }, { label: "Verse 2", structure: "[VERSE 2]" },
    { label: "Chorus", structure: "[CHORUS]" }, { label: "Bridge", structure: "[BRIDGE]" },
    { label: "Pre-Chorus", structure: "[PRE-CHORUS]" }, { label: "Intro", structure: "[INTRO]" },
    { label: "Outro", structure: "[OUTRO]" }, { label: "Instrumental", structure: "[INSTRUMENTAL]" },
    { label: "Solo", structure: "[SOLO]" }, { label: "Tag", structure: "[TAG]" },
  ];

  const [selectedStructureCanvas, setSelectedStructureCanvas] = useState("");
  const [structureContextCanvas, setStructureContextCanvas] = useState("");
  const [structureLoaderCanvas, setStructureLoaderCanvas] = useState(false);

  const handleGenerateStructureCanvas = async () => {
    if (!selectedStructureCanvas) {
      toast({title: "Please select a structure", variant: "destructive"});
      return;
    }
    setStructureLoaderCanvas(true);
    const result = await ai.generateSongStructure({ songIdea: structureContextCanvas, selectedStructure: selectedStructureCanvas });
    if (result.success && result.data?.structure) {
      appendToTextarea('songCanvasTextArea', result.data.structure);
      toast({title: "Structure added to canvas!"});
    } else {
      toast({title: "Error generating structure", description: result.error, variant: "destructive"});
    }
    setStructureLoaderCanvas(false);
  };

  const handleCopyFavorites = () => {
    const textToCopy = favoritePhrases.join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast({ title: "Favorites Copied!", description: "All favorited phrases copied to clipboard."}))
      .catch(() => toast({ title: "Copy Failed", description: "Could not copy favorites.", variant: "destructive"}));
  };

  const [confirmClearFavoritesOpen, setConfirmClearFavoritesOpen] = useState(false);
  const handleClearFavorites = () => {
    setFavoritePhrases([]);
    localStorage.setItem('lyricCompanionFavorites_v3', JSON.stringify([]));
    toast({ title: "Favorites Cleared" });
    setConfirmClearFavoritesOpen(false);
  };

  const wordLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  const commonalityLevels = [
    { value: "all", label: "All Commonality Levels" },
    { value: "5", label: "5 (Familiar Echo)" }, { value: "4", label: "4 (Well-Known Turn)" },
    { value: "3", label: "3 (Indie Gem)" }, { value: "2", label: "2 (Deep Cut)" },
    { value: "1", label: "1 (Obscure Find)" },
  ];

  const songStructureOptions = [
    { value: "VCVCBC", label: "Verse-Chorus-Verse-Chorus-Bridge-Chorus" },
    { value: "VPCVPCBC", label: "Verse-PreChorus-Chorus-Verse-PreChorus-Chorus-Bridge-Chorus" },
    { value: "AABA", label: "AABA (Verse-Verse-Bridge-Verse)" },
    { value: "IntroVCVCBCOutro", label: "Intro-VCVCBC-Outro" },
    { value: "Let AI Decide", label: "Let AI Decide Structure (Artistic/Atypical)" },
  ];
  
  const rephraseStyleOptions = [
    { value: "Default", label: "Default Rephrase" }, { value: "More Literal", label: "More Literal" },
    { value: "More Symbolic/Metaphorical", label: "More Symbolic/Metaphorical" }, { value: "More Poetic", label: "More Poetic" },
    { value: "Darker Tone", label: "Darker Tone" }, { value: "Humorous", label: "Humorous" },
    { value: "Americana Vibe", label: "Americana/Folk Vibe" },
  ];

  const reharmStyleOptions = [
      { value: "Jazzier", label: "Jazzier (7ths, extensions)" }, { value: "More Modal", label: "More Modal (e.g., Dorian, Mixolydian feel)" },
      { value: "Add Passing Chords", label: "Add Passing Chords" }, { value: "Simpler", label: "Simpler (Basic triads)" },
      { value: "Bluesify", label: "Bluesify (Add blues notes/7ths)" }, { value: "Folkify", label: "Folkify (Common folk changes)" },
      { value: "Darker Harmony", label: "Darker Harmony (Minor substitutions, diminished)" }, { value: "Brighter Harmony", label: "Brighter Harmony (Major substitutions, suspensions)" },
  ];
  
  const reharmIntensityOptions = [
      { value: "Subtle", label: "Subtle Changes" }, { value: "Moderate", label: "Moderate Exploration" },
      { value: "Adventurous", label: "Adventurous & Jazzy" },
  ];

  const canvasFontOptions = [
    { value: "var(--font-special-elite), cursive", label: "Typewriter (Special Elite)"},
    { value: "var(--font-inter), sans-serif", label: "Modern (Inter)"},
    { value: "var(--font-homemade-apple), cursive", label: "Handwritten (Homemade Apple)"},
    { value: "var(--font-architects-daughter), cursive", label: "Sketchy (Architects Daughter)"},
    { value: "var(--font-covered-by-your-grace), cursive", label: "Graceful (Covered By Your Grace)"},
  ];

  const handleWordAssociationSubmit = async () => {
    if (!wordAssociationInput.trim()) return;
    const userMessage = { sender: 'user', text: wordAssociationInput };
    setWordAssociationChat(prev => [...prev, userMessage]);
    setWordAssociationLoader(true);
    const result = await ai.rhymeTennis({ word: wordAssociationInput });
    if (result.success && result.data?.rhyme) {
      const aiMessage = { sender: 'ai', text: result.data.rhyme };
      setWordAssociationChat(prev => [...prev, aiMessage]);
    } else {
      const errorMessage = { sender: 'ai', text: `Error: ${result.error || "Could not get rhyme."}`};
      setWordAssociationChat(prev => [...prev, errorMessage]);
    }
    setWordAssociationInput("");
    setWordAssociationLoader(false);
  };

  const handleAddLastAIRhymeToNotes = () => {
    if (wordAssociationChat.length > 0) {
      const lastMessage = wordAssociationChat[wordAssociationChat.length - 1];
      if (lastMessage.sender === 'ai' && !lastMessage.text.startsWith("Error:")) {
        appendToTextarea('ideaCatcherTextAreaInput', lastMessage.text);
        toast({ title: "Rhyme Added", description: "AI's last rhyme added to Quick Notes." });
      } else {
        toast({ title: "No Rhyme to Add", description: "The last message wasn't a usable AI rhyme.", variant: "default" });
      }
    } else {
      toast({ title: "No Rhyme to Add", description: "Chat is empty.", variant: "default" });
    }
  };

  const formatMelodyIdeaOutput = (output: MelodyIdeaOutput | string): string | JSX.Element => {
    if (typeof output === 'string') {
      return output;
    }
    if (output && typeof output === 'object' && output.overallConcept) {
      let content = [];
      content.push(<strong key="ocH">Overall Concept:</strong>);
      content.push(<span key="ocC" style={{ whiteSpace: 'pre-wrap'}}>{`\n${output.overallConcept}\n\n`}</span>);
      
      content.push(<strong key="saH">Suggested Approach:</strong>);
      content.push(<span key="saC" style={{ whiteSpace: 'pre-wrap'}}>{`\n${output.suggestedApproach}\n\n`}</span>);

      if (output.moodAndScales) {
        content.push(<strong key="msH">Mood & Scales:</strong>);
        content.push(<span key="msC" style={{ whiteSpace: 'pre-wrap'}}>{`\n${output.moodAndScales}\n\n`}</span>);
      }
      if (output.rhythmicIdeas) {
        content.push(<strong key="riH">Rhythmic Ideas:</strong>);
        content.push(<span key="riC" style={{ whiteSpace: 'pre-wrap'}}>{`\n${output.rhythmicIdeas}\n\n`}</span>);
      }
      if (output.keyConsiderations) {
        content.push(<strong key="kcH">Key Considerations:</strong>);
        content.push(<span key="kcC" style={{ whiteSpace: 'pre-wrap'}}>{`\n${output.keyConsiderations}`}</span>);
      }
      return <>{content}</>;
    }
    return "Melodic concepts await generation...";
  };
  
  const getMelodyIdeaTextForCanvas = (output: MelodyIdeaOutput | string): string => {
    if (typeof output === 'string') {
      return output.startsWith("Error:") || output === "Melodic concepts await generation..." || output === "Thinking..." ? "" : output;
    }
    if (output && typeof output === 'object' && output.overallConcept) {
      let text = `Overall Concept:\n${output.overallConcept}\n\n`;
      text += `Suggested Approach:\n${output.suggestedApproach}\n\n`;
      if (output.moodAndScales) text += `Mood & Scales:\n${output.moodAndScales}\n\n`;
      if (output.rhythmicIdeas) text += `Rhythmic Ideas:\n${output.rhythmicIdeas}\n\n`;
      if (output.keyConsiderations) text += `Key Considerations:\n${output.keyConsiderations}\n`;
      return text.trim();
    }
    return "";
  };

  const handleRandomPhrase = () => {
    const phraseSource = filteredPhrases.length > 0 ? filteredPhrases : rawPhrases;
    if (phraseSource.length > 0) {
      const randomIndex = Math.floor(Math.random() * phraseSource.length);
      const phrase = phraseSource[randomIndex].text;
      setRandomlySelectedPhrase(phrase);
      toast({ title: "Random Phrase Selected!", description: `"${phrase}" is ready. Use buttons below.`});
    } else {
      toast({ title: "No Phrases", description: "Phrase list is empty.", variant: "destructive"});
    }
  };


  return (
    <TooltipProvider>
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <header className="text-center mb-10">
        <h1 className="page-title-font text-5xl sm:text-6xl font-bold mb-2">The Songsmith's Den</h1>
        <p className="text-lg text-muted-foreground mt-2 dylan-quote">"He not busy being born is busy dying." &mdash; B. Dylan</p>
      </header>

      <Accordion type="multiple" defaultValue={['item-intro', 'item-canvas']} className="w-full space-y-6">
        {/* Intro Section */}
        <AccordionItem value="item-intro" className="main-section-box" id="introSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline">
            <h2 className="handwritten-main-title-font text-4xl">Welcome, Songwriter.</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <p className="text-foreground leading-relaxed text-base">
              This is your workshop, your quiet corner for crafting songs. A space for words to find their meter, for melodies to emerge, for entire pieces to take shape.
              Here, you'll find tools for lyrical inspiration, AI partners for rhyme and development, chord exploration utilities, and echoes of songwriting wisdom.
              It's designed to be a focused aid through creative moments, helping your ideas develop from a spark to a finished draft.
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              <h4 className="font-semibold scrapbook-note-font text-lg">Notes on the Craft: A Songwriting Flow</h4>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><strong>Start Anywhere:</strong> A title, a chord, an emotion, a single line. Don't wait for a grand vision.</li>
                <li><strong>Collect Ideas:</strong> Use the tools, jot notes in the "Quick Notes" or "Song Canvas." Capture everything.</li>
                <li><strong>Structure Can Emerge:</strong> Try a common structure, or let the song dictate its form. The "Structure Blocks" can guide.
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="link" size="sm" className="text-primary p-0 h-auto ml-1 hover:text-accent" onClick={() => document.getElementById('songCanvasSectionAccordionTrigger')?.click()}>Learn more.</Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Use the Song Structure Helper in The Songwriter's Canvas.</p></TooltipContent>
                  </Tooltip>
                </li>
                <li><strong>Rewrite & Refine:</strong> The first draft is a starting point. The "Word Lab" and "Chord Alchemist" offer fresh perspectives.</li>
                <li><strong>Listen Deeply:</strong> To your surroundings, to other artists ("Mentor's Corner"), and to the song forming within.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="my-6 text-center">
            <Button onClick={handleStuckButtonClick} className="btn-suggestion">
                <Lightbulb className="h-5 w-5 mr-2" />
                Creative Nudge
            </Button>
            {isTipBoxVisible && <div id="tipBox" className="mt-3">{tipBoxText}</div>}
        </div>

        {/* How To Section */}
        <AccordionItem value="item-how-to" className="main-section-box" id="howToSection">
            <AccordionTrigger className="collapsible-header-style hover:no-underline">
                <h2 className="handwritten-section-title-font">A Suggested Workflow</h2>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
                 <p className="text-foreground space-y-4 mt-4">This workspace offers a suite of tools. Here’s one way to approach songwriting with them:</p>
                 <ol className="list-decimal list-inside ml-4 space-y-3 mt-2">
                     <li>
                         <strong>Find Your Spark (Sparks & Muses Section):</strong>
                         <ul className="list-disc list-inside ml-6 space-y-1 mt-1">
                             <li>Generate <strong className="text-[hsl(var(--secondary))]">Thematic Prompts</strong>.</li>
                             <li>Get ideas for your song's <strong className="text-[hsl(var(--accent))]">Bridge Builder</strong>.</li>
                             <li>Seek wisdom in the <strong className="text-[hsl(var(--primary))]">Poet's Corner</strong> (Dylan quotes).</li>
                             <li>Find a name with the <strong className="text-[hsl(var(--secondary))]">Album Title Generator</strong>.</li>
                             <li>Get a <strong className="text-[hsl(var(--accent))]">Melody Spark</strong> from the Memo.</li>
                             <li>Consult the <strong className="text-[hsl(var(--primary))]">Rhythm Architect</strong>.</li>
                             <li>Find <strong className="text-[hsl(var(--secondary))]">Artist Inspiration</strong>.</li>
                              <li><strong className="text-[hsl(var(--accent))]">Study a Song</strong>.</li>
                             <li>Any spark? Use "Add to..." buttons to send it to your Song Canvas or notes.</li>
                         </ul>
                     </li>
                     <li>
                         <strong>Develop Lyrics (Lyrical Toolkit Section):</strong>
                         <ul className="list-disc list-inside ml-6 space-y-1 mt-1">
                            <li>Engage in <strong className="text-[hsl(var(--foreground)/0.8)]">Word Association Tennis</strong>.</li>
                            <li>Explore the <strong className="text-[hsl(var(--secondary))]">Phrase Spark</strong>.</li>
                            <li>Take lines to the <strong className="text-[hsl(var(--accent))]">Word Lab</strong>.</li>
                            <li>Build imagery with the <strong className="text-[hsl(var(--primary))]">Metaphor Builder</strong>.</li>
                            <li>Analyze tone with the <strong className="text-[hsl(var(--secondary))]">Lyrical Mood Ring</strong>.</li>
                            <li>Discover patterns with the <strong className="text-[hsl(var(--accent))]">Rhyme Scheme Generator</strong>.</li>
                            <li>Expand phrases with the <strong className="text-[hsl(var(--primary))]">Section Expander</strong>.</li>
                            <li>Draft lyrics in <strong className="text-[hsl(var(--primary))]">The Songwriter's Canvas</strong>.</li>
                         </ul>
                     </li>
                     <li>
                        <strong>Explore Musical Ideas (Musical Toolkit Section):</strong>
                        <ul className="list-disc list-inside ml-6 space-y-1 mt-1">
                            <li>Get chord ideas from <strong className="text-[hsl(var(--secondary))]">Chord Corner</strong>.</li>
                            <li>Use <strong className="text-[hsl(var(--accent))]">The Chord Forge</strong>.</li>
                            <li>Twist progressions with <strong className="text-[hsl(var(--primary))]">The Chord Alchemist</strong>.</li>
                            <li>Get voicing ideas with <strong className="text-[hsl(var(--secondary))]">Chord Voicing Suggester</strong>.</li>
                            <li>Find <strong className="text-[hsl(var(--accent))]">Instrumentation Inspiration</strong>.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Full Song Draft (AI Song Generator):</strong> For a comprehensive starting point.
                    </li>
                    <li>
                        <strong>The Songwriter's Canvas:</strong> Your central hub.
                        <ul className="list-disc list-inside ml-6 space-y-1 mt-1">
                            <li>Set <strong className="text-[hsl(var(--primary))]">Working Title</strong>, <strong className="text-[hsl(var(--primary))]">Key/Tempo</strong>, <strong className="text-[hsl(var(--primary))]">Mood/Theme</strong>.</li>
                            <li>Use <strong className="text-[hsl(var(--muted-foreground))]">Quick Notes / Scratchpad</strong>.</li>
                             <li>Sketch in <strong className="text-[hsl(var(--muted-foreground))]">Melodic Ideas / Contour Notes</strong>.</li>
                            <li>Main <strong className="text-[hsl(var(--foreground))]">Song Draft & Lyrics</strong> area.</li>
                            <li><strong className="text-[hsl(var(--primary))]">Save/Load Project</strong>.</li>
                        </ul>
                    </li>
                 </ol>
                  <p><strong className="text-[hsl(var(--foreground))]">The Backstage Pass (Modal):</strong> AI suggestions for rhymes and expanded phrases appear here.</p>
            </AccordionContent>
        </AccordionItem>

        {/* Sparks & Muses Section */}
        <AccordionItem value="item-sparks" className="main-section-box" id="sparksMusesSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline">
            <h2 className="sparks-muses-title main-section-title">Sparks & Muses</h2>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {/* Thematic Prompts */}
            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="thematic-prompts-title subsection-title">Thematic Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"An artist has got to be careful never really to arrive at a place where he thinks he's AT somewhere."</p>
                <Button onClick={() => handleToolAction(ai.summonMuse, setMusePrompt, setMuseLoader, "Awaiting thematic prompts...")} disabled={museLoader} className="w-full" variant="secondary">
                  {museLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Get Prompt
                </Button>
                <div className="output-display-area" id="musePromptDisplayOutput">{musePrompt}</div>
                {musePrompt !== "Awaiting thematic prompts..." && !musePrompt.startsWith("Error") && (
                  <div className="send-buttons-container">
                    <Button onClick={() => appendToTextarea('songCanvasTextArea', musePrompt)} variant="outline">Add to Song Canvas</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Album Title Generator */}
            <Card className="tool-card">
              <CardHeader><CardTitle className="album-title-generator-title subsection-title">Album Title Generator</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"I contain multitudes."</p>
                <Button onClick={() => handleToolAction(ai.generateAlbumTitle, setAlbumTitle, setAlbumTitleLoader, "Generate a title idea.")} disabled={albumTitleLoader} className="w-full" variant="default">
                  {albumTitleLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Generate Title
                </Button>
                <div className="output-display-area alt-heading-font flex items-center justify-center h-20 text-3xl" style={{color: "hsl(var(--accent-foreground))", backgroundColor: "hsl(var(--accent)/0.7)"}} id="albumTitleDisplayOutput">{albumTitle}</div>
                {albumTitle !== "Generate a title idea." && !albumTitle.startsWith("Error") && (
                  <div className="send-buttons-container">
                    <Button onClick={() => setSongWorkingTitle(albumTitle)} variant="outline">Set as Song Title</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Poet's Corner */}
            <Card className="tool-card">
              <CardHeader><CardTitle className="poets-corner-title subsection-title">Poet's Corner</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"I'll let you be in my dreams if I can be in yours."</p>
                <Button onClick={() => {
                    const randomIndex = Math.floor(Math.random() * DYLAN_QUOTES.length);
                    setDylanQuote(`"${DYLAN_QUOTES[randomIndex]}"`);
                }} className="w-full" variant="ghost">
                  <BookOpen className="mr-2 h-4 w-4" /> Get Dylan Quote
                </Button>
                <div className="output-display-area dylan-quote text-lg min-h-[8rem] flex items-center justify-center" style={{borderColor: "hsl(var(--secondary))"}} id="dylanQuoteDisplayOutput">{dylanQuote}</div>
                {dylanQuote !== "What's the word on the wire today?" && (
                  <div className="send-buttons-container">
                    <Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', dylanQuote)} variant="outline">Add to Notes</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Bridge Builder */}
            <Card className="tool-card md:col-span-1 lg:col-span-2">
              <CardHeader><CardTitle className="bridge-builder-title subsection-title">Bridge Builder Prompts</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"A bridge can still be built, while the bitter waters are rising."</p>
                <div className="space-y-2 mb-3">
                    <Label htmlFor="bridgeContextInput">Main Theme/Chorus Idea (Optional):</Label>
                    <Input id="bridgeContextInput" value={bridgeContext} onChange={(e) => setBridgeContext(e.target.value)} placeholder="e.g., a song about lost love and train tracks" />
                </div>
                <Button onClick={() => handleToolAction(() => ai.generateBridgePrompt({context: bridgeContext}), setBridgePrompt, setBridgeLoader, "Suggestions for your bridge...")} disabled={bridgeLoader} className="w-full" variant="default">
                  {bridgeLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />} Get Bridge Idea
                </Button>
                <div className="output-display-area" id="bridgePromptDisplayOutput">{bridgePrompt}</div>
                 {bridgePrompt !== "Suggestions for your bridge..." && !bridgePrompt.startsWith("Error") && (
                  <div className="send-buttons-container">
                    <Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', bridgePrompt)} variant="outline">Add to Notes</Button>
                  </div>
                )}
              </CardContent>
            </Card>
             {/* Melody Spark */}
            <Card className="tool-card">
                <CardHeader><CardTitle className="melody-spark-title subsection-title">Melody Maker's Memo</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 dylan-quote text-sm">"May your song always be sung."</p>
                    <Button onClick={() => handleToolAction(() => ai.generateMelodyIdea({ query: "" }), setMelodyIdeaOutput, setMelodyIdeaLoader, "Melodic concepts await generation...")} disabled={melodyIdeaLoader} className="w-full" variant="ghost">
                        {melodyIdeaLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Music2 className="mr-2 h-4 w-4" />} Get Melodic Idea
                    </Button>
                    <div className="output-display-area" id="melodyIdeaDisplayOutput">
                      {formatMelodyIdeaOutput(melodyIdeaOutput)}
                    </div>
                    {getMelodyIdeaTextForCanvas(melodyIdeaOutput) && (
                        <div className="send-buttons-container">
                            <Button onClick={() => appendToTextarea('melodicIdeasTextAreaInput', getMelodyIdeaTextForCanvas(melodyIdeaOutput))} variant="outline">Add to Melodic Ideas</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Rhythm Architect */}
            <Card className="tool-card">
                <CardHeader><CardTitle className="rhythm-architect-title subsection-title">Rhythm Architect</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 dylan-quote text-sm">"The tempo is what it is."</p>
                    <Button onClick={() => handleToolAction(() => ai.generateRhythmIdea({}), setRhythmIdea, setRhythmIdeaLoader, "Rhythmic concepts await discovery...")} disabled={rhythmIdeaLoader} className="w-full" variant="secondary">
                         {rhythmIdeaLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SlidersHorizontal className="mr-2 h-4 w-4" />} Get Rhythm Idea
                    </Button>
                    <div className="output-display-area" id="rhythmIdeaDisplayOutput">{rhythmIdea}</div>
                     {rhythmIdea !== "Rhythmic concepts await discovery..." && !rhythmIdea.startsWith("Error") && (
                        <div className="send-buttons-container">
                            <Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', rhythmIdea)} variant="outline">Add to Notes</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Artist Inspiration */}
            <Card className="tool-card md:col-span-3">
                <CardHeader><CardTitle className="artist-inspiration-title subsection-title">Mentor's Corner (Artist Inspiration)</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 dylan-quote text-sm">"I think a hero is any person really intent on making this a better place for all people."</p>
                    <div className="space-y-2 mb-3">
                        <Label htmlFor="desiredQualityInput">Looking for inspiration in...</Label>
                        <Input id="desiredQualityInput" value={desiredQuality} onChange={(e) => setDesiredQuality(e.target.value)} placeholder="e.g., 'Poetic Lyrics', 'Unique Chord Changes'" />
                    </div>
                    <Button onClick={() => handleToolAction(() => ai.getArtistInspiration({ desiredQuality }), setArtistInspiration, setArtistInspirationLoader, "Artist examples will appear here.")} disabled={artistInspirationLoader || !desiredQuality} className="w-full" variant="secondary">
                        {artistInspirationLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />} Find Artist Inspiration
                    </Button>
                    <div className="output-display-area" id="artistInspirationOutputResult">{artistInspiration}</div>
                    {artistInspiration !== "Artist examples will appear here." && !artistInspiration.startsWith("Error") && (
                        <div className="send-buttons-container">
                            <Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', artistInspiration)} variant="outline">Add to Notes</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
             {/* Study a Song */}
            <Card className="tool-card md:col-span-3">
                <CardHeader><CardTitle className="study-song-title subsection-title">Mentor's Discography (Study a Song)</CardTitle></CardHeader>
                <CardContent>
                     <p className="text-muted-foreground mb-4 dylan-quote text-sm">"A song is anything that can walk by itself."</p>
                    <div className="space-y-2 mb-3">
                        <Label htmlFor="songStudyQueryInput">What kind of song or technique to study? (Optional)</Label>
                        <Input id="songStudyQueryInput" value={songStudyQuery} onChange={(e) => setSongStudyQuery(e.target.value)} placeholder="e.g., Songs with great storytelling in G" />
                    </div>
                    <Button onClick={() => handleToolAction(() => ai.studySong({ query: songStudyQuery }), setStudySongResult, setStudySongLoader, "Song study suggestions will appear here.")} disabled={studySongLoader} className="w-full" variant="default">
                       {studySongLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Library className="mr-2 h-4 w-4" />} Get Song Study Suggestion
                    </Button>
                    <div className="output-display-area" id="studySongOutputResult">{studySongResult}</div>
                    {studySongResult !== "Song study suggestions will appear here." && !studySongResult.startsWith("Error") && (
                        <div className="send-buttons-container">
                             <Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', studySongResult)} variant="outline">Add to Notes</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        {/* Lyrical Toolkit Section */}
        <AccordionItem value="item-lyrical" className="main-section-box" id="lyricalToolkitSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline">
            <h2 className="lyrical-toolkit-title main-section-title">Lyrical Toolkit</h2>
          </AccordionTrigger>
          <AccordionContent className="space-y-8 pt-4">
            {/* Word Association Tennis */}
            <Card className="tool-card">
              <CardHeader><CardTitle className="word-association-title subsection-title">Word Association Tennis</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"You want to know what it is to be a songwriter? Write songs."</p>
                <div className="word-association-chat mb-4">
                  {wordAssociationChat.length === 0 ? (
                    <p className="text-muted-foreground">Start a rally by typing a word or phrase below!</p>
                  ) : (
                    wordAssociationChat.map((msg, index) => (
                      <p key={index} className={msg.sender === 'user' ? 'word-association-message-user' : 'word-association-message-ai'}>
                        {msg.text}
                      </p>
                    ))
                  )}
                </div>
                <div className="flex gap-2 mb-3">
                  <Input id="wordAssociationInput" value={wordAssociationInput} onChange={(e) => setWordAssociationInput(e.target.value)} placeholder="e.g., 'blue', 'whisper of the wind'" 
                    onKeyPress={(e) => e.key === 'Enter' && handleWordAssociationSubmit()} className="flex-grow"
                  />
                  <Button onClick={handleWordAssociationSubmit} disabled={wordAssociationLoader} variant="secondary" className="whitespace-nowrap">
                    {wordAssociationLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />} Send
                  </Button>
                </div>
                <Button onClick={handleAddLastAIRhymeToNotes} variant="outline" size="sm" className="w-full">
                  <FilePlus2 className="mr-2 h-4 w-4" /> Add AI's Last Rhyme to Notes
                </Button>
              </CardContent>
            </Card>

            {/* Phrase Spark */}
            <Card className="tool-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="phrase-spark-title subsection-title">Phrase Spark</CardTitle>
                <Button onClick={() => setShowPhraseList(!showPhraseList)} variant="outline" className="btn-toggle-phrases">
                  {showPhraseList ? 'Hide' : 'Show'} Phrases <ListFilter className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 dylan-quote text-sm">"May your song always be sung."</p>
                {showPhraseList && (
                  <>
                    <div className="space-y-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div><Label htmlFor="phraseSearchInput">Search Phrases</Label><Input id="phraseSearchInput" value={phraseSearchTerm} onChange={(e) => setPhraseSearchTerm(e.target.value)} placeholder="Find that fleeting phrase..." /></div>
                        <div><Label htmlFor="phraseCommonalityFilter">Filter by Commonality</Label>
                          <Select value={phraseCommonalityFilter} onValueChange={setPhraseCommonalityFilter}>
                            <SelectTrigger><SelectValue placeholder="All Commonality Levels" /></SelectTrigger>
                            <SelectContent>{commonalityLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Filter by Total Syllables</Label><div className="flex gap-2">
                          <Input type="number" value={phraseMinSyllables} onChange={(e) => setPhraseMinSyllables(e.target.value)} placeholder="Min" className="w-1/2" />
                          <Input type="number" value={phraseMaxSyllables} onChange={(e) => setPhraseMaxSyllables(e.target.value)} placeholder="Max" className="w-1/2" />
                        </div></div>
                      </div>
                      <div><Label>Filter by Adjective's First Letter</Label><div className="flex flex-wrap gap-1 mt-1">
                        <Button variant={phraseLetterFilter === 'All' ? 'default': 'outline'} size="sm" onClick={() => setPhraseLetterFilter('All')}>All</Button>
                        {wordLetters.map(letter => <Button key={letter} variant={phraseLetterFilter === letter ? 'default': 'outline'} size="sm" onClick={() => setPhraseLetterFilter(letter)}>{letter}</Button>)}
                      </div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div><Label htmlFor="phraseSortOptions">Sort By</Label>
                          <Select value={phraseSortOption} onValueChange={setPhraseSortOption}>
                            <SelectTrigger><SelectValue placeholder="Alphabetical (A-Z)" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alpha-asc">Alphabetical (A-Z)</SelectItem><SelectItem value="alpha-desc">Alphabetical (Z-A)</SelectItem>
                              <SelectItem value="commonality-desc">Commonality (High-Low)</SelectItem><SelectItem value="commonality-asc">Commonality (Low-High)</SelectItem>
                              <SelectItem value="syllables-asc">Total Syllables (Low-High)</SelectItem><SelectItem value="syllables-desc">Total Syllables (High-Low)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
                          <Button onClick={handleRandomPhrase} variant="default"><Shuffle className="mr-2 h-4 w-4" />Random Phrase</Button>
                          <Button onClick={handleGetAIPhrases} disabled={phraseListLoading} variant="ghost">
                            {phraseListLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Get AI Phrases
                          </Button>
                          <Button onClick={() => setShowingFavoritesOnly(!showingFavoritesOnly)} variant={showingFavoritesOnly ? "default" : "outline"}>
                            <Star className="mr-2 h-4 w-4" />Show Favorites ({favoritePhrases.length})
                          </Button>
                        </div>
                      </div>
                      {randomlySelectedPhrase && (
                        <div className="mt-4 p-3 border border-dashed rounded bg-muted/30">
                          <p className="text-sm text-muted-foreground">Randomly Selected:</p>
                          <p className="font-semibold text-lg mb-2" style={{fontFamily: "var(--font-caveat)"}}>{randomlySelectedPhrase}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setLineToRephrase(randomlySelectedPhrase); setSectionExpanderInputText(randomlySelectedPhrase); toast({title: "Phrase Sent!", description: "Ready in Word Lab & Section Expander."})}}>
                               <Edit3 className="mr-1 h-3 w-3"/> Use in Word Lab
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { appendToTextarea('ideaCatcherTextAreaInput', randomlySelectedPhrase); toast({title: "Phrase Added!", description: "Added to Quick Notes."})}}>
                               <FilePlus2 className="mr-1 h-3 w-3"/> Add to Notes
                            </Button>
                          </div>
                        </div>
                      )}
                      {showingFavoritesOnly && favoritePhrases.length > 0 && (
                        <div className="mt-4 flex gap-2">
                          <Button onClick={handleCopyFavorites}><Copy className="mr-2 h-4 w-4" />Copy Favorites</Button>
                          <AlertDialog open={confirmClearFavoritesOpen} onOpenChange={setConfirmClearFavoritesOpen}>
                            <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Clear Favorites</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Clear All Favorites?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleClearFavorites}>Yes, Clear</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground my-4"><em>Wander through these word pairings... "May your song always be sung."</em></p>
                    {phraseListLoading && <div className="loader">Loading phrases...</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto p-2 border-2 border-dashed rounded bg-card/50">
                      {filteredPhrases.map(phrase => (
                        <Card key={phrase.text} className="phrase-card p-3 flex flex-col bg-background shadow-sm hover:shadow-lg transition-shadow border-muted-foreground">
                           <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-semibold mb-1 cursor-pointer text-lg" style={{fontFamily: "var(--font-caveat)"}} onDragStart={(e) => { e.dataTransfer.setData('text/plain', phrase.text); e.dataTransfer.effectAllowed = 'copy';}} draggable>{phrase.text}</span>
                            </TooltipTrigger>
                            <TooltipContent><p>Drag to canvas</p></TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-muted-foreground mb-2">Comm: {phrase.commonality} | Syll: {phrase.totalSyllables} (A:{phrase.syllablesAdjective}, N:{phrase.syllablesNoun})</div>
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed">
                            <div className="flex gap-1">
                              <Tooltip><TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => openGeminiModalWithSuggestion(`Rhymes for "${phrase.noun}"`, () => ai.rhymeTennis({ word: phrase.noun }), null)}>Rhyme <Sparkles className="ml-1 h-3 w-3" /></Button>
                              </TooltipTrigger><TooltipContent>Get rhymes for "{phrase.noun}"</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => openGeminiModalWithSuggestion(`Expanding on "${phrase.text}"`, () => ai.expandSection({ idea: phrase.text, expandType: 'verse'}), null)}>Expand <Sparkles className="ml-1 h-3 w-3" /></Button>
                              </TooltipTrigger><TooltipContent>Expand on "{phrase.text}"</TooltipContent></Tooltip>
                            </div>
                            <Tooltip><TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => toggleFavoritePhrase(phrase.text)} className={`hover:text-red-500 ${favoritePhrases.includes(phrase.text) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                <Star className={`h-5 w-5 ${favoritePhrases.includes(phrase.text) ? 'fill-current' : ''}`} />
                              </Button>
                            </TooltipTrigger><TooltipContent>{favoritePhrases.includes(phrase.text) ? 'Unfavorite' : 'Favorite'}</TooltipContent></Tooltip>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {filteredPhrases.length === 0 && !phraseListLoading && <p className="text-center text-muted-foreground py-8 text-lg">No phrases match your search right now.</p>}
                  </>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Word Lab */}
              <Card className="tool-card">
                <CardHeader><CardTitle className="sonic-lab-title subsection-title">Word Lab</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 dylan-quote text-sm">"Even the President of the United States must sometimes have to stand naked."</p>
                  <div className="space-y-2 mb-3">
                    <Label htmlFor="lineToRephrase">Enter a line to rephrase:</Label>
                    <Input id="lineToRephrase" value={lineToRephrase} onChange={(e) => setLineToRephrase(e.target.value)} placeholder="e.g., The sun is bright" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <Label htmlFor="rephraseStyleSelectWordLab">Rephrasing Style:</Label>
                    <Select value={rephraseStyle} onValueChange={setRephraseStyle}>
                      <SelectTrigger id="rephraseStyleSelectWordLab"><SelectValue /></SelectTrigger>
                      <SelectContent>{rephraseStyleOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleToolAction(() => ai.rephraseLine({ lineToRephrase, rephraseStyle }), setRephrasedLine, setLyricalLabLoader, "Rephrased line will appear here.")} disabled={lyricalLabLoader || !lineToRephrase} className="w-full" variant="ghost">
                    {lyricalLabLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />} Rephrase Line
                  </Button>
                  <div className="output-display-area" id="rephrasedLineOutput">{rephrasedLine}</div>
                  {rephrasedLine !== "Rephrased line will appear here." && !rephrasedLine.startsWith("Error") && (
                    <div className="send-buttons-container">
                      <Button onClick={() => appendToTextarea('songCanvasTextArea', rephrasedLine)} variant="outline">Add to Song Draft</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Lyrical Mood Ring */}
              <Card className="tool-card">
                <CardHeader><CardTitle className="lyrical-mood-ring-title subsection-title">Lyrical Mood Ring</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 dylan-quote text-sm">"You don't need a weatherman to know which way the wind blows."</p>
                  <div className="space-y-2 mb-3">
                    <Label htmlFor="lyricsToAnalyze">Paste lyrics to analyze mood:</Label>
                    <Textarea id="lyricsToAnalyze" value={lyricsToAnalyze} onChange={(e) => setLyricsToAnalyze(e.target.value)} placeholder="Your lyrics here..." rows={4} />
                  </div>
                  <Button onClick={() => handleToolAction(() => ai.analyzeLyricalMood({ lyrics: lyricsToAnalyze }), setLyricalMood, setLyricalMoodLoader, "Lyrical mood analysis pending.")} disabled={lyricalMoodLoader || !lyricsToAnalyze} className="w-full" variant="ghost">
                    {lyricalMoodLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />} Analyze Mood
                  </Button>
                  <div className="output-display-area" id="lyricalMoodOutput">{lyricalMood}</div>
                </CardContent>
              </Card>
            </div>
             {/* Metaphor Builder */}
            <Card className="tool-card">
                <CardHeader><CardTitle className="metaphor-builder-title subsection-title">Metaphor Builder</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 dylan-quote text-sm">"All the truth in the world adds up to one big lie." - Find a new way to say it.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2"><Label htmlFor="metaphorConceptInput">Concept/Object for Metaphor:</Label><Input id="metaphorConceptInput" value={metaphorConcept} onChange={e => setMetaphorConcept(e.target.value)} placeholder="e.g., love, a river, journey" /></div>
                        <div className="space-y-2"><Label htmlFor="metaphorFeelingInput">Desired Feeling/Comparison (Optional):</Label><Input id="metaphorFeelingInput" value={metaphorFeeling} onChange={e => setMetaphorFeeling(e.target.value)} placeholder="e.g., fleeting, strong, like a storm" /></div>
                    </div>
                    <Button onClick={() => handleToolAction(() => ai.generateMetaphor({ concept: metaphorConcept, feeling: metaphorFeeling }), setMetaphorResult, setMetaphorLoader, "Metaphorical insights await.")} disabled={metaphorLoader || !metaphorConcept} className="w-full" variant="default">
                        {metaphorLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Build Metaphor
                    </Button>
                    <div className="output-display-area" id="metaphorResultOutput">{metaphorResult}</div>
                    {metaphorResult !== "Metaphorical insights await." && !metaphorResult.startsWith("Error") && (
                        <div className="send-buttons-container">
                            <Button onClick={() => appendToTextarea('songCanvasTextArea', metaphorResult)} variant="outline">Add to Song Draft</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Rhyme Scheme Generator */}
            <Card className="tool-card">
              <CardHeader><CardTitle className="rhyme-scheme-title subsection-title">Rhyme Scheme Generator</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"I was so much older then, I'm younger than that now."</p>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="rhymeSchemeInputText">Enter a few lines or a topic:</Label>
                  <Textarea id="rhymeSchemeInputText" value={rhymeSchemeInputText} onChange={(e) => setRhymeSchemeInputText(e.target.value)} placeholder="e.g., The road unwinds before me / A story yet untold" rows={3} />
                </div>
                <Button onClick={() => handleToolAction(() => ai.generateRhymeScheme({ inputText: rhymeSchemeInputText }), setRhymeSchemeResult, setRhymeSchemeLoader, "Rhyme scheme analysis will appear here.")} disabled={rhymeSchemeLoader || !rhymeSchemeInputText} className="w-full" variant="ghost">
                  {rhymeSchemeLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rows className="mr-2 h-4 w-4" />} Get Rhyme Scheme
                </Button>
                <div className="output-display-area" id="rhymeSchemeResultOutput">{rhymeSchemeResult}</div>
                {rhymeSchemeResult !== "Rhyme scheme analysis will appear here." && !rhymeSchemeResult.startsWith("Error") && (
                    <div className="send-buttons-container">
                        <Button onClick={() => appendToTextarea('songCanvasTextArea', rhymeSchemeResult)} variant="outline">Add to Song Draft</Button>
                    </div>
                )}
              </CardContent>
            </Card>
            {/* Section Expander */}
            <Card className="tool-card">
              <CardHeader><CardTitle className="section-expander-title subsection-title">Section Expander</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 dylan-quote text-sm">"A song is anything that can walk by itself."</p>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="sectionExpanderInputText">Enter a starting line or idea:</Label>
                  <Textarea id="sectionExpanderInputText" value={sectionExpanderInputText} onChange={(e) => setSectionExpanderInputText(e.target.value)} placeholder="e.g., The city sleeps under a blanket of stars" rows={3} />
                </div>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="sectionExpanderTypeSelect">Expand to:</Label>
                  <Select value={sectionExpanderType} onValueChange={setSectionExpanderType}>
                    <SelectTrigger id="sectionExpanderTypeSelect"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verse">Verse</SelectItem><SelectItem value="chorus">Chorus</SelectItem><SelectItem value="bridge">Bridge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleToolAction(() => ai.expandSection({ idea: sectionExpanderInputText, expandType: sectionExpanderType as "verse"|"chorus"|"bridge" }), setSectionExpanderResult, setSectionExpanderLoader, "Expanded lyrical section will appear here.")} disabled={sectionExpanderLoader || !sectionExpanderInputText} className="w-full" variant="ghost">
                  {sectionExpanderLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Columns className="mr-2 h-4 w-4" />} Expand Section
                </Button>
                <div className="output-display-area" id="sectionExpanderResultOutput">{sectionExpanderResult}</div>
                 {sectionExpanderResult !== "Expanded lyrical section will appear here." && !sectionExpanderResult.startsWith("Error") && (
                    <div className="send-buttons-container">
                        <Button onClick={() => appendToTextarea('songCanvasTextArea', sectionExpanderResult)} variant="outline">Add to Song Draft</Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Musical Toolkit Section */}
        <AccordionItem value="item-musical" className="main-section-box" id="musicalToolkitSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline">
            <h2 className="musical-toolkit-title main-section-title">Musical Toolkit</h2>
          </AccordionTrigger>
          <AccordionContent className="space-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chord Corner */}
              <Card className="tool-card">
                <CardHeader><CardTitle className="riff-altar-title subsection-title">Chord Corner</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 dylan-quote text-sm">"Chaos is a friend of mine."</p>
                  <div className="space-y-2 mb-3">
                    <Label htmlFor="moodSelectorChordCorner">Select a Mood:</Label>
                    <Select value={selectedMood} onValueChange={(value) => {
                        setSelectedMood(value);
                        if (value && CHORD_PROGRESSIONS[value]) {
                            const mood = CHORD_PROGRESSIONS[value];
                            setChordProgression(`<h4 class="text-lg font-semibold mb-2" style="color:hsl(var(--secondary)); font-family: var(--font-architects-daughter);">${mood.name} Progressions:</h4>` + mood.progressions.map(p => `<div class="mb-1">${p}</div>`).join(''));
                        } else {
                            setChordProgression('Select a mood for chord progressions.');
                        }
                    }}>
                      <SelectTrigger id="moodSelectorChordCorner"><SelectValue placeholder="-- Choose a Vibe --" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(CHORD_PROGRESSIONS).map(([key, mood]) => (
                          <SelectItem key={key} value={key}>{mood.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="output-display-area" dangerouslySetInnerHTML={{ __html: chordProgression }} id="chordProgressionDisplayOutput" />
                  {selectedMood && chordProgression !== "Select a mood for chord progressions." && (
                    <div className="send-buttons-container">
                      <Button onClick={() => appendToTextarea('songCanvasTextArea', chordProgression.replace(/<[^>]+>/g, '\n').replace(/\n\n+/g, '\n').trim())} variant="outline">Send to Song Canvas</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Chord Alchemist (Reharmonizer) */}
              <Card className="tool-card">
                <CardHeader><CardTitle className="chord-reharmonizer-title subsection-title">The Chord Alchemist</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 dylan-quote text-sm">"I change during the course of a day."</p>
                  <div className="space-y-2 mb-3"><Label htmlFor="originalChordsInputReharm">Original Chords (e.g., C - G - Am - F)</Label><Input id="originalChordsInputReharm" value={originalChords} onChange={(e) => setOriginalChords(e.target.value)} placeholder="Enter your chord progression" /></div>
                  <div className="space-y-2 mb-3"><Label htmlFor="reharmStyleSelectInput">Reharmonization Style</Label>
                    <Select value={reharmStyle} onValueChange={setReharmStyle}><SelectTrigger id="reharmStyleSelectInput"><SelectValue /></SelectTrigger>
                      <SelectContent>{reharmStyleOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 mb-3"><Label htmlFor="reharmIntensitySelectInput">Reharmonization Intensity:</Label>
                    <Select value={reharmIntensity} onValueChange={setReharmIntensity}><SelectTrigger id="reharmIntensitySelectInput"><SelectValue /></SelectTrigger>
                      <SelectContent>{reharmIntensityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleToolAction(() => ai.reharmonizeChords({ chords: originalChords, style: reharmStyle, intensity: reharmIntensity }), setReharmonizedChords, setReharmonizerLoader, "Reharmonized chords will appear here.")} disabled={reharmonizerLoader || !originalChords} className="w-full" variant="default">
                    {reharmonizerLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} Reharmonize Chords
                  </Button>
                  <div className="output-display-area" id="reharmonizedChordsOutput">{reharmonizedChords}</div>
                  {reharmonizedChords !== "Reharmonized chords will appear here." && !reharmonizedChords.startsWith("Error") && (
                    <div className="send-buttons-container">
                      <Button onClick={() => appendToTextarea('songCanvasTextArea', reharmonizedChords)} variant="outline">Send to Song Canvas</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Chord Forge */}
            <Card className="tool-card">
                <CardHeader><CardTitle className="chord-forge-title subsection-title">The Chord Forge</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4 dylan-quote text-sm">"Play it loud!"</p>
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                        <h4 className="text-xl font-semibold mb-3" style={{fontFamily: "var(--font-architects-daughter)", color: "hsl(var(--accent-foreground))"}}>Standard Progression Generator</h4>
                        {/* Standard Progression Generator Inputs: Key, Scale, NumChords, Complexity */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-1"> <Label htmlFor="stdProgKey">Key</Label> <Select value={stdProgKey} onValueChange={setStdProgKey}><SelectTrigger id="stdProgKey"><SelectValue/></SelectTrigger><SelectContent>{["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-1"> <Label htmlFor="stdProgScale">Scale/Mood</Label> <Select value={stdProgScale} onValueChange={setStdProgScale}><SelectTrigger id="stdProgScale"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Major">Major</SelectItem><SelectItem value="Minor">Minor</SelectItem><SelectItem value="Bluesy">Bluesy</SelectItem><SelectItem value="Jazzy">Jazzy</SelectItem><SelectItem value="Folk">Folk</SelectItem></SelectContent></Select></div>
                            <div className="space-y-1"> <Label htmlFor="stdProgNumChords"># Chords</Label> <Input id="stdProgNumChords" type="number" value={stdProgNumChords} onChange={e=>setStdProgNumChords(parseInt(e.target.value))} min="2" max="8"/></div>
                            <div className="space-y-1"> <Label htmlFor="stdProgComplexity">Complexity</Label> <Select value={stdProgComplexity} onValueChange={setStdProgComplexity}><SelectTrigger id="stdProgComplexity"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="1">Simple</SelectItem><SelectItem value="2">Medium</SelectItem><SelectItem value="3">Complex</SelectItem></SelectContent></Select></div>
                        </div>
                         <Button onClick={() => handleToolAction(() => ai.generateChords({ mood: `${stdProgKey} ${stdProgScale}`, complexity: stdProgComplexity === "3" ? 'complex': 'simple' }), setStdProgResult, setStdProgLoader, "Generated standard progression.")} disabled={stdProgLoader} variant="default">
                            {stdProgLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Music className="mr-2 h-4 w-4" />} Generate Standard Progression
                         </Button>
                        <div className="output-display-area mt-3" style={{color: "hsl(var(--accent-foreground))"}} id="stdProgResultOutput">{stdProgResult}</div>
                        {stdProgResult !== "Generated standard progression." && !stdProgResult.startsWith("Error") && (
                            <div className="send-buttons-container"><Button onClick={() => appendToTextarea('songCanvasTextArea', stdProgResult)} variant="outline">Send to Song Canvas</Button></div>
                        )}
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                        <h4 className="text-xl font-semibold mb-3" style={{fontFamily: "var(--font-architects-daughter)", color: "hsl(var(--accent-foreground))"}}>Random Progression Generator</h4>
                         <div className="space-y-2 mb-3"><Label htmlFor="randomProgFeelInputRandom">Desired Feel/Genre (Optional):</Label><Input id="randomProgFeelInputRandom" value={randomProgFeel} onChange={e => setRandomProgFeel(e.target.value)} placeholder="e.g., Mellow folk, Driving alt-country" /></div>
                        <Button onClick={() => handleToolAction(() => ai.generateChords({ mood: randomProgFeel || "any", complexity: "simple" }), setRandomProgResult, setRandomProgLoader, "Generated random progression.")} disabled={randomProgLoader} variant="secondary">
                            {randomProgLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shuffle className="mr-2 h-4 w-4" />} Generate Random Progression
                        </Button>
                        <div className="output-display-area mt-3" style={{color: "hsl(var(--accent-foreground))"}} id="randomProgResultOutput">{randomProgResult}</div>
                        {randomProgResult !== "Generated random progression." && !randomProgResult.startsWith("Error") && (
                            <div className="send-buttons-container"><Button onClick={() => appendToTextarea('songCanvasTextArea', randomProgResult)} variant="outline">Send to Song Canvas</Button></div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chord Voicing Suggester */}
              <Card className="tool-card">
                  <CardHeader><CardTitle className="chord-voicing-title subsection-title">Chord Voicing Suggester</CardTitle></CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4 dylan-quote text-sm">"You can't be wise and in love at the same time." - Find new ways to say it with chords.</p>
                      <div className="space-y-2 mb-3"><Label htmlFor="chordsForVoicingInput">Chords to Get Voicing Ideas For (e.g., C G Am F)</Label><Input id="chordsForVoicingInput" value={chordsForVoicing} onChange={e => setChordsForVoicing(e.target.value)} placeholder="Enter a few chords..." /></div>
                      <Button onClick={() => handleToolAction(() => ai.getChordVoicingSuggestions({ chords: chordsForVoicing }), setVoicingSuggestions, setVoicingLoader, "Chord voicing ideas will appear here.")} disabled={voicingLoader || !chordsForVoicing} className="w-full" variant="ghost">
                          {voicingLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic2 className="mr-2 h-4 w-4" />} Suggest Voicings
                      </Button>
                      <div className="output-display-area" id="voicingSuggestionsOutput">{voicingSuggestions}</div>
                      {voicingSuggestions !== "Chord voicing ideas will appear here." && !voicingSuggestions.startsWith("Error") && (
                          <div className="send-buttons-container"><Button onClick={() => appendToTextarea('songCanvasTextArea', voicingSuggestions)} variant="outline">Send to Song Canvas</Button></div>
                      )}
                  </CardContent>
              </Card>
              {/* Sound Palette (Instrumentation) */}
              <Card className="tool-card">
                  <CardHeader><CardTitle className="instrumentation-title subsection-title">Sound Palette (Instrumentation)</CardTitle></CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4 dylan-quote text-sm">"All this talk about equality..."</p>
                      <div className="space-y-2 mb-3"><Label htmlFor="instrumentationVibeInput">Song Vibe/Genre (e.g., 'Dusty Americana')</Label><Input id="instrumentationVibeInput" value={instrumentationVibe} onChange={e => setInstrumentationVibe(e.target.value)} placeholder="Describe your song's feel" /></div>
                      <div className="space-y-2 mb-3"><Label htmlFor="instrumentationStyleEraSelectInput">Musical Style/Era:</Label>
                          <Select value={instrumentationStyleEra} onValueChange={setInstrumentationStyleEra}><SelectTrigger id="instrumentationStyleEraSelectInput"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="General Folk/Americana">General Folk/Americana</SelectItem><SelectItem value="60s Folk Revival">60s Folk Revival</SelectItem>
                                  <SelectItem value="70s Singer-Songwriter">70s Singer-Songwriter</SelectItem><SelectItem value="90s Alt-Country">90s Alt-Country</SelectItem>
                                  <SelectItem value="Modern Indie Folk">Modern Indie Folk</SelectItem><SelectItem value="Roots Rock">Roots Rock</SelectItem>
                                  <SelectItem value="Psychedelic Folk">Psychedelic Folk</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <Button onClick={() => handleToolAction(() => ai.suggestInstruments({ vibe: instrumentationVibe, styleEra: instrumentationStyleEra }), setInstrumentationResult, setInstrumentationLoader, "Instrumentation ideas will appear here.")} disabled={instrumentationLoader || !instrumentationVibe} className="w-full" variant="ghost">
                          {instrumentationLoader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />} Suggest Instruments
                      </Button>
                      <div className="output-display-area" id="instrumentationResultOutput">{instrumentationResult}</div>
                      {instrumentationResult !== "Instrumentation ideas will appear here." && !instrumentationResult.startsWith("Error") && (
                          <div className="send-buttons-container"><Button onClick={() => appendToTextarea('ideaCatcherTextAreaInput', instrumentationResult)} variant="outline">Send to Notes</Button></div>
                      )}
                  </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* AI Song Draft Generator Section */}
        <AccordionItem value="item-song-generator" className="main-section-box" id="completeSongGeneratorSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline">
            <h2 className="song-generator-title main-section-title">AI Song Draft Generator</h2>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <p className="text-muted-foreground mb-4 dylan-quote text-sm">"A song is anything that can walk by itself." - Let's get a first draft walking.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="fullSongThemeInput">Theme/Topic of Your Song:</Label><Input id="fullSongThemeInput" value={fullSongTheme} onChange={e => setFullSongTheme(e.target.value)} placeholder="e.g., A train journey at dusk" /></div>
              <div className="space-y-2"><Label htmlFor="fullSongStyleInput">Musical Style/Mood:</Label><Input id="fullSongStyleInput" value={fullSongStyle} onChange={e => setFullSongStyle(e.target.value)} placeholder="e.g., Mellow Folk Ballad, Uptempo Alt-Country" /></div>
              <div className="space-y-2"><Label htmlFor="fullSongStructureSelect">Desired Song Structure:</Label>
                <Select value={fullSongStructure} onValueChange={setFullSongStructure}><SelectTrigger id="fullSongStructureSelect"><SelectValue /></SelectTrigger>
                  <SelectContent>{songStructureOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label htmlFor="fullSongKeywordsInput">Key Lyrical Phrases/Keywords (Optional):</Label><Input id="fullSongKeywordsInput" value={fullSongKeywords} onChange={e => setFullSongKeywords(e.target.value)} placeholder="e.g., lonely road, setting sun" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="fullSongVerseCountInput">Approximate Number of Verses (e.g., 2-3):</Label><Input type="number" id="fullSongVerseCountInput" value={fullSongVerseCount} onChange={e => setFullSongVerseCount(parseInt(e.target.value))} min="1" max="5" className="w-full md:w-1/4" /></div>
            </div>
            <Button onClick={() => handleToolAction(() => ai.generateFullSong({ theme: fullSongTheme, songStyle: fullSongStyle, structure: fullSongStructure, keywords: fullSongKeywords, verseCount: fullSongVerseCount }), setFullSongDraft, setFullSongLoaderState, "Your AI-generated song draft will appear here.")} disabled={fullSongLoaderState || !fullSongTheme || !fullSongStyle} className="w-full" variant="default">
              {fullSongLoaderState ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />} Compose Full Song Draft
            </Button>
            <div className="space-y-2 mt-4">
              <Label htmlFor="fullSongOutputTextarea">Generated Song Draft:</Label>
              <Textarea id="fullSongOutputTextarea" value={fullSongDraft} onChange={e => setFullSongDraft(e.target.value)} rows={20} className="w-full p-3 output-display-area" placeholder="Your AI-generated song draft will appear here..." />
            </div>
             {fullSongDraft !== "Your AI-generated song draft will appear here..." && !fullSongDraft.startsWith("Error") && (
              <div className="send-buttons-container">
                <Button onClick={() => { appendToTextarea('songCanvasTextArea', fullSongDraft); toast({title: "Draft Copied!", description: "Full song draft copied to main canvas."}) }} variant="outline">Copy to Main Song Canvas</Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Songwriter's Canvas Section */}
        <AccordionItem value="item-canvas" className="main-section-box" id="songCanvasSection">
          <AccordionTrigger className="collapsible-header-style hover:no-underline" id="songCanvasSectionAccordionTrigger">
            <h2 className="canvas-title main-section-title">The Songwriter's Canvas</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <p className="text-muted-foreground mb-6 dylan-quote">"Take what you have gathered from coincidence." - Assemble your masterpiece here.</p>
            <Card className="mb-6 bg-muted/50 border-2 border-dashed">
              <CardHeader><CardTitle className="song-structure-title subsection-title">Song Structure Helper</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="songStructureSelectCanvasInput">Choose a Common Structure Template:</Label>
                  <Select value={selectedStructureCanvas} onValueChange={setSelectedStructureCanvas}><SelectTrigger id="songStructureSelectCanvasInput"><SelectValue placeholder="-- Select a Structure --" /></SelectTrigger>
                    <SelectContent>
                      {songStructureOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      <SelectItem value="Blues Form (12-bar)">Blues Form (12-bar)</SelectItem>
                      <SelectItem value="Folk Ballad (Strophic with refrain)">Folk Ballad (Strophic with refrain)</SelectItem>
                      <SelectItem value="Freeform/Stream of Consciousness (Dylan-esque)">Freeform/Stream of Consciousness (Dylan-esque)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="structureContextCanvasInput">Song Idea/Theme (Optional context):</Label><Input id="structureContextCanvasInput" value={structureContextCanvas} onChange={e => setStructureContextCanvas(e.target.value)} placeholder="e.g., journey of self-discovery" /></div>
                <Button onClick={handleGenerateStructureCanvas} disabled={structureLoaderCanvas || !selectedStructureCanvas} variant="default">
                  {structureLoaderCanvas ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Generate & Add Structure to Draft
                </Button>
                <div className="space-y-2 mt-3"><Label>Or, Add Individual Blocks:</Label>
                  <div className="flex flex-wrap gap-2">
                    {structureBlockButtons.map(block => (
                      <Button key={block.label} onClick={() => appendToTextarea('songCanvasTextArea', `${block.structure}\n\n`)} className="btn-structure">{block.label}</Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2"><Label htmlFor="songWorkingTitleInputCanvas">Working Title:</Label><Input id="songWorkingTitleInputCanvas" value={songWorkingTitle} onChange={e => setSongWorkingTitle(e.target.value)} placeholder="e.g., Visions of Johanna" /></div>
              <div className="space-y-2"><Label htmlFor="songKeyTempoInputCanvas">Key / Tempo:</Label><Input id="songKeyTempoInputCanvas" value={songKeyTempo} onChange={e => setSongKeyTempo(e.target.value)} placeholder="e.g., E Major / 98bpm" /></div>
              <div className="space-y-2"><Label htmlFor="songMoodThemeInputCanvas">Mood / Theme:</Label><Input id="songMoodThemeInputCanvas" value={songMoodTheme} onChange={e => setSongMoodTheme(e.target.value)} placeholder="e.g., Melancholy, Redemption" /></div>
              <div className="space-y-2"><Label htmlFor="songCanvasFontSelectInput">Font Style:</Label>
                <Select value={songCanvasFont} onValueChange={setSongCanvasFont}>
                  <SelectTrigger id="songCanvasFontSelectInput"><SelectValue /></SelectTrigger>
                  <SelectContent>{canvasFontOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2"><Label htmlFor="ideaCatcherTextAreaInput">Quick Notes / Scratchpad:</Label><Textarea id="ideaCatcherTextAreaInput" value={ideaCatcherText} onChange={e => setIdeaCatcherText(e.target.value)} rows={4} placeholder="Fleeting thoughts, images, random lines..." className="bg-white/80 border-dashed" /></div>
              <div className="space-y-2"><Label htmlFor="melodicIdeasTextAreaInput">Melodic Ideas / Contour Notes:</Label><Textarea id="melodicIdeasTextAreaInput" value={melodicIdeasText} onChange={e => setMelodicIdeasText(e.target.value)} rows={4} placeholder="e.g., Verse melody rises slowly..." className="bg-white/80 border-dashed" /></div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="songCanvasTextArea">Song Draft & Lyrics:</Label>
              <Textarea id="songCanvasTextArea" value={songCanvasText} onChange={e => setSongCanvasText(e.target.value)} rows={18} placeholder="Lay down your tracks here..." className="p-3 bg-white border-2 border-foreground/30" style={{ fontFamily: songCanvasFont, lineHeight: 1.7 }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={saveProject} variant="default"><Save className="mr-2 h-4 w-4" />Save Project</Button>
              <Button onClick={loadProject} variant="secondary"><FolderOpen className="mr-2 h-4 w-4" />Load Project</Button>
              <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
                  <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Clear Saved Project</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Clear Saved Project?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={clearProject}>Yes, Clear</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
              <Button onClick={exportSongDraft} variant="ghost"><FileText className="mr-2 h-4 w-4" />Export Song Draft</Button>
            </div>
            {projectStatusMessage && <p className="text-sm mt-2 text-muted-foreground">{projectStatusMessage}</p>}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Gemini Modal for Phrase Spark AI actions */}
      <Dialog open={geminiModalOpen} onOpenChange={setGeminiModalOpen}>
        <DialogContent className="bg-background text-foreground max-w-lg border-2 border-dashed border-primary">
          <DialogHeader>
            <DialogTitle className="page-title-font text-2xl text-primary mb-3">{geminiModalTitle}</DialogTitle>
             <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setGeminiModalOpen(false)}><X className="h-4 w-4" /></Button>
          </DialogHeader>
          <div className="py-4">
            {geminiModalLoader && <div className="loader"></div>}
            <p className="mt-2 whitespace-pre-wrap text-sm" id="geminiModalContentOutput">{geminiModalContent}</p>
            {geminiModalContent && !geminiModalLoader && !geminiModalContent.startsWith("Error:") && (
              <div className="send-buttons-container mt-4">
                <Button onClick={handleSendFromModalToCanvas} variant="outline">Add to Song Draft</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
    </TooltipProvider>
  );
};

export default AppClientPage;
