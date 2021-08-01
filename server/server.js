const express = require("express");
const app = express();
const cors = require('cors');
const knex_config = require('../knexfile.js')['development'];
const knex = require('knex')(knex_config);
const f = require('./functions.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const vaccineBrands = ['Zerpfy','Antiqua','SolarBuddhica'];
const minDate = 1609545600000; // '2021-01-02T00:00:00.000Z'
const maxDate = 1618257600000; // '2021-04-12T20:00:00.000Z'

app.get("/vaccine", async (req, res, next) => {

    if(!req.query.date) {
        return res.status(400).send("invalid request");        
    }

    const dateString = req.query.date;
    const dateObj = new Date(dateString);

    if(isNaN(dateObj.getTime())) {
        return res.status(400).send("date is invalid");
    }

    const requestDate = dateObj.getTime();

    if(requestDate < minDate || requestDate > maxDate) {
        return res.status(400).send("date is out of bounds");
    }

    // convert dateString to Postgres date format:
    const datetime = dateString.replace('T',' ').replace('Z',' z');

    let results = {
        arrivedOrdersPerProducer: {},
        arrivedVaccinesPerProducer: {}
    };

    try {
        results.arrivedOrders = await f.getArrivedOrdersCount(knex, datetime);
        const arrivedVaccines = await f.getArrivedVaccinesCount(knex, datetime);
        results.arrivedVaccines = arrivedVaccines;
        const usedVaccines = await f.getUsedVaccinesCount(knex, datetime);
        results.usedVaccines = usedVaccines;
        results.arrivedOrdersPerProducer[vaccineBrands[0]] = await f.getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[0]);
        results.arrivedOrdersPerProducer[vaccineBrands[1]] = await f.getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[1]);
        results.arrivedOrdersPerProducer[vaccineBrands[2]] = await f.getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[2]);
        results.arrivedVaccinesPerProducer[vaccineBrands[0]] = await f.getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[0]);
        results.arrivedVaccinesPerProducer[vaccineBrands[1]] = await f.getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[1]);
        results.arrivedVaccinesPerProducer[vaccineBrands[2]] = await f.getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[2]);
        results.expiredBottles = await f.getExpiredBottlesCount(knex, datetime);
        const vaccinesGivenFromExpiredBottles = await f.getExpiredBottlesGivenVaccinesCount(knex, datetime);
        const totalVaccinesInExpiredBottles = await f.getExpiredBottlesTotalVaccinesCount(knex, datetime);
        const vaccinesExpiredBeforeUsage = totalVaccinesInExpiredBottles - vaccinesGivenFromExpiredBottles;
        results.vaccinesExpiredBeforeUsage = vaccinesExpiredBeforeUsage;
        results.validVaccinesLeft = arrivedVaccines - usedVaccines - vaccinesExpiredBeforeUsage;

        const periodInDays = 10;
        const dateCondition = `expired >= '${datetime}' and expired <= ('${datetime}'::timestamp + '${periodInDays} days'::interval)`;

        const vaccinesExpiringInNext10daysTotal = await f.getExpiringVaccinesTotalCount(knex, dateCondition);
        const usedVaccinesFromBottlesExpiringInNext10days = await f.getExpiringBottlesUsedVaccinesCount(knex, dateCondition);
        results.vaccinesExpiringInNext10days = vaccinesExpiringInNext10daysTotal - usedVaccinesFromBottlesExpiringInNext10days;
    } catch (error) {
        return next(error);
    }

    //console.log("results:");
    //console.log(JSON.stringify(results));
    res.send(results);

});

console.log("Listening port 5555");
app.listen(5555);

