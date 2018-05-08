/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-calendar/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const unavailableDates = require('./results.json');

const format = 'YYYY-MM-DD HH:mm:ss';
const cn = window.location.search.indexOf('cn') !== -1;

let unavailableHours = [];
let unavailableDays = [];

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

function getFormat(time) {
  return time ? format : 'YYYY-MM-DD';
}

// use this to turn the range strings in the json file to dates
function stringToDate(dateString) {
  const stringDates = dateString.split('-');
  const numberDates = stringDates.map((item) => {
    return item = parseInt(item, 10)/100;
  });
  const numberDiff = stringDates[1] - stringDates[0];
  const hours = numberDiff/100;
  const minutes = numberDiff%100;
  for (let i=hours; i >= 0; i--) {
    const range = (numberDates[0] + i);
    unavailableHours.indexOf(range) === -1 && unavailableHours.push(range);
  }
  return unavailableHours;
}

//use this to store the unavailable dates so as to pass them to disableDates
function unavailability (unavailableDates) {
  const landlordUnavailable = unavailableDates.landlordUnavailability;
  landlordUnavailable.map((key) => {
      key.unavailability.map((week) => {
        Object.keys(week).forEach((key, index) => {
          if (week[key] !== null) {
            const dateArray = week[key];
            dateArray.map((item) => {
              stringToDate(item);
            })
            unavailableDays.push(key);
          }
        })
    })
  });
  const landlordUnavailableHours = unavailableDates.landlordUnavailabilityForDate;
  landlordUnavailableHours.map((key) => {
      key.unavailability.map((time) => {
        stringToDate(time);
      })
  })
  return { unavailableDays, unavailableHours };
}


const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

function disabledTime(date) {
  const disableDays = unavailability (unavailableDates);
  return {
    disabledHours() {
      return disableDays.unavailableHours;
    },
  };
}


function disabledDate(current) {
  const disableDays = unavailability (unavailableDates);
  if (!current) {
    // allow empty select
    return false;
  }
  disableDays.unavailableDays.map((keys) => {
    if (current && current.format('dddd') === keys) {
      return true;
    }
  });

  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.valueOf() < date.valueOf();  // can not select days before today
}

class Demo extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.object,
    defaultCalendarValue: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      showTime: true,
      showDateInput: true,
      disabled: false,
      value: props.defaultValue,
    };
  }

  onChange = (value) => {
    this.setState({
      value,
    });
  }

  onShowTimeChange = (e) => {
    this.setState({
      showTime: e.target.checked,
    });
  }

  onShowDateInputChange = (e) => {
    this.setState({
      showDateInput: e.target.checked,
    });
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  render() {
    console.log(defaultCalendarValue);
    const state = this.state;
    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="please input"
      formatter={getFormat(state.showTime)}
      disabledTime={state.showTime ? disabledTime : null}
      timePicker={state.showTime ? timePickerElement : null}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput}
      disabledDate={disabledDate}
    />);
    return (<div style={{ width: 400, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
      </div>
      <div style={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
        lineHeight: 1.5,
        marginBottom: 22,
      }}
      >
        { calendar }
      </div>
    </div>);
  }
}

function onStandaloneSelect(value) {
  console.log('onStandaloneSelect');
  console.log(value && value.format(format));
}

function onStandaloneChange(value) {
  console.log('onStandaloneChange');
  console.log(value && value.format(format));
}

export default Demo;

