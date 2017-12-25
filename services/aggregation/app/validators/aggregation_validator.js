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
    checkID : function(id){
        id ? return id : return undefined;
    }
}