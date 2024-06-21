import { useState, useEffect, useRef, useReducer, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  // getOffers,
  getCountries,
  getFunnels,
  deleteOffer,
  addOffer,
  editOffer,
  editActivity,
  getSources,
  getOffersPaginationData,
  editCapControl,
  getOffers,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";
import { Chip } from "primereact/chip";
import { InputSwitch } from "primereact/inputswitch";
import FiltersStyled from "../../components/FiltersComponent";
import { TitleContext } from "../../context/TitleContext";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import { Accordion, AccordionTab } from "primereact/accordion";

function Offers() {
  // Стейты
  const [offers, setOffers] = useState([]);
  const [funnelsOptions, setFunnelsOptions] = useState([]);
  const [geosOptions, setGeosOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [offersOptions, setOffersOptions] = useState([]);

  const [activityChecked, setActivityChecked] = useState([]);
  const [capControlChecked, setCapControlChecked] = useState([]);
  const [selectedOfferID, setSelectedOfferID] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    cap: "",
    funnels: [],
    geo: [],
    offer_start: "00:00",
    offer_end: "00:00",
    source: [],
  });

  const { setTitleModel } = useContext(TitleContext);

  const toast = useRef(null);

  // Функция на рендер тоста
  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  // useEffect'ы для рендера, вывода логов

  useEffect(() => {
    getOffers().then((response) => {
      const updatedOffers = response.data.data.map(({ name }) => name);
      setOffersOptions(updatedOffers);
    });

    getFunnels().then((response) => {
      const updatedFunnels = response.data.data.map(({ name }) => name);
      setFunnelsOptions(updatedFunnels);
    });
    getCountries().then((response) => {
      const updatedGeos = response.data.data.map(({ iso }) => iso);
      setGeosOptions(updatedGeos);
    });
    getSources().then((response) => {
      const updatedSources = response.data.data.map(({ name }) => name);
      setSourceOptions(updatedSources);
    });

    setTitleModel("Оффера");
  }, []);

  // Инпуты для DialogComponent
  const addDialogInputs = [
    {
      label: "Оффер",
      key: "name",
      type: "text",
      placeholder: "Введите название оффера",
    },
    {
      label: "Капа",
      key: "cap",
      type: "text",
      placeholder: "Введите капу",
    },
    {
      label: "Воронки",
      key: "funnels",
      type: "multiselect",
      placeholder: "Выберите воронки",
      options: funnelsOptions,
    },
    {
      label: "Гео",
      key: "geo",
      type: "multiselect",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Начало капы",
      key: "offer_start",
      type: "calendar",
      placeholder: "Выберите начало капы",
    },
    {
      label: "Конец капы",
      key: "offer_end",
      type: "calendar",
      placeholder: "Выберите конец капы",
    },
    {
      label: "Источники",
      key: "source",
      type: "multiselect",
      placeholder: "Выберите источники",
      options: sourceOptions,
    },
  ];

  const editDialogInputs = [
    {
      label: "Оффер",
      key: "name",
      type: "text",
      placeholder: "Введите название оффера",
    },
    {
      label: "Капа",
      key: "cap",
      type: "text",
      placeholder: "Введите капу",
    },
    {
      label: "Воронки",
      key: "funnels",
      type: "multiselect",
      placeholder: "Выберите воронки",
      options: funnelsOptions,
    },
    {
      label: "Гео",
      key: "geo",
      type: "multiselect",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Начало капы",
      key: "offer_start",
      type: "calendar",
      placeholder: "Выберите начало капы",
    },
    {
      label: "Конец капы",
      key: "offer_end",
      type: "calendar",
      placeholder: "Выберите конец капы",
    },
    {
      label: "Источники",
      key: "source",
      type: "multiselect",
      placeholder: "Выберите источники",
      options: sourceOptions,
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Оффер",
      key: "name",
      type: "multiselect",
      placeholder: "Введите название оффера",
      options: offersOptions,
    },
    {
      label: "Воронки",
      key: "funnels",
      type: "multiselect",
      placeholder: "Выберите воронки",
      options: funnelsOptions,
    },
    {
      label: "Гео",
      key: "geo",
      type: "multiselect",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Источники",
      key: "source",
      type: "multiselect",
      placeholder: "Выберите источники",
      options: sourceOptions,
    },
  ];

  // Функции подтягиваний данных с бека
  const renderOffers = async (obj) => {
    getOffersPaginationData(obj).then(function (response) {
      const offerActiveArray = [];
      const offerCapControlArray = [];

      response.data.data.forEach((obj) => {
        offerActiveArray.push({
          id: obj.id,
          active: obj.active === 1,
        });
        offerCapControlArray.push({
          id: obj.id,
          cap_control: obj.cap_control === 1,
        });
      });

      const updatedOffers = response.data.data.map((obj) => {
        if (obj.hasOwnProperty("offer_start")) {
          obj.offer_start = obj.offer_start.slice(0, -3);
        }
        if (obj.hasOwnProperty("offer_end")) {
          obj.offer_end = obj.offer_end.slice(0, -3);
        }

        return obj;
      });
      setTotalRecords(response.data.total);
      setOffers(updatedOffers);
      setActivityChecked(offerActiveArray);
      setCapControlChecked(offerCapControlArray);
      setLoading(false);
    });
  };

  // Обработчики для actionButtonsTemplate
  const handleEditActionClick = (rowData) => {
    setDialogInputObject({
      name: rowData.name,
      cap: rowData.cap,
      funnels: JSON.parse(rowData.funnels),
      geo: JSON.parse(rowData.geo),
      offer_start: rowData.offer_start,
      offer_end: rowData.offer_end,
      source: JSON.parse(rowData.source),
    });

    setIsEditDialogVisible(true);
    setSelectedOfferID(rowData.id);
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedOfferID(rowData.id);
  };

  // Функция для управления плажкой на удаление данных из DataTable
  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteOffer(selectedOfferID)
      : showToast("info", "Удаление оффера отменено"),
      hide();
    setSelectedOfferID(null);
  };

  // // Сеттер фильтра глобального поиска
  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };
  //   _filters["global"].value = value;

  //   setFilters(_filters);
  //   setGlobalFilterValue(value);
  // };

  // Обработчики взаимодействия фронта с беком
  const handleAddOffer = ({
    name,
    cap,
    funnels,
    geo,
    offer_start,
    offer_end,
    source,
  }) => {
    if (
      (name !== "" &&
        cap !== "" &&
        funnels !== "" &&
        geo !== "" &&
        offer_start !== "" &&
        offer_end !== "",
      source !== "")
    ) {
      addOffer(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showToast("success", response.data.message);
          renderOffers();
        })
        .catch(function (error) {
          showToast("error", "Ошибка создания оффера");
        });
    } else {
      showToast("info", "Заполните все поля");
    }
  };

  const handleEditOffer = ({
    name,
    cap,
    funnels,
    geo,
    offer_start,
    offer_end,
    source,
  }) => {
    if (
      (name !== "" &&
        cap !== "" &&
        funnels !== "" &&
        geo !== "" &&
        offer_start !== "" &&
        offer_end !== "",
      source !== "")
    ) {
      editOffer(dialogInputObject, selectedOfferID)
        .then(function (response) {
          showToast("success", response.data.data.message);
          setIsEditDialogVisible(false);
          renderOffers();
        })
        .catch(function (error) {
          showToast("error", response.data.message);
        });
    } else {
    }
  };

  const handleDeleteOffer = () => {
    deleteOffer(selectedOfferID)
      .then(function (response) {
        showToast("success", response.data.data.message);
        renderOffers();
      })
      .catch(function (error) {
        showToast("error", response.data.message);
      });
  };

  const handleEditActivity = (id, active) => {
    editActivity(id, active)
      .then((response) => {
        showToast("success", response.data.data.message);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          showToast("error", err.response.data.message);
          renderOffers();
        }
      });
  };

  const handleEditCapControl = (id, cap_control) => {
    editCapControl(id, cap_control)
      .then((response) => {
        showToast("success", response.data.data.message);
        renderOffers();
      })
      .catch((err) => {
        showToast("error", err.response.data.message);
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      cap: "",
      funnels: [],
      geo: [],
      offer_start: "00:00",
      offer_end: "00:00",
      source: [],
    });
  };

  // Рендер плажки на удаление данных из DataTable
  const showConfirmDeletePopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить оффер?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
    });
  };

  // Вспомогательные функции
  const formatCalendarTime = (timestamp, option) => {
    if (timestamp) {
      if (option === "to string") {
        const hours = timestamp.getHours().toString().padStart(2, "0");
        const minutes = timestamp.getMinutes().toString().padStart(2, "0");

        const formattedTime = `${hours}:${minutes}`;
        return formattedTime;
      } else if (option === "to Date") {
        let formattedTime = new Date();

        let [hours, minutes] = timestamp.split(":");

        formattedTime.setHours(parseInt(hours, 10));
        formattedTime.setMinutes(parseInt(minutes, 10));
        return formattedTime;
      }
    }
    return;
  };

  const handleToggleActivity = (id, value) => {
    const transformedActive = value ? 1 : 0;
    const updatedActivityChecked = activityChecked.map((item) =>
      item.id === id ? { ...item, active: value } : item
    );
    handleEditActivity(id, transformedActive);
    setActivityChecked(updatedActivityChecked);
  };

  const handleToggleCapControl = (id, value) => {
    const transformedCapControl = value ? 1 : 0;
    const updatedCapControlChecked = capControlChecked.map((item) =>
      item.id === id ? { ...item, cap_control: value } : item
    );
    handleEditCapControl(id, transformedCapControl);
    setCapControlChecked(updatedCapControlChecked);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
  };

  // Шаблоны для DataTable
  const actionButtonsTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          onClick={(e) => handleEditActionClick(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={(e) => handleDeleteActionClick(e, rowData)}
        />
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <Button icon="pi pi-filter" className="button-invisible" />

        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[20, 50, 100]}
          onPageChange={onPageChange}
        />

        <span className="p-input-icon-left">
          <Button icon="pi pi-filter" onClick={() => setSidebarVisible(true)} />
          <FiltersStyled
            visible={sidebarVisible}
            setVisible={setSidebarVisible}
            filtersArray={filtersArray}
            type="offers"
            setFilteredData={setOffers}
            renderData={renderOffers}
            first={first}
            rows={rows}
            page={page}
          />
        </span>
      </div>
    );
  };

  const popUpContentTemplate = ({
    message,
    acceptBtnRef,
    rejectBtnRef,
    hide,
  }) => {
    return (
      <div className="border-round p-3">
        <span>{message}</span>
        <div className="flex align-items-center gap-2 mt-3">
          <Button
            ref={rejectBtnRef}
            label="Отменить"
            outlined
            severity="success"
            onClick={() => {
              handleConfirmPopUpButtonClick("reject", hide);
            }}
            className="p-button-sm w-full"
          />
          <Button
            ref={acceptBtnRef}
            outlined
            label="Удалить"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("delete", hide);
            }}
            className="p-button-sm w-full"
          ></Button>
        </div>
      </div>
    );
  };

  const funnelsTemplate = (rowData) => {
    const funnelsArray = JSON.parse(rowData.funnels);

    return (
      <Accordion activeIndex={null}>
        <AccordionTab header="Список воронок">
          <div className="flex gap-2 flex-wrap">
            {funnelsArray.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </AccordionTab>
      </Accordion>
    );
  };

  const geoTemplate = (rowData) => {
    const geoArray = JSON.parse(rowData.geo);

    return (
      <Accordion activeIndex={null}>
        <AccordionTab header="Список гео">
          <div className="flex flex-wrap max-w-30rem gap-2">
            {geoArray.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </AccordionTab>
      </Accordion>
    );
  };

  const sourcesTemplate = (object) => {
    const sourcesArray = JSON.parse(object.source);

    return (
      <div className="flex flex-wrap max-w-30rem gap-2">
        {sourcesArray.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    );
  };

  const capTimeTemplate = (rowData) => {
    return (
      <div className="flex flex-column">
        {rowData.cap_control
          ? `${rowData["offer_start"]} - ${rowData["offer_end"]}`
          : "−−:−− − −−:−−"}
      </div>
    );
  };

  const capControlTemplate = (rowData) => {
    const item = capControlChecked.find((el) => el.id === rowData.id);
    return (
      <InputSwitch
        key={item.id}
        checked={item.cap_control}
        onChange={(e) => handleToggleCapControl(item.id, e.value)}
      />
    );
  };

  const activityTemplate = (rowData) => {
    const item = activityChecked.find((el) => el.id === rowData.id);
    return (
      <InputSwitch
        key={item.id}
        checked={item.active}
        onChange={(e) => handleToggleActivity(item.id, e.value)}
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <DialogComponent
        type="add offer"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header="Добавить оффер"
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddOffer}
        formatCalendarTime={formatCalendarTime}
        clearDialogInputObject={clearDialogInputObject}
      />

      <DialogComponent
        type="edit offer"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header="Редактировать оффер"
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditOffer}
        formatCalendarTime={formatCalendarTime}
        clearDialogInputObject={clearDialogInputObject}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Оффера</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          style={{ width: "90%" }}
          value={loading ? skeletonData : offers}
          header={headerTemplate}
          showGridlines
          emptyMessage="Нет данных"
        >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Оффер"></Column>
          <Column field="cap" header="Капа"></Column>
          <Column
            field="funnels"
            header="Воронки"
            style={{width: "100%"}}
            body={loading ? <Skeleton /> : funnelsTemplate}
          ></Column>
          <Column
            field="geo"
            header="Гео"
            style={{width: "100%"}}
            body={loading ? <Skeleton /> : geoTemplate}
          ></Column>
          <Column
            field="source"
            header="Источники"
            body={loading ? <Skeleton /> : sourcesTemplate}
          ></Column>
          <Column
            body={loading ? <Skeleton /> : capTimeTemplate}
            header="Время капы"
          ></Column>
          <Column
            field="cap_control"
            header="Управление капой"
            style={{width: "fit-content"}}
            body={loading ? <Skeleton /> : capControlTemplate}
          ></Column>
          <Column
            field="active"
            header="Активность"
            body={loading ? <Skeleton /> : activityTemplate}
          ></Column>
          <Column
            header="Действия"
            body={loading ? <Skeleton /> : actionButtonsTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Offers;

const skeletonData = [
  {
    id: <Skeleton />,
    name: <Skeleton />,
    cap: <Skeleton />,
    funnels: <Skeleton />,
    geo: <Skeleton />,
    source: <Skeleton />,
    active: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    cap: <Skeleton />,
    funnels: <Skeleton />,
    geo: <Skeleton />,
    source: <Skeleton />,
    active: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    cap: <Skeleton />,
    funnels: <Skeleton />,
    geo: <Skeleton />,
    source: <Skeleton />,
    active: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    cap: <Skeleton />,
    funnels: <Skeleton />,
    geo: <Skeleton />,
    source: <Skeleton />,
    active: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    cap: <Skeleton />,
    funnels: <Skeleton />,
    geo: <Skeleton />,
    source: <Skeleton />,
    active: <Skeleton />,
  },
];
