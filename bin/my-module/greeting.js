var currentDate = new Date();
module.exports.date = currentDate;

module.exports.getMessage = function (name) {
    var h = currentDate.getHours();

    if (h > 16)
        return 'Good evening, ' + name;
    else if (h > 10)
        return 'Good afternoon, ' + name;
    else
        return 'Good morning, ' + name;
}

module.exports.name = 'Sergey';