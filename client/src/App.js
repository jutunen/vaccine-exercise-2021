import "./App.css";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import fi from "date-fns/locale/fi";
import { InfoComponent, ProgressIndicator } from "./Components.js";
import cloneDeep from "lodash.clonedeep";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const initDateConst = "2021-01-02T10:00:00Z";

function App() {
    useEffect(() => {
        registerLocale("fi", fi);
    }, []);

    useEffect(() => {
        async function getInitData() {
            let initData = await getVaccineDataByDate(new Date(initDateConst));
            //console.log("initData: ", initData);
            setDataArray([{ id: 0, data: initData, dateStr: initDateConst }]);
        }
        getInitData();
    }, []);

    const [dataArray, setDataArray] = useState([]);
    const [requestIsPending, setRequestIsPending] = useState(false);

    const getVaccineDataByDate = async (date, setVaxData, setStartDate) => {
        //console.log(date.toISOString());
        if (setStartDate) {
            setStartDate(date);
        }

        const encodedDate = encodeURIComponent(date.toISOString());
        setRequestIsPending(true);

        try {
            const result = await axios.get(
                `http://localhost:5555/test?date=${encodedDate}`,
                {
                    timeout: 10000,
                }
            );

            setRequestIsPending(false);

            if (setVaxData) {
                setVaxData(result.data);
            } else {
                return result.data;
            }
        } catch (err) {
            console.error(err);
            alert("Data fetching failed.\nPlease try again later.");
            setRequestIsPending(false);
        }
    };

    const removeItem = idToBeRemoved => {
        if (dataArray.length > 1) {
            setDataArray(dataArray.filter(item => item.id !== idToBeRemoved));
        }
    };

    const duplicateItem = (date, data, index) => {
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
    };

    const getFreeId = () => {
        let idArray = dataArray.map(item => item.id);
        for (let id = 0; id < idArray.length + 1; id++) {
            if (!idArray.includes(id)) {
                return id;
            }
        }
        console.error("getFreeId");
        return -1;
    };

    //console.log(JSON.stringify(dataArray));
    let index = 0;

    return (
        <div id="main_container">
            <div id="heading">
                <div>
                    List of interesting things aka Solita vaccine exercise 2021 by  <a href="https://github.com/jutunen">jutunen</a>.<br/>
                    Click <span style={{ fontStyle: "italic" }}>duplicate</span>{" "}
                    button to compare two or more dates!
                </div>
            </div>
            <div id="components_container">
                <TransitionGroup component={null}>
                    {dataArray.map(item => {
                        return (
                            <CSSTransition
                                classNames="event-transition"
                                timeout={200}
                                key={item.id}
                            >
                                <InfoComponent
                                    duplicatingHandler={duplicateItem}
                                    count={dataArray.length}
                                    removable={dataArray.length > 1}
                                    id={item.id}
                                    removeHandler={removeItem}
                                    initData={item.data}
                                    initDateStr={item.dateStr}
                                    index={index++}
                                    getFunction={getVaccineDataByDate}
                                />
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>
            <ProgressIndicator visible={requestIsPending} />
        </div>
    );
}

export default App;
