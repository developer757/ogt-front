import React, { useContext, useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { getLogs } from "../../utilities/api";
import { InputTextarea } from "primereact/inputtextarea";
import { TitleContext } from "../../context/TitleContext";
import { Card } from "primereact/card";

function Logs() {
  const [date, setDate] = useState(null);
  const [logs, setLogs] = useState("");
  const hasRendered = useRef(false);
  const { setTitleModel } = useContext(TitleContext);

  useEffect(() => {
    initStartDate();
    setTitleModel("Логи брокеров");
    console.log("logs", logs)
  }, []);

  useEffect(() => {
    if (hasRendered.current) {
      var dateObject = new Date(date);

      var year = dateObject.getFullYear();
      var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
      var day = ("0" + dateObject.getDate()).slice(-2);
      let formattedDate = year + "-" + month + "-" + day;
      
      getLogs(formattedDate)
        .then((response) => {
          console.log(response)
          const formattedLogs = response.data.message
            ? response.data.message
            : response.data.data.map((log) => log.response_text).join("\n\n");
          

          setLogs(formattedLogs);
        })
        .catch((error) => {
          
        });
    } else {
      hasRendered.current = true;
    }
  }, [date]);

  const initStartDate = () => {
    const currentDate = new Date();
    const startToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    setDate(startToday);
  };

  return (
    <div className="" style={{ maxWidth: "90%", margin: "0 auto" }}>
      {/* <Toast ref={toast} /> */}

      <div>
        <h2 className="mb-5">Логи брокеров</h2>

        <Calendar
          value={date}
          locale="ru"
          onChange={(e) => {
            setDate(e.value);
          }}
          readOnlyInput
          className="mb-3"
        />
      </div>
      <Card>
        <InputTextarea className="w-full" rows={35} cols={150} value={logs} />
      </Card>
    </div>
  );
}

export default Logs;
