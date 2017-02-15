import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment_timezone from 'moment-timezone';
import Slider from 'react-slick';
import images from './slides';
import {color_for_host, color_for_cat, emoji_for_cat} from './coloring';
// Very awesome build time sharing of code, yay webpack2
import groups from '../backend/groups.json';

const default_scroll_time = new Date(1970, 1, 1, 4);
const languages = ['Eng', 'РУС', 'Հայ'];

moment_timezone.tz.setDefault('Asia/Yerevan');
BigCalendar.momentLocalizer(moment_timezone);

const slides = images.map(o => {
  return (
    <div key={o.descr} className={'culture-image'} title={o.descr}>
      <img src={o.src}/>
    </div>
  );
});

class Banner extends Component {

  state = {event_count:0, image_index:0}

  componentDidMount() {
    this.setState({...this.state,
		   event_count:window.__EVENT_COUNT_THIS_MONTH__});
  }

  render () {
    const choices = languages.map((item, idx) => {
      const c =
	    item === this.props.event_titles_language
	    ? 'language-active' : 'language-inactive';
      return <li key={idx} className={c}>{item}</li>;
    });
    const langs = (
      <ul style={{display:'inline-flex'}}
	  onClick={e => this.props.language_pick(e.target.textContent)}>
	{choices}
      </ul>
    );

    const settings = {
      dots: false,
      infinite: true,
      autoplay:true,
      speed: 800,
      // autoplaySpeed:3000,
      pauseOnHover:false,
      slidesToShow: 2,
      // slidesToScroll: 1,
      arrows:false,
      afterChange:image_index => this.setState({...this.state, image_index})
    };

    return (
      <div className={'top-banner-container'}>
        <header>
	  <div>
	    <p>
	      {`${this.state.event_count} arts & cultural events  🇦🇲`}
	    </p>
	    {langs}
	  </div>
        </header>

	<div className={'banner-slider'} >
	  <h2>
	    {`${images[this.state.image_index].descr}`}
	  </h2>
	  <Slider {...settings}>
	    {slides}
	  </Slider>
	</div>
      </div>
    );
  }
};

class ArtsCalendar extends Component {

  state = {
    events: [],
    allDay:false,
    start_date: new Date,
    end_date: new Date
  }

  componentDidMount() {
    window.__ALL_TECH_EVENTS__ =
      window.__ALL_TECH_EVENTS__.map(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);
	return {...event, start, end };
      });
    this.setState({...this.state, events: window.__ALL_TECH_EVENTS__});
  }

  render () {

    return (
      <div className={'mid-calendar-component'}>
        <BigCalendar
          scrollToTime={default_scroll_time}
          popup={true}
	  onSelectEvent={event => alert(`
Hosted by ${event.sourced_from}
${event.url}

${event.desc}
	  `)}
          timeslots={1}
          components={{
            event:event => Eventbyline({event, lang:this.props.title_language}),
            agenda:{event:EventAgenda}
          }}
          onSelectSlot={this.selectedDate}
          events={this.state.events}
	  eventPropGetter={custom_render}
          />
      </div>
    );
  }
};

function custom_render(event) {
  const backgroundColor = color_for_host(event.sourced_from);
  return {style:{backgroundColor}};
}

function Eventbyline({event, lang}) {
  const titles = event.title.split('/');
  const title = titles[languages.indexOf(lang)];
  return <span><p>{title}</p></span>;
};

function EventAgenda({event}) {
  const text_style = {
    marginTop:'1rem',
    textIndent:'2rem',
    boxShadow: 'inset 0 0 10px #000000',
    padding:'1.5em 1.5em 1.5em 1.5em',
    marginBottom:'1rem'
  };
  const top = event.title.split('/').map((i, idx) => {
    return (
      <p key={idx} style={{paddingLeft:'0.25rem'}}>
        {languages[idx]} = {i}
      </p>
    );
  });
  return (
    <div>
      {top}
      <details style={{fontStyle:'italic', marginTop:'0.5rem'}}>
	<summary>
	  Hosted by {event.sourced_from}{' '}
	  <a href={event.url}>details</a>
	</summary>
	<p style={text_style}>{event.desc}</p>
      </details>
      <hr/>
    </div>
  );
};

let items = [];
for (const name in groups) { items.push(groups[name].category); }

const cats = Array.from(new Set(items))
      .map(event_t => {
	return (
	  <div className={'event-legend-color'}
	       key={event_t}>
	    <h2>{event_t}{' '}{emoji_for_cat(event_t)}</h2>
	    <div
	      style={{
		backgroundColor:color_for_cat(event_t),
		minHeight:'20px',

		borderRadius:'10px'
	      }}>
	    </div>
	  </div>
	);
      });

const legend = (
  <div className={'events-legend'}>
    {cats}
  </div>
);

export default
class _ extends Component {

  state = {lang:'Eng'}

  render () {
    const link =
	  <a href={'https://github.com/fxfactorial/hye-life'}>here</a>;
    return (
      <div>
        <Banner
	  event_titles_language={this.state.lang}
	  language_pick={lang => this.setState({lang})} />
	  {legend}
	  <ArtsCalendar title_language={this.state.lang}/>
	  <footer>
            <p>
	      Get the source code {link},
	      improvements provided via github pull requests are{' '}
	      warmly appreciated.
	    </p>
	  </footer>
      </div>
    );
  }
};

