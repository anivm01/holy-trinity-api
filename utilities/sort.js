const sortNewestToOldest = (data) => {
    const sortedArray = data.sort( (a,b) => {
        return new Date(b.date) - new Date(a.date);
    })
    return sortedArray
}

module.exports = { sortNewestToOldest };