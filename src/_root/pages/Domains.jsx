import { useState, useEffect, useRef, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

import {
  getDomains,
  deleteDomain,
  addDomain,
  editDomain,
  getUsers,
  getDomainsPaginationData,
} from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";
import FiltersStyled from "../../components/FiltersComponent";
import { TitleContext } from "../../context/TitleContext";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";

function Domains() {
  const [domains, setDomains] = useState([]);
  const [domainsOptions, setDomainsOptions] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [domainsUsers, setDomainsUsers] = useState([]);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(true);
  const { setTitleModel } = useContext(TitleContext);

  const dialogInputObjectInitialState = { name: "", user: "", user_id: "" };

  const [dialogInputObject, setDialogInputObject] = useState(
    dialogInputObjectInitialState
  );

  const toast = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setDialogInputObject((prevState) => ({
        ...prevState,
        user: selectedUser,
        user_id: getSelectedUserID(selectedUser),
      }));
    }
    
  }, [selectedUser]);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const editDomainInputs = [
    {
      label: "Название",
      key: "name",
      type: "dropdown",
      placeholder: "Введите название домена",
      options: domainsOptions,
      disabled: true,
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Выберите пользователя",
      options: usersOptions,
      setDropdownValue: setSelectedUser,
    },
  ];

  const addDomainInputs = [
    {
      label: "Название",
      key: "name",
      type: "text",
      placeholder: "Введите название домена",
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Выберите пользователя",
      options: usersOptions,
      setDropdownValue: setSelectedUser,
    },
  ];

  //фильтры для FitersComponent

  const filtersArray = [
    {
      label: "Название",
      key: "domain",
      type: "multiselect",
      placeholder: "Введите название домена",
      options: domainsOptions,
    },
    {
      label: "Пользователь",
      key: "name",
      type: "multiselect",
      placeholder: "Выберите пользователя",
      options: usersOptions,
    },
  ];

  useEffect(() => {
    // renderDomains();
    setTitleModel("Домены");

    getUsers()
      .then((response) => {
        setUsers(response.data.data);
        setUsersOptions(response.data.data.map(({ name }) => name));
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке пользователей");
      });

    getDomains().then((response) => {
      setDomainsOptions(response.data.data.map(({ domain }) => domain));
    });
  }, []);

  const renderDomains = async (obj) => {
    getDomainsPaginationData(obj)
      .then((response) => {
        
        setDomains(response.data.data);
        setDomainsUsers(response.data.data.map((funnel) => funnel.name));
        setTotalRecords(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке доменов");
      });
  };

  const confirmDeleteDomain = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить домен?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedDomain,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    showToast("info", "Удаление домена отменено");
  };

  const deleteSelectedDomain = () => {
    if (currentRowData) {
      deleteDomain(currentRowData.id)
        .then(function (response) {
          showToast("success", "Домен успешно удалён");
          renderDomains();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка удаления домена");
        });
    }
  };

  const addNewDomain = () => {
    addDomain(dialogInputObject)
      .then(function (response) {
        showToast("success", response.data.message);
        setIsAddDialogVisible(false);
        clearDialogInputObject();
        renderDomains();
      })
      .catch(function (error) {
        showToast("error", error.response.data.data.message);
      });
  };

  const handleEdit = (rowData) => {
    setCurrentRowData(rowData.id);
    setIsEditDialogVisible(true);
    setSelectedUser(rowData.name);
    setDialogInputObject({
      name: rowData.domain,
    });
  };

  const editCurrentDomain = () => {
    editDomain(dialogInputObject, currentRowData)
      .then(function (response) {
        
        showToast("success", response.data.data.message);
        setIsEditDialogVisible(false);
        clearDialogInputObject();
        renderDomains();
      })
      .catch(function (error) {
        showToast("error", response.data.message);
      });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject(dialogInputObjectInitialState);
    setSelectedUser("");
  };

  const getSelectedUserID = (name) => {
    const filteredArray = users.filter((obj) => obj.name === name);
    return filteredArray[0].id;
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
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
            type="domains"
            renderData={renderDomains}
            setDataFinal={setDomains}
            first={first}
            rows={rows}
            page={page}
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleEdit(rowData)}
        />

        <Button
          onClick={(e) => confirmDeleteDomain(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
    );
  };

  const userTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.name}</span>
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
                  deleteSelectedDomain();
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
      <h2 className="m-0">Домены</h2>
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
          header="Добавить домен"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={addDomainInputs}
          handleAdd={addNewDomain}
          clearDialogInputObject={clearDialogInputObject}
        />
        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header="Редактировать домен"
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={editDomainInputs}
          handleEdit={editCurrentDomain}
          clearDialogInputObject={clearDialogInputObject}
        />
      </div>

      <div style={{ margin: "0 auto" }}>
        <DataTable
          value={loading ? skeletonData : domains}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          header={renderHeader()}
          emptyMessage="Нет данных"
        >
          <Column field="id" header="ID" style={{ width: "20%" }}></Column>
          <Column field="domain" header="Домен"></Column>
          <Column
            field="name"
            header="Пользователь"
            showFilterMatchModes={false}
            body={loading ? <Skeleton /> : userTemplate}
          ></Column>
          <Column
            header="Действие"
            body={loading ? actionSkeletonTemplate : actionBodyTemplate}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Domains;

const skeletonData = [
  {
    id: <Skeleton />,
    domain: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    domain: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    domain: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    domain: <Skeleton />,
    name: <Skeleton />,
  },
  {
    id: <Skeleton />,
    domain: <Skeleton />,
    name: <Skeleton />,
  },
];
