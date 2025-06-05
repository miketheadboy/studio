
export interface ChordProgressionCategory {
  name: string;
  progressions: string[];
}

export const CHORD_PROGRESSIONS_DATA: Record<string, ChordProgressionCategory> = {
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
