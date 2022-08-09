module.exports = function addEntry(model) { 
    
    return async(req,res,next) => {
        
        if (req.body) {
            const fields = req.body;
            const newEntry = new model(fields);
            console.log(newEntry);
            newEntry.save(function(err,results){
                if(err) {
                    console.log(err)
                    res.msg = "Fail"
                    next();
                } else {
                    console.log(results)
                    res.msg = "Success"
                    next();
                }
            })
        } else {
            res.msg = "No body"
            next();
        }
}
}