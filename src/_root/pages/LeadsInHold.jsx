import { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  addLead,
  editLead,
  getCountries,
  getFunnels,
  getOffers,
  getStatusesCRM,
  getUsers,
  sendLead,
  postOfferForLead,
  getSources,
  getFilteredLeads,
  getLeadsInHoldPaginationData,
} from "../../utilities/api";
import { deleteLead } from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { DialogComponent } from "../../components/DialogComponent";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { TitleContext } from "../../context/TitleContext";

import FiltersStyled from "../../components/FiltersComponent";
import { UserContext } from "../../context/UserContext";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";

function LeadsInHold() {
  // Стейты
  const [leadsInHold, setLeadsInHold] = useState([]);
  const [funnels, setFunnels] = useState({});
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);

  const [offersOptions, setOffersOptions] = useState([]);
  const [activeOffersOptions, setActiveOffersOptions] = useState([]);
  const [funnelsOptions, setFunnelsOptions] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [geosOptions, setGeosOptions] = useState([]);
  const [statusesCRMOptions, setStatusesCRMOptions] = useState([]);
  const [sourcesOptions, setSourcesOptions] = useState([]);

  const [selectedOfferDialog, setSelectedOfferDialog] = useState(null);
  const [selectedFunnelDialog, setSelectedFunnelDialog] = useState(null);
  const [selectedUserDialog, setSelectedUserDialog] = useState(null);
  const [selectedURLParams, setSelectedURLParams] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedLeadID, setSelectedLeadID] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  const [isLeadDialogVisible, setIsLeadDialogVisible] = useState(false);
  const [leadDialogType, setLeadDialogType] = useState("post-lead");
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isParameterDialogVisible, setIsParameterDialogVisible] =
    useState(false);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [isSendLeadDialogVisible, setIsSendLeadDialogVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filtersObjectForRefresh, setFiltersObjectForRefresh] = useState({});
  const [loading, setLoading] = useState(true);

  const { setTitleModel } = useContext(TitleContext);
  const { userData } = useContext(UserContext);

  const addLeadDialogInitialState = {
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    ip: "",
    geo: [],
    url_params: "",
  };

  const postLeadDialogInitialState = {
    full_name: "",
    domain: "",
    email: "",
    funnel: "",
    phone: "",
    ip: "",
    status: "",
    user: "",
    geo: [],
    created_at: "",
    url_params: "",
    source: "",
    external_id: "",
  };

  const [postLeadDialogInputObject, setPostLeadDialogInputObject] = useState(
    postLeadDialogInitialState
  );

  const [addLeadDialogInputObject, setAddLeadDialogInputObject] = useState(
    addLeadDialogInitialState
  );

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
    if (selectedFunnelDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        funnel: selectedFunnelDialog,
        funnel_id: getSelectedFunnelID(selectedFunnelDialog),
      }));
    }
  }, [selectedFunnelDialog]);

  useEffect(() => {
    if (selectedOfferDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        offer: selectedOfferDialog,
        offer_id: getSelectedOfferID(selectedOfferDialog),
      }));
    }
  }, [selectedOfferDialog]);

  useEffect(() => {
    if (selectedUserDialog) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        user: selectedUserDialog,
        user_id: getSelectedUserID(selectedUserDialog),
      }));
    }
  }, [selectedUserDialog]);

  useEffect(() => {
    if (selectedSource) {
      setPostLeadDialogInputObject((prevState) => ({
        ...prevState,
        source: selectedSource,
        source_id: getSelectedSourceID(selectedSource),
      }));
    }
  }, [selectedSource]);

  useEffect(() => {
    getCountriesData();
    getFunnelsData();
    getOffersData();
    getStatusesCRMData();
    getUsersData();
    getSourcesData();
    setTitleModel("Лиды");
  }, []);

  useEffect(() => {
    if (postLeadDialogInputObject.funnel && postLeadDialogInputObject.geo) {
      getOffersOptionsData();
    }
  }, [postLeadDialogInputObject]);

  // Инпуты для DialogComponent
  const postLeadDialogInputs = [
    {
      label: "Имя",
      key: "full_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "Домен",
      key: "domain",
      type: "text",
      placeholder: "Домен",
    },
    {
      label: "Email",
      key: "email",
      type: "text",
      placeholder: "Email",
    },
    {
      label: "Воронка",
      key: "funnel",
      type: "dropdown",
      placeholder: "Воронка",
      options: funnelsOptions,
      setDropdownValue: setSelectedFunnelDialog,
    },
    {
      label: "Телефон",
      key: "phone",
      type: "text",
      placeholder: "Телефон",
    },
    {
      label: "IP",
      key: "ip",
      type: "text",
      placeholder: "IP",
    },
    {
      label: "Статус",
      key: "status",
      type: "dropdown",
      placeholder: "Статус",
      options: statusesCRMOptions,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Пользователь",
      options: usersOptions,
      setDropdownValue: setSelectedUserDialog,
    },
    {
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geosOptions,
    },
    {
      label: "Дата создания",
      key: "created_at",
      type: "calendar",
      placeholder: "Дата создания",
    },
    {
      label: "Параметры",
      key: "url_params",
      type: "text",
      placeholder: "Параметры",
    },
    {
      label: "Источник",
      key: "source",
      type: "dropdown",
      placeholder: "Источник",
      options: sourcesOptions,
      setDropdownValue: setSelectedSource,
    },
    {
      label: "ID Брокера",
      key: "external_id",
      type: "text",
      placeholder: "ID Брокера",
    },
  ];

  const addLeadDialogInputs = [
    {
      label: "Имя",
      key: "full_name",
      type: "text",
      placeholder: "Имя",
    },
    {
      label: "Домен",
      key: "domain",
      type: "text",
      placeholder: "Домен",
    },
    {
      label: "Email",
      key: "email",
      type: "text",
      placeholder: "Email",
    },
    {
      label: "Воронка",
      key: "funnel",
      type: "dropdown",
      placeholder: "Воронка",
      options: funnelsOptions,
    },
    {
      label: "Телефон",
      key: "phone",
      type: "text",
      placeholder: "Телефон",
    },
    {
      label: "IP",
      key: "ip",
      type: "text",
      placeholder: "IP",
    },
    {
      label: "Гео",
      key: "geo",
      type: "dropdown",
      placeholder: "Гео",
      options: geosOptions,
    },
    {
      label: "Параметры",
      key: "url_params",
      type: "text",
      placeholder: "Параметры",
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Имя",
      key: "idemailphone",
      type: "text",
      placeholder: "Id, email or phone",
    },
    {
      label: "Параметры",
      key: "url_params",
      type: "text",
      placeholder: "Параметры",
    },
    {
      label: "Воронка",
      key: "funnel",
      type: "multiselect",
      placeholder: "Воронка",
      options: funnelsOptions,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "multiselect",
      placeholder: "Пользователь",
      options: usersOptions,
    },
    {
      label: "Гео",
      key: "geo",
      type: "multiselect",
      placeholder: "Гео",
      options: geosOptions,
    },
    {
      label: "Источник",
      key: "source",
      type: "multiselect",
      placeholder: "Источник",
      options: sourcesOptions,
    },
    {
      label: "Дата создания",
      key: "created_at",
      type: "calendar-creation",
      placeholder: "Дата создания",
    },
  ];

  // Функции подтягиваний данных с бека
  const renderLeadsInHold = async (obj) => {
    getLeadsInHoldPaginationData(obj).then(function (response) {
      setLeadsInHold(response.data.data);
      setTotalRecords(response.data.total);
      setLoading(false);
    });
  };

  const getOffersData = () => {
    getOffers()
      .then((response) => {
        const updatedOffers = response.data.data.map(({ name }) => name);
        setOffers(response.data.data);
        setOffersOptions(updatedOffers);
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке офферов");
      });
  };
  const getOffersOptionsData = () => {
    postOfferForLead({
      funnel: postLeadDialogInputObject.funnel,
      geo: postLeadDialogInputObject.geo,
    })
      .then((response) => {
        if (response.data.message !== "Нет активных офферов") {
          const updatedOffers = response.data.data.map(({ name }) => name);
          setActiveOffersOptions(updatedOffers);
        }
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке активных офферов");
      });
  };
  const getFunnelsData = () => {
    getFunnels()
      .then((response) => {
        const updatedFunnels = response.data.data.map(({ name }) => name);
        setFunnels(response.data.data);
        setFunnelsOptions(updatedFunnels);
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке воронок");
      });
  };

  const getCountriesData = () => {
    getCountries()
      .then((response) => {
        const updatedGeos = response.data.data.map(({ iso }) => iso);
        setGeosOptions(updatedGeos);
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке гео");
      });
  };

  const getUsersData = () => {
    getUsers()
      .then((response) => {
        setUsers(response.data.data);
        setUsersOptions(response.data.data.map(({ name }) => name));
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке пользователей");
      });
  };

  const getStatusesCRMData = () => {
    getStatusesCRM()
      .then((response) => {
        const updatedStatusesCRM = response.data.data.map(
          ({ crm_status }) => crm_status
        );
        setStatusesCRMOptions(updatedStatusesCRM);
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке статусов");
      });
  };

  const getSourcesData = () => {
    getSources()
      .then((response) => {
        setSources(response.data.data);
        setSourcesOptions(response.data.data.map(({ name }) => name));
      })
      .catch((error) => {
        showToast("error", "Ошибка при загрузке источников");
      });
  };

  // Обработчики кликов по данным таблицы
  const handleIdClick = (rowData) => {
    const parsedStatusArray = JSON.parse(rowData.status);
    const newestStatusObject = parsedStatusArray[parsedStatusArray.length - 1];
    setIsLeadDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedSource(rowData.source);
    setSelectedFunnelDialog(rowData.funnel);
    setSelectedUserDialog(rowData.user);
    setPostLeadDialogInputObject({
      id: rowData.id,
      full_name: rowData.full_name,
      domain: rowData.domain,
      email: rowData.email,
      phone: rowData.phone,
      ip: rowData.ip,
      status: newestStatusObject.status,
      geo: rowData.geo,
      created_at: formatTimestampForCalendar(rowData.created_at),
      url_params: rowData.url_params,
      source: rowData.source,
      external_id: rowData.external_id,
    });
  };

  const handleDeleteActionClick = (e, rowData) => {
    showConfirmDeletePopUp(e);
    setSelectedLeadID(rowData.id);
  };

  const handleURLParameterClick = (rowData, selectedURLParamsArray) => {
    setIsParameterDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedURLParams(selectedURLParamsArray);
  };

  const handleStatusClick = (rowData, parsedArray) => {
    setIsStatusDialogVisible(true);
    setSelectedLeadID(rowData.id);
    setSelectedStatuses(parsedArray);
  };

  const handleOpenSendLeadDialog = () => {
    setIsSendLeadDialogVisible(true);
  };

  // Функция для управления плажкой на удаление данных из DataTable
  const handleConfirmPopUpButtonClick = (option, hide) => {
    option === "delete"
      ? handleDeleteLead(selectedLeadID)
      : showToast("info", "Удаление лида отменено"),
      hide();
    setSelectedLeadID(null);
  };

  // Обработчики взаимодействия фронта с беком

  const handlePostLead = () => {
    if (postLeadDialogInputObject) {
      sendLead(postLeadDialogInputObject)
        .then(function (response) {
          setIsLeadDialogVisible(false);
          setIsSendLeadDialogVisible(false);
          showToast("success", response.data.message);
          renderLeadsInHold(filtersObjectForRefresh);
          clearDialogInputObject()
        })
        .catch(function (error) {
          showToast("error", error.response.data.data.message);
        });
    } else {
      showToast("error", "Пожалуйста, введите все поля");
    }
  };

  const handleEditLead = () => {
    editLead(postLeadDialogInputObject, selectedLeadID)
      .then(function (response) {
        showToast("success", response.data.data.message);
        setLeadDialogType("post-lead");
        renderLeadsInHold(filtersObjectForRefresh);
      })
      .catch(function (error) {
        showToast("error", error.response.data.data.message);
      });
  };

  const handleDeleteLead = () => {
    deleteLead(selectedLeadID)
      .then(function (response) {
        showToast("success", response.data.data.message);
        renderLeadsInHold(filtersObjectForRefresh);
      })
      .catch(function (error) {
        showToast("error", response.data.message);
      });
  };

  // Функция для сброса стейтов
  const clearDialogInputObject = () => {
    setAddLeadDialogInputObject(addLeadDialogInitialState);
    setPostLeadDialogInputObject(postLeadDialogInitialState);
    setLeadDialogType("post-lead");
    setSelectedLeadID(null);
    setSelectedOfferDialog(null);
    setSelectedFunnelDialog(null);
    setSelectedUserDialog(null);
    setSelectedURLParams(null);
    setActiveOffersOptions(null);
  };

  // Рендер плажки на удаление данных из DataTable
  const showConfirmDeletePopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить лида?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
    });
  };

  // Вспомогательные функции
  const getSelectedFunnelID = (name) => {
    const filteredArray = funnels.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const getSelectedOfferID = (name) => {
    const filteredArray = offers.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const getSelectedSourceID = (name) => {
    const filteredArray = sources.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    date.setUTCHours(date.getUTCHours() + 3);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const formattedTimestamp = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedTimestamp;
  };

  const formatTimestampForCalendar = (timestamp) => {
    return new Date(timestamp);
  };

  const isAllFieldsFilled = (object) => {
    return Object.values(object).every((value) => {
      return value !== "" && value !== null && value.length !== 0;
    });
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
    renderLeadsInHold(filtersObjectForRefresh);
  };

  // Шаблоны для DataTable
  const actionButtonsTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
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
      <div className="flex justify-content-between align-items-center p-0">
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
            setFiltersObjectForRefresh={setFiltersObjectForRefresh}
            type="leads"
            renderData={renderLeadsInHold}
            setDataFinal={setLeadsInHold}
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

  const URLParamsTemplate = (rowData) => {
    if (!rowData.url_params) {
      return [];
    }

    const splittedURLParams = rowData.url_params.split("&");
    const selectedURLParamsArray = splittedURLParams.map((param) => {
      const [parameter, value] = param.split("=");
      return { parameter, value };
    });

    const style =
      splittedURLParams.length > 1
        ? {
            cursor: "pointer",
            color: "#34d399",
            textDecoration: "underline",
            textUnderlineOffset: "5px",
          }
        : {};

    const handleClick =
      splittedURLParams.length > 1
        ? () => {
            handleURLParameterClick(rowData, selectedURLParamsArray);
          }
        : undefined;

    return (
      <div style={style} onClick={handleClick}>
        {splittedURLParams.length > 1
          ? (splittedURLParams[0].length > 20
              ? splittedURLParams[0].substring(0, 20) + "..."
              : splittedURLParams[0]) + ` (+${splittedURLParams.length - 1})`
          : splittedURLParams[0].length > 20
          ? splittedURLParams[0].substring(0, 20) + "..."
          : splittedURLParams[0]}
      </div>
    );
  };

  const createdAtTemplate = (rowData) => {
    return <div>{formatTimestamp(rowData.created_at)}</div>;
  };

  const statusTemplate = (rowData) => {
    const parsedArray = JSON.parse(rowData.status);
    // const newestStatus = parsedArray[parsedArray.length - 1].status;
    return (
      <div
        style={{
          cursor: "pointer",
          // color: rowData.is_valid ? "#34d399" : "#ff6666",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
        onClick={() => {
          handleStatusClick(rowData, parsedArray);
        }}
      >
        {rowData.newest_status}
      </div>
    );
  };

  const IDTemplate = (rowData) => {
    const isUserAdmin = userData.role === "Admin";
    const style = isUserAdmin
      ? {
          cursor: "pointer",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }
      : {};

    return (
      <div
        style={style}
        onClick={isUserAdmin ? () => handleIdClick(rowData) : undefined}
      >
        {rowData.id}
      </div>
    );
  };

  const phoneTemplate = (rowData) => {
    const isUserAdmin = userData.role === "Admin";
    const phoneForBuyer = rowData.phone.toString().slice(0, -7) + "-XXXXXXX";
    if(!isUserAdmin) {
    return phoneForBuyer;
    }
    return rowData.phone;
  };

  const isDepositedTemplate = (rowData) => {
    const parsedValue = rowData.is_deposited === 1 ? "Yes" : "No";
    return (
      <div>
        {parsedValue === "Yes" ? (
          <div style={{ color: "#34d399" }}>{parsedValue}</div>
        ) : (
          <div>{parsedValue}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog
        className="w-full max-w-25rem min-w-25rem"
        header="Параметры"
        visible={isParameterDialogVisible}
        resizable={false}
        draggable={false}
        onHide={() => {
          setSelectedLeadID(null);
          setIsParameterDialogVisible(false);
        }}
      >
        <DataTable
          value={selectedURLParams}
          showGridlines
          emptyMessage="Нет данных"
        >
          <Column field="parameter" header="Параметр"></Column>
          <Column field="value" header="Значение"></Column>
        </DataTable>
      </Dialog>

      <Dialog
        className="w-full max-w-25rem min-w-25rem"
        header="Статусы"
        visible={isStatusDialogVisible}
        resizable={false}
        draggable={false}
        onHide={() => {
          setSelectedLeadID(null);
          setIsStatusDialogVisible(false);
        }}
      >
        <DataTable
          value={selectedStatuses}
          showGridlines
          emptyMessage="Нет данных"
        >
          <Column field="time" header="Время"></Column>
          <Column field="status" header="Статус"></Column>
        </DataTable>
      </Dialog>

      <Dialog
        header="Выбрать оффер"
        draggable={false}
        visible={isSendLeadDialogVisible}
        style={{ maxWidth: "calc(50% - 0.5rem)" }}
        onHide={() => setIsSendLeadDialogVisible(false)}
      >
        <Dropdown
          value={postLeadDialogInputObject["offer"]}
          onChange={(e) => {
            setSelectedOfferDialog(e.value);
          }}
          options={activeOffersOptions}
          placeholder="Офферы"
          className="w-full mb-5"
          emptyMessage="Нет активных офферов"
        />
        <Button label="Отправить" onClick={handlePostLead} />
      </Dialog>

      <DialogComponent
        type="lead"
        isDialogVisible={isLeadDialogVisible}
        setIsDialogVisible={setIsLeadDialogVisible}
        header="Лид"
        dialogInputObject={postLeadDialogInputObject}
        setDialogInputObject={setPostLeadDialogInputObject}
        leadDialogType={leadDialogType}
        setLeadDialogType={setLeadDialogType}
        formatCalendarDate={formatTimestampForCalendar}
        inputs={postLeadDialogInputs}
        handleAdd={handleOpenSendLeadDialog}
        handleEdit={handleEditLead}
        clearDialogInputObject={clearDialogInputObject}
      />

      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContentTemplate} />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5 mb-0"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Неотправленные лиды</h2>
        </div>
        <p className="" style={{ width: "90%" }}>
          Общее количество: {totalRecords}
        </p>
        <Card style={{ width: "90%" }}>
          <DataTable
            value={loading ? skeletonData : leadsInHold}
            header={headerTemplate}
            emptyMessage="Нет данных"
          >
            <Column field="id" header="ID" body={IDTemplate}></Column>
            {userData.role === "Admin" && (
              <Column
                field="phone"
                header="Номер телефона"
                body={loading ? <Skeleton /> : phoneTemplate}
              ></Column>
            )}

            <Column field="full_name" header="Имя / Фамилия"></Column>
            {userData.role === "Admin" && (
              <Column field="email" header="Почта"></Column>
            )}

            <Column field="geo" header="Гео"></Column>
            <Column field="domain" header="Домен"></Column>
            <Column field="funnel" header="Воронка"></Column>
            <Column field="source" header="Источник"></Column>
            <Column
              field="status"
              header="Статус"
              body={loading ? <Skeleton /> : statusTemplate}
            ></Column>
            <Column
              field="is_deposited"
              header="Депозит"
              body={loading ? <Skeleton /> : isDepositedTemplate}
            ></Column>
            <Column field="user" header="Пользователь"></Column>
            <Column
              field="url_params"
              header="Параметры"
              body={loading ? <Skeleton /> : URLParamsTemplate}
            ></Column>
            <Column
              field="created_at"
              header="Лид создан"
              body={loading ? <Skeleton /> : createdAtTemplate}
            ></Column>
            {userData.role === "Admin" && (
              <Column
                field="category"
                header="Действие"
                body={loading ? <Skeleton /> : actionButtonsTemplate}
              ></Column>
            )}
          </DataTable>
        </Card>
      </div>
    </>
  );
}

export default LeadsInHold;

const skeletonData = [
  {
    id: <Skeleton />,
    offer: <Skeleton />,
    phone: <Skeleton />,
    full_name: <Skeleton />,
    email: <Skeleton />,
    geo: <Skeleton />,
    domain: <Skeleton />,
    funnel: <Skeleton />,
    status: <Skeleton />,
    is_fraud: <Skeleton />,
    is_deposited: <Skeleton />,
    user: <Skeleton />,
    url_params: <Skeleton />,
    created_at: <Skeleton />,
    lead_sent: <Skeleton />,
    date_deposited: <Skeleton />,
    source: <Skeleton />,
  },
  {
    id: <Skeleton />,
    offer: <Skeleton />,
    phone: <Skeleton />,
    full_name: <Skeleton />,
    email: <Skeleton />,
    geo: <Skeleton />,
    domain: <Skeleton />,
    funnel: <Skeleton />,
    status: <Skeleton />,
    is_fraud: <Skeleton />,
    is_deposited: <Skeleton />,
    user: <Skeleton />,
    url_params: <Skeleton />,
    created_at: <Skeleton />,
    lead_sent: <Skeleton />,
    date_deposited: <Skeleton />,
    source: <Skeleton />,
  },
  {
    id: <Skeleton />,
    offer: <Skeleton />,
    phone: <Skeleton />,
    full_name: <Skeleton />,
    email: <Skeleton />,
    geo: <Skeleton />,
    domain: <Skeleton />,
    funnel: <Skeleton />,
    status: <Skeleton />,
    is_fraud: <Skeleton />,
    is_deposited: <Skeleton />,
    user: <Skeleton />,
    url_params: <Skeleton />,
    created_at: <Skeleton />,
    lead_sent: <Skeleton />,
    date_deposited: <Skeleton />,
    source: <Skeleton />,
  },
  {
    id: <Skeleton />,
    offer: <Skeleton />,
    phone: <Skeleton />,
    full_name: <Skeleton />,
    email: <Skeleton />,
    geo: <Skeleton />,
    domain: <Skeleton />,
    funnel: <Skeleton />,
    status: <Skeleton />,
    is_fraud: <Skeleton />,
    is_deposited: <Skeleton />,
    user: <Skeleton />,
    url_params: <Skeleton />,
    created_at: <Skeleton />,
    lead_sent: <Skeleton />,
    date_deposited: <Skeleton />,
    source: <Skeleton />,
  },
  {
    id: <Skeleton />,
    offer: <Skeleton />,
    phone: <Skeleton />,
    full_name: <Skeleton />,
    email: <Skeleton />,
    geo: <Skeleton />,
    domain: <Skeleton />,
    funnel: <Skeleton />,
    status: <Skeleton />,
    is_fraud: <Skeleton />,
    is_deposited: <Skeleton />,
    user: <Skeleton />,
    url_params: <Skeleton />,
    created_at: <Skeleton />,
    lead_sent: <Skeleton />,
    date_deposited: <Skeleton />,
    source: <Skeleton />,
  },
];
