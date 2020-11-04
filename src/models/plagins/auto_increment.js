module.exports = async function(model, data, next) {
    // Only applies to new documents, so updating with model.save() method won't update id
    // We search for the biggest id into the documents (will search in the model, not whole db
    // We limit the search to one result, in descendant order.
    // if(data.isNew) {
        let total = await model.findOne().sort({'_id':-1});
        if(total === null){
            data._id = "1";
        }else {
            data._id = Number(total._id) + 1;
        }
        next();
};