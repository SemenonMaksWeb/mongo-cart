module.exports = async (model,id) =>{
    return  await model.findById(id).exec();
}