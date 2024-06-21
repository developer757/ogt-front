import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { Calendar } from "primereact/calendar";

import {
  getFunnels,
  getOffers,
  getUsers,
  postFunnelsStats,
  postLeadsGeoStats,
  postLeadsStats,
  postOffersStats,
} from "../../utilities/api";
import { TitleContext } from "../../context/TitleContext";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

function Statistics() {
  const postDatesInitialState = {
    stat_start: "",
    stat_end: "",
  };
  const datesInitialState = [new Date(), new Date()];

  const [leadsStats, setLeadsStats] = useState([]);
  const [offersStats, setOffersStats] = useState([]);
  const [funnelsStats, setFunnelsStats] = useState([]);
  const [leadsGeoStats, setLeadsGeoStats] = useState([]);
  const [dates, setDates] = useState(datesInitialState);
  const [postDates, setPostDates] = useState(postDatesInitialState);
  const [expandedRows, setExpandedRows] = useState(null);
  const { setTitleModel } = useContext(TitleContext);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingFunnels, setLoadingFunnels] = useState(true);
  const [loadingLeadsGeo, setLoadingLeadsGeo] = useState(true);

  // useEffect'ы для рендера, вывода логов

  useEffect(() => {
    console.log(leadsStats);
  }, [leadsStats]);

  useEffect(() => {
    formatDatesState(dates);
    setLoadingLeads(true);
    setLoadingOffers(true);
    setLoadingFunnels(true);
    setLoadingLeadsGeo(true)
  }, [dates]);

  useEffect(() => {
    if (postDates !== postDatesInitialState) {
      getLeadsStatsData();
      getOffersStatsData();
      getFunnelsStatsData();
      getLeadsGeoStatsData()
    }
    setTitleModel("Аналитика");
  }, [postDates]);

  const getLeadsStatsData = () => {
    postLeadsStats(postDates).then((response) => {
      setLeadsStats(response.data.data);
      setLoadingLeads(false);
    });
  };

  const getOffersStatsData = () => {
    postOffersStats(postDates).then((response) => {
      setOffersStats(response.data.data);
      setLoadingOffers(false);
    });
  };

  const getFunnelsStatsData = () => {
    postFunnelsStats(postDates).then((response) => {
      setFunnelsStats(response.data.data);
      setLoadingFunnels(false);
    });
  };

  const getLeadsGeoStatsData = () => {
    postLeadsGeoStats(postDates).then((response) => {
      setLeadsGeoStats(response.data.data);
      setLoadingLeadsGeo(false);
    });
  };

  const handleDateButtonClick = (option) => {
    setLoadingLeads(true);
    setLoadingOffers(true);
    setLoadingFunnels(true);
    setLoadingLeadsGeo(true)
    switch (option) {
      case "today":
        setDates(datesInitialState);
        break;
      case "current week":
        setDates([getLatestMondayDate(), getCurrentDate()]);
        break;
      case "last week":
        setDates([getBeginningOfLastWeekDate(), getEndOfLastWeekDate()]);
        break;
      case "current month":
        setDates([getBegginingOfCurrentMonthDate(), getCurrentDate()]);
        break;
      case "last month":
        setDates([getBeginningOfLastMonthDate(), getEndOfLastMonthDate()]);
        break;
    }
  };

  // Вспомогательные функции
  const formatDatesState = (array) => {
    const formattedPostDates = array.map((date) => {
      if (date instanceof Date && !isNaN(date)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } else {
        return "";
      }
    });

    if (formattedPostDates[0] !== "" && formattedPostDates[1] !== "")
      setPostDates({
        stat_start: formattedPostDates[0],
        stat_end: formattedPostDates[1],
      });
  };

  const getBeginningOfLastWeekDate = () => {
    const today = new Date();
    const lastMonday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() - 6
    );
    return lastMonday;
  };

  const getEndOfLastWeekDate = () => {
    const today = new Date();
    const lastMonday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() - 6
    );
    const endOfLastWeek = new Date(lastMonday);
    endOfLastWeek.setDate(lastMonday.getDate() + 6);
    if (endOfLastWeek.getDay() === 1) {
      endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
    }
    return endOfLastWeek;
  };

  const getLatestMondayDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToAdd = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const latestMonday = new Date(today);
    latestMonday.setDate(today.getDate() - daysToAdd);

    return latestMonday;
  };

  const getBegginingOfCurrentMonthDate = () => {
    const today = new Date();
    const beginningOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return beginningOfMonth;
  };

  const getBeginningOfLastMonthDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  };

  const getEndOfLastMonthDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 0);
  };

  const getCurrentDate = () => {
    return new Date();
  };

  const allowExpansion = (rowData) => {
    return rowData.name.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
        <>
          <h4 className="my-3">Статистика по {data.name}</h4>
          <DataTable
              value={data.geo_stats}
              className="statistics-inner"
              emptyMessage="Нет данных"
          >
            <Column field="geo" header="Гео"></Column>
            <Column field="total_leads_count" header="Тотал"></Column>
            <Column field="valid_leads_count" header="Валид"></Column>
            <Column field="invalid_leads_count" header="Невалид"></Column>
            <Column field="invalid_leads_percentage" header="% невалида"></Column>
            <Column field="deposited_count" header="Депозиты"></Column>
            <Column field="conversion_rate" header="Процент конверсии"></Column>
          </DataTable>
        </>
    );
  };

  return (
      <div className="flex flex-column align-items-center justify-content-center">
        <div
            className="flex justify-content-between my-0"
            style={{ width: "90%" }}
        >
          <h2 className="m-0">Аналитика</h2>
        </div>

        <div
            className="flex justify-content-between my-2"
            style={{ width: "90%" }}
        >
          <Card className="flex statistics-card">
            <Button
                onClick={() => {
                  handleDateButtonClick("today");
                }}
                label="Сегодня"
            ></Button>
            <Button
                onClick={() => {
                  handleDateButtonClick("current week");
                }}
                label="Текущая неделя"
            ></Button>
            <Button
                onClick={() => {
                  handleDateButtonClick("last week");
                }}
                label="Прошлая неделя"
            ></Button>
            <Button
                onClick={() => {
                  handleDateButtonClick("current month");
                }}
                label="Текущий месяц"
            ></Button>
            <Button
                onClick={() => {
                  handleDateButtonClick("last month");
                }}
                label="Прошлый месяц"
            ></Button>
          </Card>
          <Card>
            <Calendar
                className="w-20rem"
                dateFormat="dd-mm-yy"
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode="range"
                locale="ru"
            />
          </Card>
        </div>
        <Card className="my-2" style={{ width: "90%" }}>
          <DataTable
              value={loadingLeads ? leadsSkeletonData : leadsStats}
              rows={10}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              className="mb-5 w-full"
              style={{ maxWidth: "90%" }}
              emptyMessage="Нет данных"
          >
            <Column style={{ width: "5rem" }} expander={allowExpansion} />
            <Column field="name" header="Юзер"></Column>
            <Column field="total_leads_count" header="Тотал"></Column>
            <Column field="valid_leads_count" header="Валид"></Column>
            <Column field="invalid_leads_count" header="Невалид"></Column>
            <Column field="holds_leads" header="No send"></Column>
            <Column field="invalid_leads_percentage" header="% невалида"></Column>
            <Column field="deposited_count" header="Депозиты"></Column>
            <Column field="conversion_rate" header="Процент конверсии"></Column>
            <Column field="total_spend" header="Затраты"></Column>
            <Column field="cpl" header="CPL"></Column>
          </DataTable>
        </Card>

        <Card className="my-2" style={{ width: "90%" }}>
          <DataTable
              value={loadingOffers ? offersSkeletonData : offersStats}
              rows={10}
              className="mb-5 w-full"
              style={{ maxWidth: "90%" }}
              emptyMessage="Нет данных"
          >
            <Column field="offer" header="Оффер"></Column>
            <Column field="total_leads_count" header="Тотал"></Column>
            <Column field="valid_leads_count" header="Валид"></Column>
            <Column field="deposited_count" header="Депозиты"></Column>
            <Column field="conversion_rate" header="Процент конверсии"></Column>
          </DataTable>
        </Card>

        <Card className="my-2" style={{ width: "90%" }}>
          <DataTable
              value={loadingFunnels ? funnelsSkeletonData : funnelsStats}
              rows={10}
              className="mb-5 w-full"
              style={{ maxWidth: "90%" }}
              emptyMessage="Нет данных"
          >
            <Column field="funnel" header="Воронка"></Column>
            <Column field="total_leads_count" header="Тотал"></Column>
            <Column field="valid_leads_count" header="Валид"></Column>
            <Column field="holds_leads" header="No send"></Column>
            <Column field="deposited_count" header="Депозиты"></Column>
            <Column field="conversion_rate" header="Процент конверсии"></Column>
          </DataTable>
        </Card>

        <Card className="my-2" style={{ width: "90%" }}>
          <DataTable
              value={loadingLeadsGeo ? leadsGeoSkeletonData : leadsGeoStats}
              rows={10}
              className="mb-5 w-full"
              style={{ maxWidth: "90%" }}
              emptyMessage="Нет данных"
          >
            <Column field="geo" header="Гео"></Column>
            <Column field="total_leads_count" header="Тотал"></Column>
            <Column field="valid_leads_count" header="Валид"></Column>
            <Column field="invalid_leads_count" header="Невалид"></Column>
            <Column field="deposited_count" header="Депозиты"></Column>
            <Column field="conversion_rate" header="Процент конверсии"></Column>
          </DataTable>
        </Card>
      </div>
  );
}

