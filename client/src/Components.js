import DatePicker from "react-datepicker";
import "./Components.css";
import delButtonPng from "./delete-button.png";
import { Spinner } from "react-spinners-css";
import { useState } from "react";
import fi from "date-fns/locale/fi";
const minDateConst = 1609545600000; // '2021-01-02T00:00:00.000Z'
const maxDateConst = 1618257600000; // '2021-04-12T20:00:00.000Z'
const maxNumberOfComponents = 10;

function TimeController({ label, shift, changeHandler }) {
    return (
        <div className="time_controller">
            <button
                type="button"
                className="time_adjust_button"
                onClick={() => changeHandler(shift * -1)}
            >
                -
            </button>
            <div className="time_label">{label}</div>
            <button
                type="button"
                className="time_adjust_button"
                onClick={() => changeHandler(shift)}
            >
                +
            </button>
        </div>
    );
}

export function InfoComponent({
    id,
    removeHandler,
    initData,
    removable,
    duplicatingHandler,
    initDateStr,
    index,
    count,
    getFunction,
}) {
    const [startDate, setStartDate] = useState(new Date(initDateStr));
    const [vaxData, setVaxData] = useState(null);
    const [highLightColor, setHighLightColor] = useState(null);

    const updateTime = timeChangeInMs => {
        let newTime = startDate.getTime() + timeChangeInMs;
        if (newTime < minDateConst || newTime > maxDateConst) {
            return;
        }
        getFunction(new Date(newTime), setVaxData, setStartDate);
    };

    //console.log("initData: ", initData);

    return (
        <div
            className="info_component"
            style={{
                border: highLightColor
                    ? `2px solid ${highLightColor}`
                    : "2px solid transparent",
            }}
        >
            <div className="info_controls">
                <div className="info_sub_controls">
                    <div className="info_sub_sub_controls">
                        <button
                            className="top_inputs"
                            style={{
                                visibility:
                                    count < maxNumberOfComponents
                                        ? "visible"
                                        : "hidden",
                            }}
                            type="button"
                            onClick={() =>
                                duplicatingHandler(
                                    startDate.toISOString(),
                                    !vaxData ? initData : vaxData,
                                    index
                                )
                            }
                        >
                            Duplicate
                        </button>
                        <input
                            className="top_inputs"
                            style={{
                                visibility: removable ? "visible" : "hidden",
                            }}
                            type="image"
                            src={delButtonPng}
                            alt="Remove"
                            height="25"
                            width="25"
                            onClick={() => removeHandler(id)}
                            onMouseEnter={() => setHighLightColor("red")}
                            onMouseLeave={() => setHighLightColor(null)}
                            onFocus={() => setHighLightColor("red")}
                            onBlur={() => setHighLightColor(null)}
                        />
                    </div>
                    Adjust date and time:
                    <TimeController
                        label="week"
                        shift={7 * 24 * 3.6e6}
                        changeHandler={updateTime}
                    />
                    <TimeController
                        label="day"
                        shift={24 * 3.6e6}
                        changeHandler={updateTime}
                    />
                    <TimeController
                        label="hour"
                        shift={3.6e6}
                        changeHandler={updateTime}
                    />
                </div>
                <div className="calendar_section">
                    <div className="calendar_heading">
                        Selected date and time:
                    </div>
                    <DatePicker
                        selected={startDate}
                        onChange={date =>
                            getFunction(date, setVaxData, setStartDate)
                        }
                        showTimeSelect
                        timeIntervals={30}
                        dateFormat="dd.MM.yyyy HH:mm"
                        minDate={new Date(minDateConst)}
                        maxDate={new Date(maxDateConst)}
                        className="date_picker"
                        locale={fi}
                        calendarStartDay={1}
                    >
                        <div style={{ marginLeft: "5px", fontSize: "12px" }}>
                            Calendar times are Finnish time.
                        </div>
                    </DatePicker>
                    <span className="calendar_sub_heading">
                        ( click to adjust )
                    </span>
                </div>
            </div>
            <ResultTable results={!vaxData ? initData : vaxData} />
        </div>
    );
}

export function ProgressIndicator({ visible }) {
    if (!visible) {
        return null;
    }

    return (
        <div style={{ position: "absolute", top: "30%" }}>
            <Spinner color={"black"} />
        </div>
    );
}

function ResultTable({ results }) {
    if (Object.keys(results).length === 0) {
        return null;
    }

    return (
        <div className="result_table">
            <div className="result_item">
                <div className="result_title">Bottles arrived:</div>
                <div className="result_value">{results.arrivedOrders}</div>
            </div>

            <div className="result_item">
                <div className="result_title">Vaccines arrived:</div>
                <div className="result_value">{results.arrivedVaccines}</div>
            </div>

            <div className="result_item">
                <div className="result_title">Vaccines used:</div>
                <div className="result_value">{results.usedVaccines}</div>
            </div>

            <div className="result_item">
                <div className="result_title">Antiqua arrivals:</div>
                <div className="result_value">
                    {results.arrivedOrdersPerProducer.Antiqua} bottles <br />
                    {results.arrivedVaccinesPerProducer.Antiqua} vaccines
                </div>
            </div>

            <div className="result_item">
                <div className="result_title">SolarBuddhica arrivals:</div>
                <div className="result_value">
                    {results.arrivedOrdersPerProducer.SolarBuddhica} bottles{" "}
                    <br />
                    {results.arrivedVaccinesPerProducer.SolarBuddhica} vaccines
                </div>
            </div>

            <div className="result_item">
                <div className="result_title">Zerpfy arrivals:</div>
                <div className="result_value">
                    {results.arrivedOrdersPerProducer.Zerpfy} bottles <br />
                    {results.arrivedVaccinesPerProducer.Zerpfy} vaccines
                </div>
            </div>

            <div className="result_item">
                <div className="result_title">Bottles expired:</div>
                <div className="result_value">{results.expiredBottles}</div>
            </div>

            <div className="result_item">
                <div className="result_title">
                    Vaccines expired before usage:
                </div>
                <div className="result_value">
                    {results.vaccinesExpiredBeforeUsage}
                </div>
            </div>

            <div className="result_item">
                <div className="result_title">Vaccines left to be used:</div>
                <div className="result_value">{results.validVaccinesLeft}</div>
            </div>

            <div className="result_item">
                <div className="result_title">
                    Vaccines expiring in next 10 days:
                </div>
                <div className="result_value">
                    {results.vaccinesExpiringInNext10days}
                </div>
            </div>
        </div>
    );
}
