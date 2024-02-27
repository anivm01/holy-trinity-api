const dateToUnixTimestamp = (dateString) => {
    console.log(dateString)
    const result = Math.floor(new Date(dateString).getTime() / 1000);
    return result
};

const toMonthYearString = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

module.exports = { dateToUnixTimestamp, toMonthYearString };