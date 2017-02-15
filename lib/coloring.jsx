import groups from '../backend/groups.json';

const emojis = [
  '🏛',
  '🎟',
  '🖼',
  '🎻',
];

let categories = [];
for (const name in groups) { categories.push(groups[name].category); }

categories = Array.from(new Set(categories));

export const emoji_for_cat = cat => {
  return emojis[categories.indexOf(cat)];
};

// https://designschool.canva.com/blog/100-color-combinations/
export const neutral = ['#626D71', '#CDCDC0', '#DDBC95', '#B38867'];
export const brights = ['#258039', '#F5BE41', '#31A9B8', '#CF3721'];

export const NEUTRAL = 'neutral';
export const BRIGHTS = 'brights';

export const color_for_cat = (cat, choice) => {
  if (choice === NEUTRAL)
    return neutral[categories.indexOf(cat)];
  else
    return brights[categories.indexOf(cat)];
};

export const color_for_host = host => {
  return color_for_cat(groups[host].category);
};
