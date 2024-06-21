import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { DialogComponent } from "../../components/DialogComponent";

import { getSources, deleteSource, addSource } from "../../utilities/api";
import { TitleContext } from "../../context/TitleContext";

function Sources() {
  const [sources, setSources] = useState([]);
  const [popupCreateVisible, setPopupCreateVisible] = useState(false);
  const [dialogInputObject, setDialogInputObject] = useState({ name: "" });
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { setTitleModel } = useContext(TitleContext);

  const inputs = [
    {
      label: "Источник",
      key: "name",
      type: "text",
      placeholder: "Название источника",
      options: [],
    },
  ];

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  useEffect(() => {
    renderSources();
    setTitleModel("Источники");
  }, []);

  const renderSources = () => {
    getSources()
      .then((response) => {
        setSources(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке источников");
      });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmDeleteSource = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить источник?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedSource,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление источника отменено");
  };

  const deleteSelectedSource = () => {
    if (currentRowData) {
      deleteSource(currentRowData.id)
        .then(function (response) {
          showToast("success", "Удаление источника успешно");
          renderSources();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка удаления источника");
        });
    }
  };

  const addNewSource = () => {
    addSource(dialogInputObject.name)
      .then(function (response) {
        showToast("success", "Добавление источника успешно");
        setPopupCreateVisible(false);
        setDialogInputObject({ name: "" });
        renderSources();
      })
      .catch(function (error) {
        showToast("error", "Ошибка при добавлении источника");
        setDialogInputObject({ name: "" });
      });
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

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={(e) => confirmDeleteSource(e, rowData)}
        icon="pi pi-trash"
        className="p-button-danger"
        style={{ maxWidth: "48px", margin: "0 auto" }}
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
                  deleteSelectedSource();
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
        <h2 className="m-0">Источники</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setPopupCreateVisible}
        />

        <DialogComponent
          type="add"
          isDialogVisible={popupCreateVisible}
          setIsDialogVisible={setPopupCreateVisible}
          header={"Добавить источник"}
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleAdd={addNewSource}
          clearDialogInputObject={clearDialogInputObject}
        />
      </div>

      <div style={{ margin: "0 auto" }}>
        <DataTable
          value={sources}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          loading={loading}
          header={renderHeader()}
          emptyMessage="Нет данных"
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "30%" }}
          ></Column>
          <Column field="name" header="Источник"></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Sources;
