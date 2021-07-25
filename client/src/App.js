import './App.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fi from 'date-fns/locale/fi';
import { ResultTable } from "./ResultTable.js";

async function handleDateChange(date, setJsonData, setStartDate) {

  console.log(date.toISOString());
  setStartDate(date);

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

  return (
    <div id="main_container">
      <MainComponent />
      <MainComponent />
      <MainComponent />
      <MainComponent />
    </div>

  );
}

function MainComponent() {

  const [startDate, setStartDate] = useState(new Date('2021-01-02'));
  const [jsonData, setJsonData] = useState("{}");

  return (
    <div className="main_component">
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date, setJsonData, setStartDate)}
        locale="fi"
        showTimeSelect
        timeFormat="p"
        timeIntervals={10}
        dateFormat="Pp"
        minDate={new Date('2021-01-01')}
        maxDate={new Date('2021-04-15')}
      />
      <ResultTable results={JSON.parse(jsonData)} />
    </div>
  )
}

export default App;
