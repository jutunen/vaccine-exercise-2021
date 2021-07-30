import './App.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi';
import { ResultTable } from "./ResultTable.js";
import delButtonPng from './delete-button.png';

const initDate = '2021-01-02T10:00:00Z';

async function getVaccineDataByDate(date, setJsonData, setStartDate) {

  console.log(date.toISOString());

  if (setStartDate) {
    setStartDate(date);
  }

  const encodedDate = encodeURIComponent(date.toISOString());
  //const encodedDate = encodeURIComponent('perseensuti');

  //setRequestIsPending(true);
  try {
    const result = await axios.get(`http://localhost:5555/test?date=${encodedDate}`,
      {
        timeout: 10000
      });
    console.log(result.data);
    setJsonData(JSON.stringify(result.data));
  } catch (err) {
    console.error(err);
    //alert("Data fetching failed.\nPlease try again later.");
    //setRequestIsPending(false);
  }
  //setRequestIsPending(false);

}

function App() {

  useEffect(() => {
    registerLocale('fi', fi);
  }, []);

  useEffect(() => {
    getVaccineDataByDate(new Date(initDate), setJsonData);
  }, []);

  const [idArray, setIdArray] = useState([0]);
  const [jsonData, setJsonData] = useState("{}");

  const removeHandler = (idToBeRemoved) => {
    if (idArray.length > 1) {
      setIdArray(idArray.filter(id => id !== idToBeRemoved));
    }
  }

  const getFreeId = () => {
    //console.log("idArray.length: ", idArray.length);
    for (let id = 0; id < idArray.length + 1; id++) {
      //console.log("id: ", id)
      if (!idArray.includes(id)) {
        return id;
      }
    }
    console.error("getFreeId");
    return -1;
  }

  //console.log(JSON.stringify(idArray));

  return (
    <div id="main_container">
      <div id="controls_container">
        <button type="button" onClick={() => setIdArray([...idArray, getFreeId()])}>
          Add table
        </button>
      </div>
      <div id="components_container">
        {idArray.map(id => <InfoComponent removable={idArray.length > 1} id={id} key={id} removeHandler={removeHandler} initData={jsonData} />)}
      </div>
    </div>

  );
}

function InfoComponent({ id, removeHandler, initData, removable }) {

  const [startDate, setStartDate] = useState(new Date(initDate));
  const [jsonData, setJsonData] = useState(null);

  //console.log("initData: ", initData);

  return (
    <div className="info_component">
      <div className="info_controls">
        <div className="info_sub_controls">
          {removable &&
            <input type='image' src={delButtonPng} alt='Remove' height='25' width='25' onClick={() => removeHandler(id)} onMouseEnter={() => { }} onMouseLeave={() => { }} />
          }
        </div>
        Select date and time:
        <DatePicker
          selected={startDate}
          onChange={(date) => getVaccineDataByDate(date, setJsonData, setStartDate)}
          showTimeSelect
          timeIntervals={30}
          dateFormat="dd.MM.yyyy HH:mm"
          minDate={new Date('2021-01-02')}
          maxDate={new Date('2021-04-12')}
          className="date_picker"
          locale={fi}
          calendarStartDay={1}
        >
          <div style={{ marginLeft: "5px", fontSize: "12px" }}>Calendar times are Finnish time.</div>
        </DatePicker>
      </div>
      <ResultTable results={!jsonData ? JSON.parse(initData) : JSON.parse(jsonData)} />
    </div>
  )
}

export default App;
