# Calendar
create a calendar component to integrate with existing react code

Remember to install the packages needed.
1. rc-calendar
2. rc-time-picker

to make duplicate calendars with different months just call
```
<Demo defaultCalendarValue={defaultCalendarValue}/>
```

where defaultCalendarValue is
```
const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');
```
and the number in the add depends with how many months ahead you want to be.
