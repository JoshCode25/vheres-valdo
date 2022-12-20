import { subscribe } from 'svelte/internal';
import { readable } from 'svelte/store';

let colorList = [
  {
    name: 'Vivid Sky Blue',
    hex: '5ad2f4',
    rgb: [90, 210, 244],
    cmyk: [63, 14, 0, 4],
    hsb: [193, 63, 96],
    hsl: [193, 88, 65],
    lab: [79, -24, -27],
  },
  {
    name: 'Rebecca Purple',
    hex: '6e2594',
    rgb: [110, 37, 148],
    cmyk: [26, 75, 0, 42],
    hsb: [279, 75, 58],
    hsl: [279, 60, 36],
    lab: [31, 50, -47],
  },
  {
    name: 'Minion Yellow',
    hex: 'ecd444',
    rgb: [236, 212, 68],
    cmyk: [0, 10, 71, 7],
    hsb: [51, 71, 93],
    hsl: [51, 82, 60],
    lab: [85, -7, 70],
  },
  {
    name: 'Blue Crayola',
    hex: '2176ff',
    rgb: [33, 118, 255],
    cmyk: [87, 54, 0, 0],
    hsb: [217, 87, 100],
    hsl: [217, 100, 56],
    lab: [52, 26, -75],
  },
  {
    name: 'Brick Red',
    hex: 'd1495b',
    rgb: [209, 73, 91],
    cmyk: [0, 65, 56, 18],
    hsb: [352, 65, 82],
    hsl: [352, 60, 55],
    lab: [51, 55, 19],
  },
  {
    name: 'Asparagus',
    hex: '87a878',
    rgb: [135, 168, 120],
    cmyk: [20, 0, 29, 34],
    hsb: [101, 29, 66],
    hsl: [101, 22, 56],
    lab: [65, -20, 21],
  },
  {
    name: 'Onyx',
    hex: '32373b',
    rgb: [50, 55, 59],
    cmyk: [15, 7, 0, 77],
    hsb: [207, 15, 23],
    hsl: [207, 8, 21],
    lab: [23, -1, -3],
  },
  {
    name: 'Tea Green',
    hex: 'dbf9b8',
    rgb: [219, 249, 184],
    cmyk: [12, 0, 26, 2],
    hsb: [88, 26, 98],
    hsl: [88, 84, 85],
    lab: [94, -21, 28],
  },
  {
    name: 'Vivid Tangerine',
    hex: 'eb9486',
    rgb: [235, 148, 134],
    cmyk: [0, 37, 43, 8],
    hsb: [8, 43, 92],
    hsl: [8, 72, 72],
    lab: [70, 31, 21],
  },
  {
    name: 'Khaki Web',
    hex: 'cab7a2',
    rgb: [202, 183, 162],
    cmyk: [0, 9, 20, 21],
    hsb: [32, 20, 79],
    hsl: [32, 27, 71],
    lab: [75, 3, 13],
  },
  {
    name: 'Magenta',
    hex: 'f038ff',
    rgb: [240, 56, 255],
    cmyk: [6, 78, 0, 0],
    hsb: [295, 78, 100],
    hsl: [295, 100, 61],
    lab: [60, 88, -61],
  },
  {
    name: 'Cyclamen',
    hex: 'ef709d',
    rgb: [239, 112, 157],
    cmyk: [0, 53, 34, 6],
    hsb: [339, 53, 94],
    hsl: [339, 80, 69],
    lab: [64, 53, -1],
  },
  {
    name: 'Granny Smith Apple',
    hex: 'c7f2a7',
    rgb: [199, 242, 167],
    cmyk: [18, 0, 31, 5],
    hsb: [94, 31, 95],
    hsl: [94, 74, 80],
    lab: [91, -27, 32],
  },
];
function createValdoApparelColorList(colorList) {
  let doubledColorList = [...colorList, ...colorList];

  let alphabet = 'abcdefghijklmnopqrstuvwxyz';

  let shuffledAlphabet = alphabet.split('').sort(() => Math.random() - 0.5);

  let valdoApparelColors = doubledColorList.reduce(
    (compiledColorObject, colorData, i) => {
      compiledColorObject[shuffledAlphabet[i]] = `#${colorData.hex}`;
      return compiledColorObject;
    },
    {}
  );

  return valdoApparelColors;
}

let valdoApparelColorList = createValdoApparelColorList(colorList);
console.log(valdoApparelColorList);

export const valdoApparelColorStore = readable(
  {
    apparelColorList: valdoApparelColorList,
    apparelLengths: [3, 10],
    shortLength: 0.65,
    longLength: 0.85,
    apparelThickness: 4,
  },
  (set) => {
    return () => {};
  }
);
