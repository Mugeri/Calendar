/* eslint react/no-multi-comp:0, no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const unavailableDates = require('./results.json');

// use this to turn the range strings inthe json file to dates
function stringToDate(dateString) {
  const stringDates = dateString.split('-');
  stringDates.map((item) => {
    item = parseInt(item);
  });
  const numberDates = stringDates[1] - stringDates[0];
  const hours = numberDates/100;
  const minutes = numberDates%100;
  console.log('HOURS: ', hours, minutes);
}

//use this to store the unavailable dates so as to pass them to RangeCalendar
function unavailability (unavailableDates) {
  let unavailableDays = [];
  let unavailableHours = [];
  const landlordUnavailable = unavailableDates.landlordUnavailability;
  landlordUnavailable.map((key) => {
    console.log('KEY: ', key)
      key.unavailability.map((week) => {
        console.log('WEEK: ', week);
        Object.keys(week).forEach((key, index) => {
          console.log('DAY: ', week[key]);
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
    console.log('KEY: ', key);
      key.unavailability.map((time) => {
        stringToDate(time);
        unavailableHours.push(time);
      })
      console.log('============= Hours', unavailableHours);
  })
}

const cn = window.location.search.indexOf('cn') !== -1;
let availableTime = '00:00:00';

if (cn) {
  moment.locale('zh-cn');
} else {
  moment.locale('en-gb');
}

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = (
  <TimePickerPanel
    defaultValue={[moment(availableTime, 'HH:mm:ss')]}
    value = {[moment(availableTime, 'HH:mm:ss')]}
  />
);

function newArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.isBefore(date);  // can not select days before today
}

function disabledTime(time, type) {
  unavailability(unavailableDates);
  console.log('disabledTime', time, type, availableTime);
  if (type === 'start') {
    return {
      disabledHours() {
        const hours = newArray(0, 60);
        hours.splice(20, 4);
        return hours;
      },
      disabledMinutes(h) {
        if (h === 20) {
          return newArray(0, 31);
        } else if (h === 23) {
          return newArray(30, 60);
        }
        return [];
      },
      disabledSeconds() {
        return [55, 56];
      },
    };
  }
  return {
    disabledHours() {
      const hours = newArray(0, 60);
      hours.splice(2, 6);
      return hours;
    },
    disabledMinutes(h) {
      if (h === 20) {
        return newArray(0, 31);
      } else if (h === 23) {
        return newArray(30, 60);
      }
      return [];
    },
    disabledSeconds() {
      return [55, 56];
    },
  };
}

const formatStr = 'YYYY-MM-DD HH:mm:ss';
function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

function onStandaloneChange(value) {
  console.log('onChange');
  console.log(value[0] && format(value[0]), value[1] && format(value[1]));
}

function onStandaloneSelect(value) {
  console.log('onSelect');
  console.log(format(value[0]), format(value[1]));
}
export class RangeCalendarComp extends React.Component {
  render(){
    console.log('DISABLED TIME: ', disabledTime);
    return (
      <div>
        <h2>calendar</h2>
        <div style={{ margin: 10 }}>
          <RangeCalendar
            showToday={false}
            showWeekNumber
            dateInputPlaceholder={['start', 'end']}
            locale={cn ? zhCN : enUS}
            showOk={false}
            showClear
            format={formatStr}
            onChange={onStandaloneChange}
            onSelect={onStandaloneSelect}
            disabledDate={disabledDate}
            timePicker={timePickerElement}
            disabledTime={disabledTime}
          />
        </div>
        <br />

        {/*<div style={{ margin: 20 }}>
          <Demo />
        </div> */}
      </div>
    );
  }
}

// class Demo extends React.Component {
//   state = {
//     value: [],
//     hoverValue: [],
//   }
//
//   onChange = (value) => {
//     console.log('onChange', value);
//     this.setState({ value });
//   }
//
//   onHoverChange = (hoverValue) => {
//     this.setState({ hoverValue });
//   }
//
//   render() {
//     const state = this.state;
//     const calendar = (
//       <RangeCalendar
//         hoverValue={state.hoverValue}
//         onHoverChange={this.onHoverChange}
//         showWeekNumber={false}
//         dateInputPlaceholder={['start', 'end']}
//         defaultValue={[now, now.clone().add(1, 'months')]}
//         locale={cn ? zhCN : enUS}
//         disabledTime={disabledTime}
//         timePicker={timePickerElement}
//       />
//     );
//     return (
//       <Picker
//         value={state.value}
//         onChange={this.onChange}
//         animation="slide-up"
//         calendar={calendar}
//       >
//         {
//           ({ value }) => {
//             return (<span>
//                 <input
//                   placeholder="please select"
//                   style={{ width: 350 }}
//                   disabled={state.disabled}
//                   readOnly
//                   className="ant-calendar-picker-input ant-input"
//                   value={isValidRange(value) && `${format(value[0])} - ${format(value[1])}` || ''}
//                 />
//                 </span>);
//           }
//         }
//       </Picker>);
//   }
// }
// export default Demo;
