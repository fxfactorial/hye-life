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

export const color_for_cat = cat => {
  switch(cat) {
  case 'musuem':           return 'orange';
  case 'casual':           return 'yellow';
  case 'gallery':          return 'red';
  case 'live performance': return 'green';
  default:                 return 'blue';
  };
};

export const color_for_host = host => {
  return color_for_cat(groups[host].category);
};
