import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import {
  getStatuses,
  deleteStatus,
  addStatus,
  getStatusesCRM,
  editStatusBroker,
  editStatusCRMValidity,
} from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";
import { InputSwitch } from "primereact/inputswitch";
import { TitleContext } from "../../context/TitleContext";

function Statuses() {
  const [visibleTable, setVisibleTable] = useState("broker-statuses");
  const [statuses, setStatuses] = useState([]);
  const [statusesCRM, setStatusesCRM] = useState([]);
  const [statusesCRMOptions, setStatusesCRMOptions] = useState([]);
  const [selectedStatusCRM, setSelectedStatusCRM] = useState("");
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [validityChecked, setValidityChecked] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const addStatusDialogInputObjectInitialState = {
    crm_status: "",
    is_valid: 0,
  };
  const editStatusDialogInputObjectInitialState = {
    broker_name: "",
    broker_status: "",
    crm_status: {},
    status_id: "",
  };

  const [addStatusDialogInputObject, setAddStatusDialogInputObject] = useState(
    addStatusDialogInputObjectInitialState
  );

  const [editStatusDialogInputObject, setEditStatusDialogInputObject] =
    useState(editStatusDialogInputObjectInitialState);

  const { setTitleModel } = useContext(TitleContext);

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const inputsEdit = [
    {
      label: "Статус брокера",
      key: "broker_status",
      type: "text",
      placeholder: "Введите статус брокера",
      disabled: true,
    },
    {
      label: "Статус CRM",
      key: "crm_status",
      type: "dropdown",
      placeholder: "Введите статус CRM",
      options: statusesCRMOptions,
      setDropdownValue: setSelectedStatusCRM,
    },
  ];

  const inputsAdd = [
    {
      label: "Статус CRM",
      key: "crm_status",
      type: "text",
      placeholder: "Введите статус CRM",
    },
    {
      label: "Валидность статуса",
      key: "is_valid",
      type: "switch",
      placeholder: "Введите статус CRM",
    },
  ];


  useEffect(() => {
    if (selectedStatusCRM) {
      setEditStatusDialogInputObject((prevState) => ({
        ...prevState,
        crm_status: selectedStatusCRM,
        status_id: getSelectedStatusCRMID(selectedStatusCRM),
      }));
    }
  }, [selectedStatusCRM]);

  useEffect(() => {
    renderStatuses();
    setTitleModel("Статусы");
  }, []);

  const renderStatuses = () => {
    getStatuses()
      .then((response) => {
        const renamedData = response.data.data.map((item) => ({
          ...item,
          name: item.name,
        }));
        setStatuses(renamedData);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке статусов");
      });
    getStatusesCRM()
      .then((response) => {
        const validityArray = [];
        response.data.data.forEach((obj) => {
          validityArray.push({
            id: obj.id,
            is_valid: obj.is_valid === 1,
          });
        });
        const updatedStatusesCRMOptions = response.data.data.map(
          ({ crm_status }) => crm_status
        );
        setStatusesCRM(response.data.data);
        setStatusesCRMOptions(updatedStatusesCRMOptions);
        setValidityChecked(validityArray);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке статусов CRM");
      });
  };

  const getUpdatedStatusesCRMOptions = (obj) => {
    return { id: obj.id, crm_status: obj.crm_status };
  };

  const getSelectedStatusCRMID = (status) => {
    const filteredArray = statusesCRM.filter(
      (obj) => obj.crm_status === status
    );
    return filteredArray[0].id;
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmDeleteStatus = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить статус?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedStatus,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление статуса отменено");
  };

  const deleteSelectedStatus = () => {
    if (currentRowData) {
      deleteStatus(currentRowData.id)
        .then(function () {
          showToast("success", "Статус успешно удалён");
          renderStatuses();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка удаления статуса");
        });
    }
  };

  const addNewStatus = () => {
    addStatus(addStatusDialogInputObject)
      .then(function () {
        showToast("success", "Статус успешно добавлен");
        setIsAddDialogVisible(false);
        setAddStatusDialogInputObject({});
        renderStatuses();
      })
      .catch(function (error) {
        
        showToast("error", "Ошибка добавления статуса");
      });
  };

  const handleEdit = (event, rowData) => {
    setCurrentRowData(rowData);
    setIsEditDialogVisible(true);
    setSelectedStatusCRM(rowData.crm_status);
    setEditStatusDialogInputObject({
      broker_status: rowData.broker_status,
    });
  };

  const editCurrentStatus = () => {
    editStatusBroker(editStatusDialogInputObject, currentRowData.id)
      .then(function (response) {
        showToast("success", "Статус успешно изменён");
        setIsEditDialogVisible(false);
        setEditStatusDialogInputObject({});
        renderStatuses();
      })
      .catch(function (error) {
        showToast("error", "Ошибка редактирования статуса");
      });
  };

  const handleEditStatusCRMValidity = (id, value) => {
    editStatusCRMValidity(id, value)
      .then((response) => {
        showToast("success", response.data.message);
        
      })
      .catch((err) => {
        showToast("error", response.data.message);
        
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setAddStatusDialogInputObject(addStatusDialogInputObjectInitialState);
    setEditStatusDialogInputObject(editStatusDialogInputObjectInitialState);
  };

  const handleToggleStatusCRMValidity = (id, value) => {
    const transformedIsValid = value ? 1 : 0;
    const updatedValidityChecked = validityChecked.map((item) =>
      item.id === id ? { ...item, is_valid: value } : item
    );
    handleEditStatusCRMValidity(id, transformedIsValid);
    setValidityChecked(updatedValidityChecked);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Поиск"
          />
        </span>
      </div>
    );
  };

  const statusesActionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleEdit(e, rowData)}
        />
      </div>
    );
  };

  const statusesCRMActionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          onClick={(e) => confirmDeleteStatus(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
    );
  };

  const validityTemplate = (rowData) => {
    const item = validityChecked.find((el) => el.id === rowData.id);

    return (
      <InputSwitch
        key={item.id}
        checked={item.is_valid}
        onChange={(e) => handleToggleStatusCRMValidity(item.id, e.value)}
      />
    );
  };

  return (
    <div className="" style={{ maxWidth: "90%", margin: "0 auto" }}>
      <Toast ref={toast} />
      <ConfirmPopup
        group="headless"
        content={({ message, acceptBtnRef, rejectBtnRef, hide }) => (
          <div className="border-round p-3">
            <span>{message}</span>
            <div className="flex align-items-center gap-2 mt-3">
              <Button
                ref={acceptBtnRef}
                label="Да"
                onClick={() => {
                  deleteSelectedStatus();
                  hide();
                }}
                className="p-button-sm p-button-outlined p-button-danger"
              ></Button>
              <Button
                ref={rejectBtnRef}
                label="Отменить"
                outlined
                onClick={() => {
                  rejectDeletion();
                  hide();
                }}
                className="p-button-sm p-button-text"
              ></Button>
            </div>
          </div>
        )}
      />
      <div className="flex justify-content-between items-center mb-5">
        <h2 className="m-0">Статусы</h2>
        <Button
          label={
            visibleTable === "broker-statuses"
              ? "Статусы CRM"
              : "Статусы брокеров"
          }
          icon="pi pi-arrow-right-arrow-left"
          onClick={() =>
            setVisibleTable((prevState) =>
              prevState === "broker-statuses"
                ? "crm-statuses"
                : "broker-statuses"
            )
          }
        />
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setIsAddDialogVisible}
        />
        <DialogComponent
          type="add"
          isDialogVisible={isAddDialogVisible}
          setIsDialogVisible={setIsAddDialogVisible}
          header="Добавить статус"
          dialogInputObject={addStatusDialogInputObject}
          setDialogInputObject={setAddStatusDialogInputObject}
          inputs={inputsAdd}
          handleAdd={addNewStatus}
          clearDialogInputObject={clearDialogInputObject}
        />
        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header="Редактировать статус"
          dialogInputObject={editStatusDialogInputObject}
          setDialogInputObject={setEditStatusDialogInputObject}
          inputs={inputsEdit}
          handleEdit={editCurrentStatus}
          clearDialogInputObject={clearDialogInputObject}
        />
      </div>

      <div style={{ margin: "0 auto" }}>
        {visibleTable === "broker-statuses" ? (
          <DataTable
            value={statuses}
            paginator
            rows={20}
            rowsPerPageOptions={[20, 50, 100]}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
            paginatorPosition="top"
            dataKey="id"
            filters={filters}
            loading={loading}
            header={renderHeader()}
            emptyMessage="Нет данных"
          >
            <Column field="id" header="ID" style={{ width: "20%" }}></Column>
            <Column field="broker_status" header="Статус брокера"></Column>
            <Column field="crm_status" header="Статус CRM"></Column>
            <Column field="broker_name" header="Брокер"></Column>
            <Column
              field="category"
              header="Действие"
              body={statusesActionBodyTemplate}
              style={{ width: "20%" }}
            ></Column>
          </DataTable>
        ) : (
          <DataTable
            value={statusesCRM}
            paginator
            rows={20}
            rowsPerPageOptions={[20, 50, 100]}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
            paginatorPosition="top"
            dataKey="id"
            filters={filters}
            loading={loading}
            header={renderHeader()}
            emptyMessage="Нет данных"
          >
            <Column field="id" header="ID" style={{ width: "20%" }}></Column>
            <Column field="crm_status" header="Статус CRM"></Column>
            <Column
              field="is_valid"
              header="Валидность"
              body={validityTemplate}
            ></Column>
            {/* <Column
              field="category"
              header="Действие"
              body={statusesCRMActionBodyTemplate}
              style={{ width: "20%" }}
            ></Column> */}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default Statuses;
