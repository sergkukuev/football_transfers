module.exports = {
    parseDate : function(date){
        if (!date)
            return null;
        const dateParts = date.split('.');

        if (!dateParts || dateParts.length != 3)
            return null;
        
        let year  = parseInt(dateParts[2]);
        let month = parseInt(dateParts[1]);
        let day   = parseInt(dateParts[0]);

        return new Date(year, month - 1, day);
    },
    checkInt : function(string){
        if (string) {
            let res = Number(parseInt(string));
            if (isNaN(res) || res < 0)
                return undefined;
            return res;
        }
        return undefined;
    }
}