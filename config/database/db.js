const mongoose = require('mongoose');

function connectToDatabase(dbUrl) {
    mongoose.connect(dbUrl, { useNewUrlParser: true });

    const connection = mongoose.connection;
    connection.on("error", () => {
        console.log("Error while connecting to the Mongo DB");
    });
}

module.exports = {
    connectToDatabase,
};
