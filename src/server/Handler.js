const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

const admin = require('firebase-admin');

const serviceAccount = require('https://storage.googleapis.com/model-machine-learning-khairunasrw/submissionmlgc-khairunasrw-f8d94bba89e2.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

async function postPredictHandler(request,h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, suggestion } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: confidenceScore > 50 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
        data
    })
    response.code(201);
    return response;
}

// perlu update
async function getHistoriesHandler(request,h) {
    try {
        const historiesRef = firestore.collection('predictions');
        const snapshot = await historiesRef.get();

        const data = [];
        snapshot.forEach(doc => {
        const history = {
            id: doc.id,
            history: doc.data()
        };
        data.push(history);
    });
    
        return { status: 'success', data: data };
    } catch (error) {
        console.error('Error getting history documents', error);
        return h.response({ status: 'error', message: 'Internal server error' }).code(500);
    }
};

module.exports = { postPredictHandler, getHistoriesHandler };