export default Statistics;

const leadsSkeletonData = [
  {
    name: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    invalid_leads_percentage: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
    total_spend: <Skeleton />,
    cpl: <Skeleton />,
  },
  {
    name: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    invalid_leads_percentage: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
    total_spend: <Skeleton />,
    cpl: <Skeleton />,
  },
  {
    name: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    invalid_leads_percentage: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
    total_spend: <Skeleton />,
    cpl: <Skeleton />,
  },
  {
    name: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    invalid_leads_percentage: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
    total_spend: <Skeleton />,
    cpl: <Skeleton />,
  },
  {
    name: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    invalid_leads_percentage: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
    total_spend: <Skeleton />,
    cpl: <Skeleton />,
  },
];

const offersSkeletonData = [
  {
    offer: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    offer: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    offer: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    offer: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    offer: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
];

const funnelsSkeletonData = [
  {
    funnel: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    funnel: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    funnel: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
  {
    funnel: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
  {
    funnel: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    holds_leads: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
];

const leadsGeoSkeletonData = [
  {
    geo: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    geo: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },

  {
    geo: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
  {
    geo: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
  {
    geo: <Skeleton />,
    total_leads_count: <Skeleton />,
    valid_leads_count: <Skeleton />,
    invalid_leads_count: <Skeleton />,
    deposited_count: <Skeleton />,
    conversion_rate: <Skeleton />,
  },
];

