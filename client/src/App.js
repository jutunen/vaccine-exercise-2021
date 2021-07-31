import './App.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi';
import { ResultTable } from "./ResultTable.js";
import delButtonPng from './delete-button.png';
import cloneDeep from 'lodash.clonedeep';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const initDateConst = '2021-01-02T10:00:00Z';
const minDateConst = 1609545600000; // '2021-01-02T00:00:00.000Z'
const maxDateConst = 1618185600000; // '2021-04-12T00:00:00.000Z'

function App() {

  useEffect(() => {
    registerLocale('fi', fi);
  }, []);

  useEffect(() => {
    async function getInitData() {
      let initData = await getVaccineDataByDate(new Date(initDateConst));
      //console.log("initData: ", initData);
      setDataArray([{ id: 0, data: initData, dateStr: initDateConst }])
    }
    getInitData();
  }, []);

  const [dataArray, setDataArray] = useState([]);

  const removeHandler = (idToBeRemoved) => {

    let test = dataArray.filter(item => item.id !== idToBeRemoved);
    console.log(test);

    if (dataArray.length > 1) {
      setDataArray(dataArray.filter(item => item.id !== idToBeRemoved));
    }
  }

  const duplicatingHandler = (date, data, index) => {
    console.log("duplicatingHandler:");
    console.log(date);
    console.log(data);
    console.log(index);

    let arrayClone = [];

    for (let i = 0, shift = 0; i < dataArray.length; i++) {
      if (i === index) {
        arrayClone[i] = cloneDeep(dataArray[i]);
        arrayClone.push({ id: getFreeId(), data, dateStr: date });
        shift = 1;
      } else {
        arrayClone[i + shift] = cloneDeep(dataArray[i]);
      }
    }

    setDataArray(arrayClone);
  }

  const getFreeId = () => {
    //console.log("dataArray.length: ", dataArray.length);
    let idArray = dataArray.map(item => item.id);
    for (let id = 0; id < idArray.length + 1; id++) {
      //console.log("id: ", id)
      if (!idArray.includes(id)) {
        return id;
      }
    }
    console.error("getFreeId");
    return -1;
  }

  //console.log(JSON.stringify(dataArray));
  let index = 0;

  return (
    <div id="main_container">
      <div id="controls_container">
      </div>
      <div id="components_container">
        <TransitionGroup component={null}>
          {dataArray.map(item => {
            return (
              <CSSTransition classNames="event-transition" timeout={200} key={item.id}>
                <InfoComponent duplicatingHandler={duplicatingHandler} count={dataArray.length} removable={dataArray.length > 1} id={item.id} removeHandler={removeHandler} initData={item.data} initDateStr={item.dateStr} index={index++} />
              </CSSTransition>
            )
          }
          )}
        </TransitionGroup>
      </div>
    </div>

  );
}

function TimeController({ label, shift, changeHandler }) {
  return (
    <div className="time_controller">
      <button type="button" className="time_adjust_button" onClick={() => changeHandler(shift * (-1))}>
        -
      </button>
      <div className="time_label">
        {label}
      </div>
      <button type="button" className="time_adjust_button" onClick={() => changeHandler(shift)}>
        +
      </button>
    </div>
  )
}

function InfoComponent({ id, removeHandler, initData, removable, duplicatingHandler, initDateStr, index, count }) {

  //console.log("id: ", id);
  //console.log("initData: ", initData);
  //console.log("initDate: ", initDate);

  const [startDate, setStartDate] = useState(new Date(initDateStr));
  const [vaxData, setVaxData] = useState(null);

  const updateTime = (timeChangeInMs) => {
    let newTime = startDate.getTime() + timeChangeInMs;
    if (newTime < minDateConst || newTime > maxDateConst) {
      return;
    }
    getVaccineDataByDate(new Date(newTime), setVaxData, setStartDate);
  }

  //console.log("initData: ", initData);

  return (
    <div className="info_component">
      <div className="info_controls">
        <div className="info_sub_controls">
          <div className="info_sub_sub_controls">
            <button style={{ visibility: count < 5 ? 'visible' : 'hidden' }} type="button" onClick={() => duplicatingHandler(startDate.toISOString(), !vaxData ? initData : vaxData, index)}>
              Duplicate this
            </button>
            <input style={{ visibility: removable ? 'visible' : 'hidden' }} type='image' src={delButtonPng} alt='Remove' height='25' width='25' onClick={() => removeHandler(id)} onMouseEnter={() => { }} onMouseLeave={() => { }} />
          </div>
          Adjust date and time:
          <TimeController label="week" shift={7 * 24 * 3.6e6} changeHandler={updateTime} />
          <TimeController label="day" shift={24 * 3.6e6} changeHandler={updateTime} />
          <TimeController label="hour" shift={3.6e6} changeHandler={updateTime} />
        </div>
        Select date and time:
        <DatePicker
          selected={startDate}
          onChange={(date) => getVaccineDataByDate(date, setVaxData, setStartDate)}
          showTimeSelect
          timeIntervals={30}
          dateFormat="dd.MM.yyyy HH:mm"
          minDate={new Date(minDateConst)}
          maxDate={new Date(maxDateConst)}
          className="date_picker"
          locale={fi}
          calendarStartDay={1}
        >
          <div style={{ marginLeft: "5px", fontSize: "12px" }}>Calendar times are Finnish time.</div>
        </DatePicker>
      </div>
      <ResultTable results={!vaxData ? initData : vaxData} />
    </div>
  )
}

async function getVaccineDataByDate(date, setVaxData, setStartDate) {

  console.log(date.toISOString());

  if (setStartDate) {
    setStartDate(date);
  }

  const encodedDate = encodeURIComponent(date.toISOString());

  //setRequestIsPending(true);
  try {
    const result = await axios.get(`http://localhost:5555/test?date=${encodedDate}`,
      {
        timeout: 10000
      });

    console.log(result);

    if (setVaxData) {
      setVaxData(result.data);
    } else {
      return result.data;
    }

  } catch (err) {
    console.error(err);
    //alert("Data fetching failed.\nPlease try again later.");
    //setRequestIsPending(false);
  }
  //setRequestIsPending(false);
}


export default App;
