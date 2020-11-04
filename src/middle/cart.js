module.exports = function (limit, page) {
    let  data = {};
    if(page !== undefined){
        data.page = Number(page);
    }else {
        data.page = 1;
    }
    if(limit !== undefined){
        if(limit > 15){
            data.limit = 15;
        }
    }else {
        data.limit = 15;
    }
    data.skip = data.limit * (data.page - 1);
    return data;
}