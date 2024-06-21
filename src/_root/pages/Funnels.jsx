import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import {
  getFunnels,
  deleteFunnel,
  addFunnel,
  getFunnelsPaginationData,
  editFunnel,
} from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";
import FiltersStyled from "../../components/FiltersComponent";
import { TitleContext } from "../../context/TitleContext";
import { Skeleton } from "primereact/skeleton";
import PaginatorComponent from "../../components/PaginatorComponent";
import { Paginator } from "primereact/paginator";

function Funnels() {
  const dialogInputObjectInitialState = {
    name: "",
    link: "",
  };
  const [funnels, setFunnels] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [addDialogInputObject, setAddDialogInputObject] = useState(
    dialogInputObjectInitialState
  );
  const [editDialogInputObject, setEditDialogInputObject] = useState(
    dialogInputObjectInitialState
  );
  const [currentRowData, setCurrentRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [funnelsNames, setFunnelsNames] = useState([]);
  const { setTitleModel } = useContext(TitleContext);
  const [selectedFunnelID, setSelectedFunnelID] = useState(null);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const inputs = [
    {
      label: "Воронка",
      key: "name",
      type: "text",
      placeholder: "Название воронки",
      options: [],
    },
    {
      label: "Превью",
      key: "link",
      type: "text",
      placeholder: "Ссылка на превью",
      options: [],
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Воронка",
      key: "name",
      type: "multiselect",
      placeholder: "Название воронки",
      options: funnelsNames,
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
    // renderFunnels();
    setTitleModel("Воронки");
    getFunnels().then((response) => {
      
      setFunnelsNames(response.data.data.map(({ name }) => name));
    });
    
  }, []);

  const renderFunnels = async (obj) => {
    getFunnelsPaginationData(obj)
      .then((response) => {
        
        setFunnels(response.data.data);
        setTotalRecords(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке воронок");
      });
  };

  const handleEditActionClick = (rowData) => {
    setEditDialogInputObject({
      name: rowData.name,
      link: rowData.link,
    });
    setIsEditDialogVisible(true);
    setSelectedFunnelID(rowData.id);
  };

  const handleDeleteActionClick = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить воронку?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedFunnel,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление воронки отменено");
  };


  const deleteSelectedFunnel = () => {
    if (currentRowData) {
      deleteFunnel(currentRowData.id)
        .then(function (response) {
          showToast("success", response.data.data.message);
          renderFunnels();
        })
        .catch(function (error) {
          
          showToast("error", error.response.data.data.message);
        });
    }
  };

  const handleAddFunnel = () => {
    addFunnel(addDialogInputObject)
      .then(function (response) {
        showToast("success", response.data.data.message);
        setIsAddDialogVisible(false);
        setAddDialogInputObject(dialogInputObjectInitialState);
        renderFunnels();
      })
      .catch(function (error) {
        // showToast("error", error.response.message);
        setAddDialogInputObject(dialogInputObjectInitialState);
      });
  };

  const handleEditFunnel = () => {
    editFunnel(editDialogInputObject, selectedFunnelID)
      .then(function (response) {
        showToast("success", response.data.data.message);
        setIsEditDialogVisible(false);
        setEditDialogInputObject(dialogInputObjectInitialState);
        renderFunnels();
      })
      .catch(function (error) {
        showToast("error", error.response.data.data.message);
        setEditDialogInputObject(dialogInputObjectInitialState);
      });
  };

  const renderHeader = () => {
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
            type="leads"
            renderData={renderFunnels}
            first={first}
            rows={rows}
            page={page}
          />
        </span>
      </div>
    );
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setAddDialogInputObject({
      name: "",
    });
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
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

  const actionSkeletonTemplate = () => {
    return (
      <div className="flex gap-3">
        <Skeleton size="3rem" />
        <Skeleton size="3rem" />
      </div>
    );
  };

  const linkTemplate = (rowData) => {
    return (
      <a
        href={rowData.link}
        target="_blank"
        style={{
          cursor: "pointer",
          color: "#34d399",
          textDecoration: "underline",
          textUnderlineOffset: "5px",
        }}
      >
        {rowData.link}
      </a>
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
                  deleteSelectedFunnel();
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
      <h2 className="m-0">Воронки</h2>
      <div className="flex justify-content-between items-center mb-5">
        <p className="" style={{ width: "90%" }}>
          Общее количество: {totalRecords}
        </p>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setIsAddDialogVisible}
        />

        <DialogComponent
          type="add"
          isDialogVisible={isAddDialogVisible}
          setIsDialogVisible={setIsAddDialogVisible}
          header={"Добавить воронку"}
          dialogInputObject={addDialogInputObject}
          setDialogInputObject={setAddDialogInputObject}
          inputs={inputs}
          handleAdd={handleAddFunnel}
          clearDialogInputObject={clearDialogInputObject}
        />

        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header={"Редактировать воронку"}
          dialogInputObject={editDialogInputObject}
          setDialogInputObject={setEditDialogInputObject}
          inputs={inputs}
          handleEdit={handleEditFunnel}
          clearDialogInputObject={clearDialogInputObject}
        />
      </div>

      <div style={{ margin: "0 auto" }}>
        <DataTable
          value={loading ? skeletonData : funnels}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          header={renderHeader()}
          emptyMessage="Нет данных"
        >
          <Column field="id" header="ID" ></Column>
          <Column field="name" header="Воронка"></Column>
          <Column field="link" header="Превью" body={linkTemplate}></Column>
          <Column
            field="category"
            header="Действие"
            body={loading ? actionSkeletonTemplate : actionButtonsTemplate}

          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Funnels;

const skeletonData = [
  {
    id: <Skeleton />,
    name: <Skeleton />,
    link: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    link: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    link: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    link: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    link: <Skeleton />,
  },
];
