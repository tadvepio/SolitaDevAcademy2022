module.exports = function addEntry(model) { 
    
    return async(req,res,next) => {
        if (model.collection.collectionName === "stations"){
            try {
                const fields = req.body;
                const checkDup = await model.findOne({'Nimi':fields.Nimi})
                console.log(checkDup)
                if (checkDup) {
                    res.msg = "Station already exists"
                    next();
                } else {
                    const FID = await model.find().sort({"FID": -1}).limit(1)
                    const maxFID = FID[0].FID+1
                    fields.FID = (maxFID)
                    const ID = await model.find().sort({"ID": -1}).limit(1)
                    const maxID = ID[0].ID+1
                    fields.ID = maxID
                    const newStation = new model(fields);
                    newStation.save(function(err,results){
                        if(err) {
                            console.log(err);
                            res.msg = "Something went wrong";
                            res.status(500);
                            next();
                        } else {
                            console.log(results);
                            res.msg = "Success";
                            res.status(200)
                            next();
                        }
                    })
                }
            } catch (err) {
                res.msg = err
                next();
            }
        } else {
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
            next();
        }
}
}