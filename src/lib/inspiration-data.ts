
export interface InspirationItem {
  type: 'Art' | 'Film' | 'Literature';
  title: string;
  creator: string;
  year: string;
  description?: string;
  imageUrl?: string; 
  imageHint?: string; 
  infoLink?: string;  
  youtubeLink?: string; 
  passage?: string; 
}

export const INSPIRATION_SOURCES: InspirationItem[] = [
  {
    type: 'Art',
    title: 'Starry Night',
    creator: 'Vincent van Gogh',
    year: '1889',
    description: 'A swirling depiction of the night sky from the window of an asylum, rendered in his unique post-impressionist style.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'van gogh starry night',
    infoLink: 'https://en.wikipedia.org/wiki/The_Starry_Night',
  },
  {
    type: 'Film',
    title: 'Blade Runner (Final Cut)',
    creator: 'Ridley Scott',
    year: '1982/2007',
    description: 'A dystopian science fiction film exploring themes of humanity, memory, and artificial intelligence in a rain-soaked, neon-lit future.',
    infoLink: 'https://www.imdb.com/title/tt0083658/',
    youtubeLink: 'https://www.youtube.com/watch?v=eogpIG53Cis', // Original Trailer
  },
  {
    type: 'Literature',
    title: 'The Waste Land',
    creator: 'T.S. Eliot',
    year: '1922',
    passage: "April is the cruellest month, breeding\nLilacs out of the dead land, mixing\nMemory and desire, stirring\nDull roots with spring rain.",
    infoLink: 'https://en.wikipedia.org/wiki/The_Waste_Land',
  },
  {
    type: 'Art',
    title: 'Guernica',
    creator: 'Pablo Picasso',
    year: '1937',
    description: 'A monumental and powerful anti-war painting depicting the suffering inflicted by violence and chaos during the bombing of Guernica.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'picasso guernica',
    infoLink: 'https://en.wikipedia.org/wiki/Guernica_(Picasso)',
  },
  {
    type: 'Film',
    title: '2001: A Space Odyssey',
    creator: 'Stanley Kubrick',
    year: '1968',
    description: 'A visually stunning science fiction epic exploring themes of human evolution, technology, artificial intelligence, and extraterrestrial life.',
    infoLink: 'https://www.imdb.com/title/tt0062622/',
    youtubeLink: 'https://www.youtube.com/watch?v=oR_e9y-bka0', // Trailer
  },
  {
    type: 'Literature',
    title: 'Howl',
    creator: 'Allen Ginsberg',
    year: '1956',
    passage: "I saw the best minds of my generation destroyed by madness, starving hysterical naked,\ndragging themselves through the negro streets at dawn looking for an angry fix...",
    infoLink: 'https://en.wikipedia.org/wiki/Howl',
  },
  {
    type: 'Art',
    title: 'The Persistence of Memory',
    creator: 'Salvador Dalí',
    year: '1931',
    description: 'Iconic surrealist painting featuring melting clocks in a dreamlike landscape, exploring the fluidity of time.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'dali melting clocks',
    infoLink: 'https://en.wikipedia.org/wiki/The_Persistence_of_Memory',
  },
  {
    type: 'Film',
    title: 'Paris, Texas',
    creator: 'Wim Wenders',
    year: '1984',
    description: 'A meditative road movie about a man who wanders out of the desert and tries to reconnect with his past and family.',
    infoLink: 'https://www.imdb.com/title/tt0087884/',
    youtubeLink: 'https://www.youtube.com/watch?v=95aDMB5m3k4', // Trailer
  },
  {
    type: 'Literature',
    title: 'Song of Myself',
    creator: 'Walt Whitman',
    year: '1855',
    passage: "I celebrate myself, and sing myself,\nAnd what I assume you shall assume,\nFor every atom belonging to me as good belongs to you.",
    infoLink: 'https://en.wikipedia.org/wiki/Song_of_Myself',
  }
];
