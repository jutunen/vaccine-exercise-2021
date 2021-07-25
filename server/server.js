const express = require("express");
const app = express();
const cors = require('cors');
//const pg = require('pg');
const knex_config = require('../knexfile.js')['development'];
const knex = require('knex')(knex_config);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const vaccineBrands = ['Zerpfy','Antiqua','SolarBuddhica'];

app.get("/test", async (req, res, next) => {

    console.log("re.query:");
    console.log(JSON.stringify(req.query));
    let palauta = req.query;
    const dateString = req.query.date

    const dateObj = new Date(dateString);

    if(isNaN(dateObj.getTime())) {
        return res.status(400).send("date is invalid");
    }

    const minDate = new Date("2021-01-01T00:00:00.000000Z");
    const maxDate = new Date("2021-04-13T00:00:00.000000Z");

    if(dateObj < minDate || dateObj > maxDate) {
        return res.status(400).send("date is out of bounds");
    }

    // convert dateString to Postgres date format:
    const datetime = dateString.replace('T',' ').replace('Z','');
    console.log("datetime: " + datetime);

    let results = {
        arrivedOrdersPerProducer: {},
        arrivedVaccinesPerProducer: {}
    };

    try {
        results.usedVaccines = await getUsedVaccinesCount(knex, datetime);
        results.arrivedOrders = await getArrivedOrdersCount(knex, datetime);
        results.arrivedVaccines = await getArrivedVaccinesCount(knex, datetime);
        results.arrivedOrdersPerProducer[vaccineBrands[0]] = await getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[0]);
        results.arrivedOrdersPerProducer[vaccineBrands[1]] = await getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[1]);
        results.arrivedOrdersPerProducer[vaccineBrands[2]] = await getArrivedOrdersCountPerProducer(knex, datetime, vaccineBrands[2]);
        results.arrivedVaccinesPerProducer[vaccineBrands[0]] = await getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[0]);
        results.arrivedVaccinesPerProducer[vaccineBrands[1]] = await getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[1]);
        results.arrivedVaccinesPerProducer[vaccineBrands[2]] = await getArrivedVaccinesCountPerProducer(knex, datetime, vaccineBrands[2]);
        results.expiredBottles = await getExpiredBottlesCount(knex, datetime);
        const vaccinesGivenFromExpiredBottles = await getExpiredBottlesGivenVaccinesCount(knex, datetime);
        const totalVaccinesInExpiredBottles = await getExpiredBottlesTotalVaccinesCount(knex, datetime);
        results.vaccinesExpiredBeforeUsage = totalVaccinesInExpiredBottles - vaccinesGivenFromExpiredBottles;
        const vaccinesGivenFromValidBottles = await getValidBottlesGivenVaccinesCount(knex, datetime);
        console.log("vaccinesGivenFromValidBottles: " + vaccinesGivenFromValidBottles);
        const totalVaccinesInValidBottles = await getValidBottlesTotalVaccinesCount(knex, datetime);
        console.log("totalVaccinesInValidBottles: " + totalVaccinesInValidBottles);
        results.validVaccinesLeft = totalVaccinesInValidBottles - vaccinesGivenFromValidBottles;
        results.vaccinesExpiringInNext10days = await getExpiringVaccinesCount(knex, datetime, 10);
    } catch (error) {
        return next(error);
    }

    //console.log("results:");
    //console.log(JSON.stringify(results));
    res.send(results);

});

console.log("Listening port 5555");
app.listen(5555);

// 1. How many of the vaccines have been used
const getUsedVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select count(*) from vaccination where date <= '${datetime}';`);
    return result.rows[0].count;
}

// 2. How many orders have arrived total
const getArrivedOrdersCount = async (knex, datetime) => {
    let result = await knex.raw(`select count(*) from bottle where arrived <= '${datetime}';`);
    return result.rows[0].count;
}

// 3. How many vaccines have arrived total
const getArrivedVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select sum(injections) as injections_count from bottle where arrived <= '${datetime}';`);
    return result.rows[0].injections_count;
}

// 4. How many orders per producer?
const getArrivedOrdersCountPerProducer = async (knex, datetime, vaccineBrand) => {
    let result = await knex.raw(`select count(*) from bottle where arrived <= '${datetime}' and vaccine = '${vaccineBrand}';`);
    return result.rows[0].count;
}

// 5. How many vaccines per producer?
const getArrivedVaccinesCountPerProducer = async (knex, datetime, vaccineBrand) => {
    let result = await knex.raw(`select sum(injections) as injections_count from bottle where arrived <= '${datetime}' and vaccine = '${vaccineBrand}';`);
    return result.rows[0].injections_count;
}

// 6. How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)
const getExpiredBottlesCount = async (knex, datetime) => {
    let result = await knex.raw(`select count(*) from bottle where expired <= '${datetime}';`);
    return result.rows[0].count;;
}

// 7. How many vaccines expired before the usage -> remember to decrease used injections from the expired bottle

//  7.1 How many vaccines were given from the bottles that were expired by the given day
const getExpiredBottlesGivenVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select count(*) from vaccination where vaccination.bottle in (select id from bottle where expired <= '${datetime}');`);
    return result.rows[0].count;;
}

// 7.2 How many vaccines were in the bottles that were expired by the given day
const getExpiredBottlesTotalVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select sum(injections) as injections_count from bottle where expired <= '${datetime}';`);
    return result.rows[0].injections_count;;
}

// 8. How many vaccines are left to use?

// 8.1 How many vaccines have been given from the bottles, that have not expired by the given day
const getValidBottlesGivenVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select count(*) from vaccination where vaccination.bottle in (select id from bottle where expired > '${datetime}');`);
    return result.rows[0].count;
}

// 8.2 How many vaccines has been in the bottles, that have not expired by the given day
const getValidBottlesTotalVaccinesCount = async (knex, datetime) => {
    let result = await knex.raw(`select sum(injections) as injections_count from bottle where expired > '${datetime}';`);
    return result.rows[0].injections_count;
}

// 9. How many vaccines are going to expire in the next 10 days
const getExpiringVaccinesCount = async (knex, datetime, periodInDays) => {

    let result = await knex.raw(`select count(*) from bottle where expired >= '${datetime}' and expired <= ('${datetime}'::timestamp + '${periodInDays} days'::interval);`);

    //console.log("result.rows[0]");
    //console.log(JSON.stringify(result.rows[0]));

    if(result.rows[0].count == 0 ) {
        return 0;
    }
    
    result = await knex.raw(`select sum(injections) as injections_count from bottle where expired >= '${datetime}' and expired <= ('${datetime}'::timestamp + '${periodInDays} days'::interval);`);
    return result.rows[0].injections_count;
}






