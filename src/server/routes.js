const { postPredictHandler, getHistoriesHandler } = require('../server/Handler')

const routes = [
    // Endpoint untuk menambahkan data histori
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true
            }
        }
    },
    // Endpoint untuk mendapatkan data histori
    {
        path: '/predict/histories',
        method: 'GET',
        handler: getHistoriesHandler,
    }
]
module.exports = routes;