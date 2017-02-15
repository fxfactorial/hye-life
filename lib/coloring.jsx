import groups from '../backend/groups.json';

// const emojis = [🏛,
//   🎟,
//   🖼,
//   🎻,
// ];

// export const emoji_for_cat = cat => {
//   switch(cat) {
//   case 'musuem':           return emojis[0];
//   case 'casual':           return emojis[1];
//   case 'gallery':          return emojis[2];
//   case 'live performance': return emojis[3];
//   default:                 return '';
//   };
// };

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
