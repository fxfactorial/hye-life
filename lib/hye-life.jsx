import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment_timezone from 'moment-timezone';
import Slider from 'react-slick';
import images from './slides';
import {
  color_for_host, color_for_cat, emoji_for_cat,
  NEUTRAL, BRIGHTS
}
from './coloring';
// Very awesome build time sharing of code, yay webpack2
import groups from '../backend/groups.json';

const default_scroll_time = new Date(1970, 1, 1, 4);
const languages = ['Eng', 'РУС', 'Հայ'];

moment_timezone.tz.setDefault('Asia/Yerevan');
BigCalendar.momentLocalizer(moment_timezone);

const slides = images.map(o => (
  <div key={o.descr} className={'culture-image'} title={o.descr}>
    <img src={o.src}/>
    <p className={'image-descr'}>{o.descr}</p>
  </div>
));

const breakpoints = {
  big:{
    breakpoint:2400, jump:3
  },
  mid:{
    breakpoint:800, jump:2
  },
  small:{
    breakppint:380, jump:1
  }
};

class Banner extends Component {

  state = {event_count:0}

  componentDidMount() {
    this.setState({...this.state,
		   event_count:window.__EVENT_COUNT_THIS_MONTH__});
  }

  render () {
    const choices = languages.map((item, idx) => {
      const c =
	    item === this.props.event_titles_language
	    ? 'language-active' : 'language-inactive';
      return (
	<li
	  key={idx}
	  className={c}
	  onClick={e => this.props.language_pick(e.target.textContent)}>
	  {item}
	</li>
      );
    });
    const langs = <ul className={'language-choices'}>{choices}</ul>;
    const responsive = [{
      breakpoint: breakpoints.big.breakpoint,
      settings: {
        slidesToShow: breakpoints.big.jump,
        slidesToScroll: breakpoints.big.jump
      }
    }, {
      breakpoint: breakpoints.mid.breakpoint,
      settings: {
        slidesToShow: breakpoints.mid.jump,
        slidesToScroll: breakpoints.mid.jump
      }
    }, {
      breakpoint: breakpoints.small.breakppint,
      settings: {
        slidesToShow: breakpoints.small.jump,
        slidesToScroll: breakpoints.small.jump
      }
    }];

    const settings = {
      dots: false,
      infinite: true,
      autoplay:true,
      speed: 1200,
      pauseOnHover:false,
      responsive,
      arrows:false
    };

    return (
      <div className={'top-banner-container'}>
        <header>
	  <div className={'top-banner-event-count'}>
	    <p>
	      {`${this.state.event_count} arts & cultural events  🇦🇲`}
	    </p>
	    {langs}
	  </div>
        </header>
	<div className={'banner-slider'}>
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
            event:event =>
	      Eventbyline({event, lang:this.props.title_language}),
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

const legend = color_scheme => {
  return (
    Array.from(new Set(items))
      .map(event_t => {
	return (
	  <div key={event_t}>
	    <h2 className={'legend-description'}>
	      {event_t}{' '}{emoji_for_cat(event_t)}
	    </h2>
	    <div
	      className={'legend-color'}
	      style={{
		backgroundColor:color_for_cat(event_t, color_scheme)
	      }}>
	    </div>
	  </div>
	);
      })
  );
};

export default
class _ extends Component {

  state = {lang:'Eng', color_scheme:BRIGHTS}

  render () {
    const link =
	  <a href={'https://github.com/fxfactorial/hye-life'}>here</a>;
    const calendar_legend = (
      <div className={'events-legend'}>
	{legend(this.state.color_scheme)}
      </div>
    );

    return (
      <div>
        <Banner
	  color_scheme={this.state.color_scheme}
	  event_titles_language={this.state.lang}
	  language_pick={lang => this.setState({...this.state, lang})} />
	  {calendar_legend}
	  <p id={'mobile-message'}>
	    You can see the events on hye.life better on
	    desktop or landscape on mobile
	  </p>
	  <ArtsCalendar title_language={this.state.lang}/>
	  <footer>
            <p>
	      Get the source code {link},
	      improvements provided via github pull requests are{' '}
	      warmly appreciated.
	    </p>
	    <p>Created by <a href={'http://hyegar.com'}>Edgar Aroutiounian</a></p>
	  </footer>
      </div>
    );
  }
};

