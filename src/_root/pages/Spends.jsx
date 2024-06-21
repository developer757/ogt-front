import { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addSpend,
  getSpends,
  getUsers,
  deleteSpend,
  editSpend,
  getCountries,
  getSpendsPaginationData,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";
import { Chip } from "primereact/chip";

import FiltersStyled from "../../components/FiltersComponent";
import { TitleContext } from "../../context/TitleContext";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";


function Spends() {
  // Стейты
  const [spends, setSpends] = useState(null);
  const [usersOptions, setUsersOptions] = useState([]);
  const [geosOptions, setGeosOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSpendID, setSelectedSpendID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [users, setUsers] = useState([]);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filtersObjectForRefresh, setFiltersObjectForRefresh] = useState({});


  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const dialogInputObjectInitialState = {
    name: "",
    summary: "",
    geo_spend: "",
    date: "",
    user_id: "",
  };
  const [dialogInputObject, setDialogInputObject] = useState(
    dialogInputObjectInitialState
  );
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
    getUsersArray();
    // renderSpends();
    getCountriesData();
    setTitleModel("Расходы");
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setDialogInputObject((prevState) => ({
        ...prevState,
        name: selectedUser,
        user_id: getSelectedUserID(selectedUser),
      }));
    }
  }, [selectedUser]);


  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Имя",
      key: "name",
      type: "multiselect",
      placeholder: "Введите имя",
      options: usersOptions,
    },
    {
      label: "Гео",
      key: "geo_spend",
      type: "multiselect",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Дата",
      key: "created_at",
      type: "calendar-creation",
      placeholder: "Выберите дату",
    },
  ];

  // Инпуты для DialogComponent
  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: usersOptions,
      setDropdownValue: setSelectedUser,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Гео",
      key: "geo_spend",
      type: "dropdown",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
    },
  ];

  const editDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: usersOptions,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Гео",
      key: "geo_spend",
      type: "dropdown",
      placeholder: "Выберите гео",
      options: geosOptions,
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
    },
  ];

  // Функции подтягиваний данных с бека
  const renderSpends = async (obj) => {
    getSpendsPaginationData(obj)
      .then((response) => {
        
        setSpends(response.data.data);
        setTotalRecords(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке доменов");
      });
  };

  const getUsersArray = () => {
    getUsers().then((response) => {
      setUsers(response.data.data);
      setUsersOptions(response.data.data.map(({ name }) => name));
    });
  };

  const getCountriesData = () => {
    getCountries().then((response) => {
      const updatedGeos = response.data.data.map(({ iso }) => iso);
      setGeosOptions(updatedGeos);
    });
  };

  // Обработчики для actionButtonsTemplate
  const handleEditActionClick = (rowData) => {
    
    setSelectedUser(rowData.name);
    setDialogInputObject({
      summary: rowData.summary,
      date: rowData.date,
      geo_spend: rowData.geo_spend,
    });
    setSelectedSpendID(rowData.id);
    setIsEditDialogVisible(true);
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedSpendID(rowData.id);
  };

  // Функция для управления плажкой на удаление данных из DataTable
  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteSpend(selectedSpendID)
      : showToast("info", "Удаление расхода отменено");
    hide();
    setSelectedSpendID(null);
  };

  // Сеттер фильтра глобального поиска
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Обработчики взаимодействия фронта с беком
  const handleAddSpend = ({ name, summary, date, user_id }) => {
    if (name !== "" && summary !== "" && (date !== "") & (user_id !== "")) {
      addSpend(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showToast("success", "Расход успешно добавлен");
          renderSpends();
          clearDialogInputObject();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка добавления расхода");
        });
    } else {
      
      showToast("info", "Заполните все поля");
    }
  };

  const handleEditSpend = ({ name, summary, date }) => {
    if (name !== "" && summary !== "" && date !== "") {
      editSpend(dialogInputObject, selectedSpendID)
        .then(function (response) {
          showToast("success", "Расход успешно редактирован");
          setIsEditDialogVisible(false);
          renderSpends();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка редактирования расхода");
        });
    } else {
      
      showToast("info", "Заполните все поля");
    }
  };

  const handleDeleteSpend = () => {
    
    deleteSpend(selectedSpendID)
      .then(function (response) {
        showToast("success", "Расход успешно удалён");
        renderSpends();
      })
      .catch(function (error) {
        
        showToast("error", "Ошибка удаления расхода");
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject(dialogInputObjectInitialState);
    setSelectedUser(null);
    setSelectedSpendID(null);
  };

  // Рендер плажки на удаление данных из DataTable
  const showConfirmDeletePopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить расход?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
    });
  };

  // Вспомогательные функции
  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const formatCalendarDate = (timestamp, option) => {
    if (option === "to string") {
      const originalDate = new Date(timestamp);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0");
      const day = String(originalDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else if (option === "to Date") {
      if (timestamp) {
        const [year, month, day] = timestamp.split("-");
        const formattedDate = new Date(year, month - 1, day);
        return formattedDate;
      }
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
  };

  const refreshData = () => {
    setLoading(true);
    renderSpends(filtersObjectForRefresh);
  };

  // Шаблоны для DataTable
  const headerTemplate = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <Button
          icon="pi pi-refresh"
          label=""
          loading={loading}
          onClick={refreshData}
        ></Button>

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
            renderData={renderSpends}
            setFiltersObjectForRefresh={setFiltersObjectForRefresh}
            formatCalendarDate={formatCalendarDate}
            setFilteredData={setSpends}
            type="spends"
            first={first}
            rows={rows}
            page={page}
          />
        </span>
      </div>
    );
  };

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
            className="p-button-sm p-button-outlined p-button-text"
          />
          <Button
            ref={acceptBtnRef}
            outlined
            label="Удалить"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("delete", hide);
            }}
            className="p-button-sm p-button-outlined p-button-danger"
          ></Button>
        </div>
      </div>
    );
  };

  const geoSpendTemplate = (rowData) => {
    const geoSpend = rowData.geo_spend;
    return <Chip label={geoSpend} />;
  };

  const dateTemplate = (rowData) => {
    const dateString = rowData.date;
    const splittedDateString = dateString.split("-");
    const formattedDateString = `${splittedDateString[2]}-${splittedDateString[1]}-${splittedDateString[0]}`;
    return formattedDateString;
  };

  const actionSkeletonTemplate = () => {
    return (
      <div className="flex gap-3">
        <Skeleton size="3rem" />
        <Skeleton size="3rem" />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить расход"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddSpend}
        formatCalendarDate={formatCalendarDate}
        clearDialogInputObject={clearDialogInputObject}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать расход"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditSpend}
        formatCalendarDate={formatCalendarDate}
        clearDialogInputObject={clearDialogInputObject}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Расходы</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={loading ? skeletonData : spends}
          header={headerTemplate}
          rows={10}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorPosition="top"
          filters={filters}
          style={{ width: "90%" }}
          emptyMessage="Нет данных"
        >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="summary" header="Сумма"></Column>
          <Column
            field="geo_spend"
            header="Гео"
            body={loading ? <Skeleton /> : geoSpendTemplate}
          ></Column>
          <Column
            field="date"
            header="Дата"
            body={loading ? <Skeleton /> : dateTemplate}
          ></Column>
          <Column
            header="Действия"
            body={
              loading ? actionSkeletonTemplate : actionButtonsTemplate
            }
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Spends;

const skeletonData = [
  {
    id: <Skeleton />,
    name: <Skeleton />,
    summary: <Skeleton />,
    date: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    summary: <Skeleton />,
    date: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    summary: <Skeleton />,
    date: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    summary: <Skeleton />,
    date: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    summary: <Skeleton />,
    date: <Skeleton />,
  },
];
