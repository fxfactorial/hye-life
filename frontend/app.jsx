import Application from '../lib/hye-life';
import React from 'react';
import { render } from 'react-dom';
// Solely because of Safari's fetch sucking
import 'whatwg-fetch';

render(<Application/>, document.getElementById('container'));
