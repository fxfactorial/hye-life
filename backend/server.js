'use strict';
/* jshint esversion: 6 */
const express = require('express');
const request_prom = require('request-promise');
const createElement = require('react').createElement;
const render = require('react-dom/server').renderToString;
const env = require('./env');
const sqlite3 = env.debug ? require('sqlite3').verbose() : require('sqlite3');
const favicon = require('serve-favicon');

const frontend = require('../lib/hye-life').default;
const {events_every} = require('./fb-events');
const translateAll = require('./yandex-translate');
// Assumes that such a database exists, make sure it does.
const db_promises =
      require('./sqlite-promises')(new sqlite3.Database('hye-life.db'));

const port = env.debug ? 9090 : 80;
const hyelife = express();
const rendered = render(createElement(frontend, null));

let register_email_users = {};

// daemons
events_every(60 * 1000 * 60 * 24, db_promises);

hyelife.use(require('helmet')());
hyelife.use(express.static('public'));
hyelife.use(favicon('public/favicon.ico'));
hyelife.use(require('morgan')('combined'));

// Not a XSS because we already did XSS by time data comes into DB.
const site = (tech_events, e_count) => `
<!doctype html>
<meta charset="utf-8"/>
<meta name="Armenian cultural events calendar"
      content="See all the arts and cultural events scheduled in Yerevan and all of Armenia in one place"/>
<head>
  <title>All the art and cultural events scheduled in Armenia</title>
  <link rel="shortcut icon" href="favicon.ico" />
  <link rel="icon" type="image/gif" href="animated_favicon1.gif" />
  <link rel="preload" href="bundle.js" as="script"/>
  <link href="react-big-calendar.css" rel="stylesheet" type="text/css"/>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
  <link href="styles.css" rel="stylesheet" type="text/css"/>
  <script>
    // This way we avoid needless HTTP requests
    window.__ALL_TECH_EVENTS__ = ${JSON.stringify(tech_events)}
    window.__EVENT_COUNT_THIS_MONTH__ = ${e_count}
  </script>
</head>
<body>
  <div id='container'>${rendered}</div>
  <script src='bundle.js'></script>
</body>
`;

hyelife.get('/', async (req, res) => {
  try {
    const pulled =
	  // This way we eliminate duplicates, unlikely that
	  // descriptions for some events will naturally be redundant
	  // but quite likely that people copy paste titles from one
	  // event to another
	  await db_promises.all(`
select title, all_day, start, end, url, creator, description from event
group by description
`);

    res.setHeader('content-type', 'text/html');
    let transformed = pulled.map(item => {
      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();

      return {
        title:item.title,
        allDay: item.all_day ? true : false,
        start,
        end,
        desc: item.description,
	url:item.url,
	sourced_from:item.creator
      };
    });
    const {event_count} = await db_promises.get(`
select count(*) as event_count from
(select title from event
where (strftime('%m', datetime(end, 'unixepoch')) - 1) =
(strftime('%m', 'now') + 0) group by title);
`);
    res.end(site(transformed, event_count));
  } catch (e) {
    console.error(e);
  }
});

// No other handler picked it up yet, so this is our 404 handler
hyelife.use((_, r, __) => r.status(404).send(`
<!doctype html>
<meta charset='utf-8'></meta>
<body>
  <h3> Sorry, I don't know what resource you're trying to access </h3>
  <p>
    Head back to <a href='http://silicondzor.com'>silicondzor.com</a>
  </p>
</body>
`));

hyelife.listen(port, () => console.log(`Started server on ${port}`));
