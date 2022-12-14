const skinPalette = [
  //from https://huebliss.com/skin-color-code/
  {
    name: 'Brown',
    hex: '8d5524',
    rgb: [141, 85, 36],
    cmyk: [0, 40, 74, 45],
    hsb: [28, 74, 55],
    hsl: [28, 59, 35],
    lab: [42, 19, 37],
  },
  {
    name: 'Bronze',
    hex: 'c68642',
    rgb: [198, 134, 66],
    cmyk: [0, 32, 67, 22],
    hsb: [31, 67, 78],
    hsl: [31, 54, 52],
    lab: [61, 18, 46],
  },
  {
    name: 'Earth Yellow',
    hex: 'e0ac69',
    rgb: [224, 172, 105],
    cmyk: [0, 23, 53, 12],
    hsb: [34, 53, 88],
    hsl: [34, 66, 65],
    lab: [74, 11, 42],
  },
  {
    name: 'Gold Crayola',
    hex: 'f1c27d',
    rgb: [241, 194, 125],
    cmyk: [0, 20, 48, 5],
    hsb: [36, 48, 95],
    hsl: [36, 81, 72],
    lab: [81, 8, 41],
  },
  {
    name: 'Deep Champagne',
    hex: 'ffdbac',
    rgb: [255, 219, 172],
    cmyk: [0, 14, 33, 0],
    hsb: [34, 33, 100],
    hsl: [34, 100, 84],
    lab: [89, 6, 28],
  },
];

const femaleNames = [
  'Anibrev',
  'Bakinaw',
  'Calibrew',
  'Deknure',
  'Elimoore',
  'Farigraph',
  'Ge',
  'Hanifred',
  'Indigo',
  'Jerepass',
  'Kekanumatonadoe',
  'Lilu',
  'Mavito',
  'Neen',
  'Oi',
  'Prespinta',
  'Q',
  'Reshira',
  'Sariphone',
  'Tavisha',
  'Umpturmass',
  'Variphore',
  'Wiltmoore',
  'Xythe',
  'Yershig',
  'Zashima',
];

const maleNames = [
  'Adrik',
  'Baboi',
  'Cra',
  'Dartrik',
  'Edgrene',
  'Ferdinhand',
  'Greaseinhamworth',
  'Hue',
  'Intison',
  'Jurst',
  'Kwekrish',
  'Limast',
  'Markwin',
  'Nerdinand',
  'Ogredin',
  'Petegrismik',
  'Questbrink',
  'Rhestoromor',
  'Stagrtire',
  'Tiv',
  'U',
  'Valdo',
  'Workwillmingtonham',
  'Xyther',
  'Yassy',
  'Zeriford',
];

const lastNames = [
  'Acre',
  'Adathming',
  'Brinkbronk',
  'Bro',
  'Cascade',
  'Crustler',
  'Dynamrick',
  'Dustoshelf',
  'Elison',
  'Eghsk',
  'Fsark',
  'Fi',
  'Gershandermind',
  'Grint',
  'Hinkminghan',
  'Hunkertonmore',
  'I',
  'Ishmihash',
  'Jrush',
  'Jergo',
  'Klimpkly',
  'Ktuse',
  'Lalilome',
  'Lwaliluke',
  'Madders',
  'Mintma',
  'Naftorafti',
  'Nertmew',
  'Oithyou',
  'Ohgruq',
  'Pepp',
  'Poi',
  'Qwertikeytab',
  'Quibsta',
  'Rickruck',
  'Rhy',
  'Salvisious',
  'Slide',
  'Tumpterton',
  'To',
  'Udgee',
  'Uthergriv',
  'Valdo',
  'Vestiz',
  'Westoip',
  'Wringrij',
  'XL',
  'Xerximars',
  'Yashrima',
  'Yupe',
  'Zawkimoh',
  'Zcrievklmas',
];

const greetings = [
  'Hey',
  'Heru',
  'Yersh',
  'Yupsle',
  'Ye-Yers',
  'Heha',
  'Yo',
  'Hi',
  'Sup',
  "So'up",
  'Wa-hey',
  'Ye bop',
  'Greetings',
  "Y'all",
  'Hio',
  'Wowa',
];

