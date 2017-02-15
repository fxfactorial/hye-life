import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment_timezone from 'moment-timezone';
import Slider from 'react-slick';

const default_scroll_time = new Date(1970, 1, 1, 4);
moment_timezone.tz.setDefault('Asia/Yerevan');
BigCalendar.momentLocalizer(moment_timezone);

class Banner extends Component {

  state = {event_count:0}

  componentDidMount() {
    this.setState({event_count:window.__EVENT_COUNT_THIS_MONTH__});
  }

  render () {
    const choices = 
	  ['Հայ', 'Eng', 'РУС'].map((item, idx) => {
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
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:false
    };
    return (
      <div className={'top-banner-container'}>
        <header>
	  <div>
	    <p>
	      hye.life 🇦🇲
	    </p>
	    {langs}
	  </div>
        </header>

	<Slider {...settings}>
	  <div className={'culture-image'}>
	    <img src={'komitas.jpg'}/>
	  </div>
	  <div className={'culture-image'}>
	    <img src={'1280px-Matenadaran_3.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'Armenian_Manuscript_no._4_Wellcome_L0022854.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'Armenian_martial_dance_Yarkhushta.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'Cover,_Armenia,_18th_century,_Linen,_silk,_plain_weave,_embroidery_(cross_stitch),_drawnwork_lace,_Honolulu_Academy_of_Arts.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'artsakh.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'LeonIIQueenGueraneAndTheirFiveChildren1272.jpg'}/>
	  </div>
          <div className={'culture-image'}>
	    <img src={'Tatev_Monastery_from_a_distance.jpg'}/>
	  </div>
          <div className={'culture-image'}> <img src={'dilijan.jpg'}/>
	  </div>
	</Slider>

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
          selectable
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
          />
      </div>
    );
  }
};

function Eventbyline({event, lang}) {

  const titles = event.title.split('/');
  let title = null;

  switch (lang) {
  case 'Հայ': title = titles[2]; break;
  case 'Eng': title = titles[0]; break;
  case 'РУС': title = titles[1]; break;
  default: throw new Error('Unknown language');
  }

  return (
    <span>
      <p>{title}</p>
    </span>
  );
};

function EventAgenda({event}) {
  const langs = ['Eng', 'РУС', 'Հայ'];
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
        {langs[idx]} = {i}
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

export default
class _ extends Component {

  state = {lang:'Eng'}

  render () {
    const link = <a href={'https://github.com/fxfactorial/hye-life'}>here</a>;
    return (
      <div>
        <Banner
	  event_titles_language={this.state.lang}
	  language_pick={lang => this.setState({lang})} />
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
