export function formatDate(date, useMilitaryTime = false) {
    const monthNames = [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct',
        'Nov', 'Dec'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = '';
    if (!useMilitaryTime) {
        ampm = ' AM';
        if (hours >= 12) {
            ampm = ' PM';
        }

        hours %= 12;
        if (!hours) {
            hours = 12;
        }
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return monthNames[monthIndex] + ' ' + day + ' at ' + hours + ':' + minutes + ampm;
}