const correctResponses = [
  'You got me!',
  'Here I am!',
  'What a find!',
  'I thought I was gonna get you on that one',
  "How'd you know it was me?",
  'No hiding the wool over your eyes',
  'That hiding spot usually works',
  'Good eye!',
  'Looks like you can still see the trees in the forest',
  "Are you sure I'm the one? ... Yeah it's me",
  'Do you have time to find another?',
  "I knew I should've picked a different spot!",
  'Aww Rat-paste! You win!',
  "I think I'll use my invisibility cloak next time",
  'Wait, you got me already?',
  'It takes two to tango but just you to find me',
  "Okay, I'm the one",
  "Yep, it's me!",
  'Uh-huh, pat yourself on the back',
  "Correct, but don't get too full of yourself",
  'The next one will be more difficult!',
];

const incorrectResponses = [
  'Not today',
  "You best be tryin' again",
  "I don't look anything like them!",
  'Negative, nope, nada!',
  "I'm trying to read over here!",
  "I'd ask you to help find my phone, but I think I need someone a little bit more skilled in the finding arena",
  'Haha, nope!',
  'Try again friend!',
  'Was that your final answer?',
  'Maybe next time',
  "Don't quit your day job - or night if you've got that shift",
  "I'm flattered you confused me with the real Valdo",
  'You fell for my clever disguise! Try again!',
  "You're still it!",
  'Keep trying',
  'Pick another',
  'Have you seen my wallet?',
  'Are you the one who took my ice cream?',
  'The longer I look at the sun, the darker everything gets',
  'Sorry, I was day dreaming - try again',
  'I think they got it wrong, try me again!',
  'Ewww! When was the last time you washed your hands?',
  "Here's some more points - wait, nevermind",
  "The timer's gonna keep ticking!",
  'That tickled! No points for you!',
  'Nope',
  'Zilch',
  'Nada',
  'Nuh-uh',
  'No no no no',
  'Not me!',
  'Nopers',
  'Negatory',
  'Sorry, wrong one!',
  "I hate to disappoint you, but I'm not who you're looking for",
  'Noooooooope!',
  'Nah no Nah Nah!',
  'Um... no',
  'What day is it?',
  'Are you allergic to incorrect answers?',
  'Not a perfect score for you, but you can try again',
];

export default function getRandomValdoList() {
  //loosely randomizes names, greetings, and responses
  let shuffledFemaleNames = femaleNames.slice().sort(() => Math.random() - 0.5);
  let shuffledMaleNames = maleNames.slice().sort(() => Math.random() - 0.5);
  let shuffledLastNames = lastNames.slice().sort(() => Math.random() - 0.5);
  let shuffledGreetings = greetings.slice().sort(() => Math.random() - 0.5);
  let shuffledCorrectResponses = correctResponses
    .slice()
    .sort(() => Math.random() - 0.5);
  let shuffledIncorrectResponses = incorrectResponses
    .slice()
    .sort(() => Math.random() - 0.5);

  let femaleList = shuffledFemaleNames.map((name, i) => {
    let femaleValdo = {
      firstName: name,
      lastName: shuffledLastNames[i],
      greeting: shuffledGreetings[i % shuffledGreetings.length],
      fullName: `${name} ${shuffledLastNames[i]}`,
      gender: 'female',
      correctResponse:
        shuffledCorrectResponses[i % shuffledCorrectResponses.length],
      incorrectResponse:
        shuffledIncorrectResponses[i % shuffledIncorrectResponses.length],
      skinTone: '#' + skinPalette[i % skinPalette.length].hex,
    };

    return femaleValdo;
  });

  let maleList = shuffledMaleNames.map((name, i) => {
    let maleValdo = {
      firstName: name,
      lastName: shuffledLastNames[i],
      greeting: shuffledGreetings[i % shuffledGreetings.length],
      fullName: `${name} ${shuffledLastNames[i]}`,
      gender: 'male',
      correctResponse:
        shuffledCorrectResponses[i % shuffledCorrectResponses.length],
      incorrectResponse:
        shuffledIncorrectResponses[i % shuffledIncorrectResponses.length],
      skinTone: '#' + skinPalette[i % skinPalette.length].hex,
    };

    return maleValdo;
  });

  let randomList = [...femaleList, ...maleList].sort(() => Math.random - 0.5);

  return randomList;
}
