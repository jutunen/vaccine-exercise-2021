
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

    let result = await knex.raw(`select count(*) from bottle where arrived <= '${datetime}';`);

    if(result.rows[0].count == 0) {
        return 0;
    }

    result = await knex.raw(`select sum(injections) as injections_count from bottle where arrived <= '${datetime}';`);
    return result.rows[0].injections_count;
}

// 4. How many orders per producer?
const getArrivedOrdersCountPerProducer = async (knex, datetime, vaccineBrand) => {
    let result = await knex.raw(`select count(*) from bottle where arrived <= '${datetime}' and vaccine = '${vaccineBrand}';`);
    return result.rows[0].count;
}

// 5. How many vaccines per producer?
const getArrivedVaccinesCountPerProducer = async (knex, datetime, vaccineBrand) => {

    let result = await knex.raw(`select count(*) from bottle where arrived <= '${datetime}' and vaccine = '${vaccineBrand}';`);

    if(result.rows[0].count == 0) {
        return 0;
    }
    
    result = await knex.raw(`select sum(injections) as injections_count from bottle where arrived <= '${datetime}' and vaccine = '${vaccineBrand}';`);
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

// 8.1 How many total vaccine doses are in the bottles that are going to expire in the next 10 days
const getExpiringVaccinesTotalCount = async (knex, dateCondition) => {

    let result = await knex.raw(`select count(*) from bottle where ${dateCondition};`);

    if(result.rows[0].count == 0 ) {
        return 0;
    }
    
    result = await knex.raw(`select sum(injections) as injections_count from bottle where ${dateCondition};`);
    return result.rows[0].injections_count;
}

// 8.2 How many vaccines have been used from the bottles that are going to expire in the next 10 days
const getExpiringBottlesUsedVaccinesCount = async (knex, dateCondition) => {

    let result = await knex.raw(`select count(*) from bottle where ${dateCondition};`);

    if(result.rows[0].count == 0 ) {
        return 0;
    }
    
    result = await knex.raw(`select count(*) from vaccination where vaccination.bottle in (select id from bottle where ${dateCondition});`);
    return result.rows[0].count;
}

module.exports = {
    getUsedVaccinesCount: getUsedVaccinesCount,
    getArrivedOrdersCount: getArrivedOrdersCount,
    getArrivedVaccinesCount: getArrivedVaccinesCount,
    getArrivedOrdersCountPerProducer: getArrivedOrdersCountPerProducer,
    getArrivedVaccinesCountPerProducer: getArrivedVaccinesCountPerProducer,
    getExpiredBottlesCount: getExpiredBottlesCount,
    getExpiredBottlesGivenVaccinesCount: getExpiredBottlesGivenVaccinesCount,
    getExpiredBottlesTotalVaccinesCount: getExpiredBottlesTotalVaccinesCount,
    getExpiringVaccinesTotalCount: getExpiringVaccinesTotalCount,
    getExpiringBottlesUsedVaccinesCount: getExpiringBottlesUsedVaccinesCount
  };