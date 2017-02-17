import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment_timezone from 'moment-timezone';
import Slider from 'react-slick';
import images from './slides';
import {
  color_for_host, color_for_cat, emoji_for_cat,
  NEUTRAL, BRIGHTS, ENGLISH, RUSSIAN, ARMENIAN
}
from './coloring';
// Very awesome build time sharing of code, yay webpack2
import groups from '../backend/groups.json';

const default_scroll_time = new Date(1970, 1, 1, 4);
const languages = [ENGLISH, RUSSIAN, ARMENIAN];

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

// Probably should be in a DB
const localization = {
  haj: {
    datetime:{today:'Այսօր', month:'Ամիս', week:'Շաբաթ', day:'Օր', agenda:'Օրակարգ'},
    title:'Արվեստ և մշակութային իրադարձություններ',
    casual:'առօրյա',
    museum:'թանգարան',
    gallery:'պատկերասրահ',
    'live performance':'կենդանի կատարում',
    details:'միջոցառումները վերցվում են հետևյալ հայկական ֆեյսբուքյան խմբերից',
    created_by:'Պատրաստված է Էդգար Հարությունյանի կողմից',
    mobile_msg:'Միջոցառումները ավելի լավ տեսնելու համար այցելեք համակարգչից կամ շրջեք էկրանը',
    acknowledgments:'Թարգմանությունները տրամադրվել են iterate-ի հաքերների կողմից',
    pr:'Կայքի ամբողջական կոդը կարող եք գտնել այստեղ։ Կայքի բարելավելումները github-ում pull request-ների տեսքով ջերմորեն կգնահատվեն։'
  },
  eng: {
    datetime:{today:'today', month:'month', week:'week', day:'day', agenda:'agenda'},
    title:'arts & cultural events',
    casual:'casual',
    museum:'museum',
    gallery:'gallery',
    'live performance':'live performance',
    details:'Sourcing events from these Armenian Facebook groups',
    created_by:'Created by Edgar Aroutiounian',
    mobile_msg:'You can see the events on hye.life better on desktop or landscape on mobile',
    acknowledgments:'Translations provided by hackers from iterate',
    pr:'Get the source code here, improvements provided via github pull requests are warmly appreciated.'
  },
  rus: {
    datetime:{today:'Сегодня', month:'Месяц', week:'Неделя', day:'День', agenda:'все события'},
    title:'Искусство и культурные мероприятия',
    casual:'Повседневный',
    museum:'Музей',
    gallery:'Галлерея',
    'live performance':'Прямой эфир',
    details:'Получение информации о мероприятиях из этих групп Facebook',
    created_by:'Сделано Эдгаром Арутюняном',
    mobile_msg:'Лучше обозревать календарь событий с помощью компьютера или горизонтально расположенного телефона',
    acknowledgments:'Перевод был предоставлен хакерами из Iterate',
    pr:'Скачать исходный код вы можете здесь, улучшения, предоставленные в виде github pull requests, будут высоко оценены'
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
      // Move to new slides every 4 seconds
      autoplaySpeed: 5000,
      // How long the entire transition should take
      speed:2000,
      pauseOnHover:false,
      responsive,
      arrows:false
    };
    const title =
	  `${this.state.event_count} ${this.props.localization.title} 🇦🇲`;
    return (
      <div className={'top-banner-container'}>
        <header>
	  <div className={'top-banner-event-count'}>
	    <p>{title}</p>
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

  messages = {next:'>', previous:'<'}

  state = {
    events: [],
    allDay:false,
    start_date: new Date,
    end_date: new Date
  }

  componentDidMount() {
    window.__ALL_TECH_EVENTS__ = window.__ALL_TECH_EVENTS__.map(event => {
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
	  messages={{...this.messages, ...this.props.localization.datetime}}
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

const items = [];
const group_descr = [];
for (const name in groups) { items.push(groups[name].category); }
for (const name in groups) {
  group_descr.push({
    name,
    link:`https://www.facebook.com/profile.php?id=${groups[name].id}`
  });
}

const legend = (color_scheme, localization) => {
  return (
    Array.from(new Set(items))
      .map(event_t => {
	let descr = localization[event_t];
	return (
	  <div key={event_t}>
	    <h2 className={'legend-description'}>
	      {descr}{' '}{emoji_for_cat(event_t)}
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

const group_descriptions = (
  <div className={'group-descriptions'}>
    {group_descr.map(({name, link}) => {
      return (
	<p key={name}>
	  <a href={link}>{name}</a>
	</p>
      );
    })}
  </div>
);

export default
class _ extends Component {

  state = {
    lang:ENGLISH,
    color_scheme:BRIGHTS,
    localization:localization.eng
  }

  language_pick = lang => {
    if (lang === ENGLISH)
      this.setState({...this.state, lang, localization:localization.eng});
    else if (lang === RUSSIAN)
      this.setState({...this.state, lang, localization:localization.rus});
    else
      this.setState({...this.state,lang, localization:localization.haj});
  }

  render () {
    let local = null;

    if (this.state.lang === RUSSIAN) local = localization.rus;
    else if (this.state.lang === ARMENIAN) local = localization.haj;
    else local = localization.eng;

    const pr_link =
      'https://github.com/fxfactorial/hye-life';
    const calendar_legend = (
      <div className={'events-legend'}>
	{legend(this.state.color_scheme, local)}
      </div>
    );

    return (
      <div>
        <Banner
	  localization={this.state.localization}
	  color_scheme={this.state.color_scheme}
	  event_titles_language={this.state.lang}
	  language_pick={this.language_pick}/>
	{calendar_legend}
	<details>
	  <summary>{local.details}</summary>
	  {group_descriptions}
	</details>
	<p id={'mobile-message'}>{local.mobile_msg}</p>
	<ArtsCalendar
	  localization={this.state.localization}
	  title_language={this.state.lang}/>
	<footer>
          <p> <a href={pr_link}> {local.pr} </a> </p>
	  <p>
	    <a href={'http://iteratehackerspace.com'}>
	      {local.acknowledgments}
	    </a>
	  </p>
	  <p> <a href={'http://hyegar.com'}>{local.created_by}</a> </p>
	</footer>
      </div>
    );
  }
};
