export function formatDate(date, shorten) {;
    const now = new Date();

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeeks = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    let dateString;
    if(shorten) {
        if (diffYear > 0) {
            dateString = `${diffYear}yr`;
        } else if (diffWeeks > 0) {
            dateString = `${diffWeeks}w`;
        } else if (diffDay > 0) {
            dateString = `${diffDay}d`;
        } else if (diffHour > 0) {
            dateString = `${diffHour}hr`;
        } else if (diffMin > 0) {
            dateString = `${diffMin}m`;
        } else if (diffSec > 0) {
            dateString = `${diffSec}s`;
        } else {
            dateString = `1s`;
        }
    } else {
        if (diffYear > 0) {
            dateString = `${diffYear} ${diffYear > 1 ? "years" : "year"} ago`;
        } else if (diffMonth > 0) {
            dateString = `${diffMonth} ${diffMonth > 1 ? "months" : "month"} ago`;
        } else if (diffDay > 0) {
            dateString = `${diffDay} ${diffDay > 1 ? "days" : "day"} ago`;
        } else if (diffHour > 0) {
            dateString = `${diffHour} ${diffHour > 1 ? "hours" : "hour"} ago`;
        } else if (diffMin > 0) {
            dateString = `${diffMin} ${diffMin > 1 ? "minutes" : "minute"} ago`;
        } else if (diffSec > 0) {
            dateString = `${diffSec} ${diffSec > 1 ? "seconds" : "second"} ago`;
        } else {
            dateString = `just now`;
        }
    }
    return dateString;
}