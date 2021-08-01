const request = require("supertest");
const app = require("./app.js");

let promises = [];

promises[0] = request(app)
    .get("/")
    .expect(404)
    .then(() => "Test passed!")
    .catch((err) => err);

promises[1] = request(app)
    .get("/vaccine")
    .expect(400)
    .then(() => "Test passed!")
    .catch((err) => err);

promises[2] = request(app)
    .get("/vaccine?date=2021-01-02T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 0,
            Antiqua: 0,
            SolarBuddhica: 0,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 0,
            Antiqua: 0,
            SolarBuddhica: 0,
        },
        arrivedOrders: 0,
        arrivedVaccines: 0,
        usedVaccines: 0,
        expiredBottles: 0,
        vaccinesExpiredBeforeUsage: 0,
        validVaccinesLeft: 0,
        vaccinesExpiringInNext10days: 0,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[3] = request(app)
    .get("/vaccine?date=2021-01-09T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 120,
            Antiqua: 106,
            SolarBuddhica: 114,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 600,
            Antiqua: 424,
            SolarBuddhica: 684,
        },
        arrivedOrders: 340,
        arrivedVaccines: 1708,
        usedVaccines: 58,
        expiredBottles: 0,
        vaccinesExpiredBeforeUsage: 0,
        validVaccinesLeft: 1650,
        vaccinesExpiringInNext10days: 0,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[4] = request(app)
    .get("/vaccine?date=2021-01-19T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 289,
            Antiqua: 267,
            SolarBuddhica: 290,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 1445,
            Antiqua: 1068,
            SolarBuddhica: 1740,
        },
        arrivedOrders: 846,
        arrivedVaccines: 4253,
        usedVaccines: 335,
        expiredBottles: 0,
        vaccinesExpiredBeforeUsage: 0,
        validVaccinesLeft: 3918,
        vaccinesExpiringInNext10days: 0,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[5] = request(app)
    .get("/vaccine?date=2021-02-06T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 562,
            Antiqua: 566,
            SolarBuddhica: 592,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 2810,
            Antiqua: 2264,
            SolarBuddhica: 3552,
        },
        arrivedOrders: 1720,
        arrivedVaccines: 8626,
        usedVaccines: 1363,
        expiredBottles: 244,
        vaccinesExpiredBeforeUsage: 868,
        validVaccinesLeft: 6395,
        vaccinesExpiringInNext10days: 1737,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[6] = request(app)
    .get("/vaccine?date=2021-02-20T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 790,
            Antiqua: 808,
            SolarBuddhica: 821,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 3950,
            Antiqua: 3232,
            SolarBuddhica: 4926,
        },
        arrivedOrders: 2419,
        arrivedVaccines: 12108,
        usedVaccines: 2277,
        expiredBottles: 940,
        vaccinesExpiredBeforeUsage: 3428,
        validVaccinesLeft: 6403,
        vaccinesExpiringInNext10days: 1762,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[7] = request(app)
    .get("/vaccine?date=2021-03-06T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 1037,
            Antiqua: 1030,
            SolarBuddhica: 1062,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 5185,
            Antiqua: 4120,
            SolarBuddhica: 6372,
        },
        arrivedOrders: 3129,
        arrivedVaccines: 15677,
        usedVaccines: 3284,
        expiredBottles: 1612,
        vaccinesExpiredBeforeUsage: 5899,
        validVaccinesLeft: 6494,
        vaccinesExpiringInNext10days: 1778,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[8] = request(app)
    .get("/vaccine?date=2021-03-27T10%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 1409,
            Antiqua: 1391,
            SolarBuddhica: 1414,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 7045,
            Antiqua: 5564,
            SolarBuddhica: 8484,
        },
        arrivedOrders: 4214,
        arrivedVaccines: 21093,
        usedVaccines: 4848,
        expiredBottles: 2692,
        vaccinesExpiredBeforeUsage: 9714,
        validVaccinesLeft: 6531,
        vaccinesExpiringInNext10days: 1769,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

promises[9] = request(app)
    .get("/vaccine?date=2021-04-12T20%3A00%3A00.000Z")
    .expect(200, {
        arrivedOrdersPerProducer: {
            Zerpfy: 1663,
            Antiqua: 1661,
            SolarBuddhica: 1676,
        },
        arrivedVaccinesPerProducer: {
            Zerpfy: 8315,
            Antiqua: 6644,
            SolarBuddhica: 10056,
        },
        arrivedOrders: 5000,
        arrivedVaccines: 25015,
        usedVaccines: 7000,
        expiredBottles: 3503,
        vaccinesExpiredBeforeUsage: 12660,
        validVaccinesLeft: 5355,
        vaccinesExpiringInNext10days: 1960,
    })
    .then(() => "Test passed!")
    .catch((err) => err);

Promise.all(promises)
    .then(values => {
        console.log(values);
        if (values.some(value => value !== "Test passed!")) {
            console.log("All tests were NOT passed!");
        } else {
            console.log("All tests passed!");
        }
    })
    .then(() => process.exit(0));
