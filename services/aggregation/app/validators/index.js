module.exports = {
    checkInt : function(string) {
        if (string) {
            let res = Number(parseInt(string));
            if (isNaN(res) || res < 0)
                return undefined;
            return res;
        }
        return undefined;
    },
    checkValue : function(value) {
        if (!value || typeof(value) == 'undefined' || value.length == 0)
            return false;
        else
            return true;
    }
}