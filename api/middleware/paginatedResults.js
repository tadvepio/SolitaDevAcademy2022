// Pagination middleware
module.exports = function paginatedResults(model) {
    return async (req, res, next) => {

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        let fields = {};
        let sort = {};
        let distMore = 0;
        let distLess = 9999999999;
        let durMore = 0;
        let durLess = 9999999999;

        if (req.method === 'POST') {
            try{
            req.body.distMore ? distMore = (parseInt(req.body.distMore)*1000) : null;
            req.body.distLess ? distLess = (parseInt(req.body.distLess)*1000) : null;
            req.body.durMore ? durMore= (parseInt(req.body.durMore)*60) : null;
            req.body.durLess ? durLess = (parseInt(req.body.durLess)*60) : null;
            fields = {
                'Covered distance (m)': {$gt:distMore,$lt:distLess},
                'Duration (sec)': {$gt:durMore,$lt:durLess},
            }
            req.body[['Departure station name']] ? fields['Departure station name'] = req.body['Departure station name'] : null;
            req.body['Return station name'] ? fields['Return station name'] = req.body['Departure station name'] : null;
            req.query.sort ? sort[req.query.sort.slice(0, -2).replace(",","")] = parseInt(req.query.sort.slice(-2).trim()) : null;
            }
            catch(err){
                res.send(err)
            }
        }

        if (req.method === 'GET' && model.collection.collectionName === 'stations'){
            sort['Nimi'] = 1
        }

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        try { 
            const docs = await model.find(fields).countDocuments().exec()
            results.last = Math.ceil((docs/limit))
        } catch ( err ) {
            console.log(err)
        }

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
            page: page + 1,
            limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find(fields).sort(sort).limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}