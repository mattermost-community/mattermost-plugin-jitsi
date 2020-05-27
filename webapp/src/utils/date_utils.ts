export function formatDate(date: Date, useMilitaryTime: boolean = false): string {
    const monthNames = [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct',
        'Nov', 'Dec'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    let hours = date.getHours();
    const minutes = date.getMinutes();

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

    let minutesText = minutes.toString();
    if (minutes < 10) {
        minutesText = '0' + minutes;
    }

    return monthNames[monthIndex] + ' ' + day + ' at ' + hours + ':' + minutesText + ampm;
}
