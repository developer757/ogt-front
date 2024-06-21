import { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  getUsers,
  deleteUser,
  addUser,
  editUser,
  generatePassword,
  getUsersPaginationData,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";
import { TitleContext } from "../../context/TitleContext";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";

function Users() {
  const [users, setUsers] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const { setTitleModel } = useContext(TitleContext);

  const dialogRoles = ["Admin", "Buyer"];

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  const handleGeneratePassword = () => {
    generatePassword().then((response) => {
      setDialogInputObject((prevState) => ({
        ...prevState,
        password: response.data.random_password,
      }));
      setConfirmedPassword(response.data.random_password);
    });
  };

  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "text",
      placeholder: "Введите имя",
    },
    {
      label: "Почта",
      key: "email",
      type: "text",
      placeholder: "Введите почту",
    },
    {
      label: "Пароль",
      key: "password",
      type: "password",
      placeholder: "Введите пароль",
    },
    {
      label: "Повторите пароль",
      key: "confirmed-password",
      type: "password",
      placeholder: "Введите пароль",
      confirmedPassword: confirmedPassword,
      setConfirmedPassword: setConfirmedPassword,
    },
    {
      type: "button",
      placeholder: "Сгенерировать пароль",
      onClick: handleGeneratePassword,
    },
    {
      label: "Роль",
      key: "role",
      type: "dropdown",
      placeholder: "Выберите роль",
      options: dialogRoles,
    },
  ];

  const editDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "text",
      placeholder: "Введите имя",
    },
    {
      label: "Почта",
      key: "email",
      type: "text",
      placeholder: "Введите почту",
    },
    {
      label: "Роль",
      key: "role",
      type: "dropdown",
      placeholder: "Выберите роль",
      options: dialogRoles,
    },
  ];

  useEffect(() => {
    renderUsers();
    setTitleModel("Пользователи");
  }, []);

  useEffect(() => {
    renderUsers();
  }, [page, rows]);

  const renderUsers = () => {
    getUsersPaginationData({ perPage: rows, page: page + 1 }).then(function (
      response
    ) {
      setUsers(response.data.data);
      setTotalRecords(response.data.total);
      setLoading(false);
      
    });
  };

  const handleTogglePopUp = (option, e, users) => {
    if (option === "add") {
      showPopUp(e);
    } else {
      setDialogInputObject({
        name: users.name,
        email: users.email,
        role: users.role,
      });
      setIsEditDialogVisible(true);
    }
    setSelectedUserID(users.id);
  };

  useEffect(() => {
    
  }, [selectedUserID]);

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteUser(selectedUserID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedUserID(null);
  };

  const actionButtonsTemplate = (users) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleTogglePopUp("edit", e, users)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp("add", e, users)}
        />
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-content-center">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[20, 50, 100]}
          onPageChange={onPageChange}
        />
      </div>
    );
  };

  const showAcceptToast = () => {
    showToast("success", "Пользователь успешно удалён");
  };

  const showRejectToast = () => {
    showToast("info", "Удаление пользователя отменено");
  };

  const handleAddUser = () => {
    if (dialogInputObject.password == confirmedPassword) {
      addUser(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showToast("success", "Пользователь успешно добавлен");
          renderUsers();
        })
        .catch(function (error) {
          showToast("error", "Ошибка добавления пользователя");
        });
    } else {
      
      
      showToast("info", "Заполните все поля правильно");
    }
  };

  const handleEditUser = ({ name, email, role }) => {
    if (name !== "" && email !== "" && role !== "") {
      editUser(dialogInputObject, selectedUserID)
        .then(function (response) {
          showToast("success", "Пользователь успешно редактирован");
          setIsEditDialogVisible(false);
          renderUsers();
        })
        .catch(function (error) {
          
          showToast("error", "Ошибка редактирования пользователя");
        });
    } else {
      
      showToast("info", "Заполните все поля");
    }
  };

  const handleDeleteUser = () => {
    
    deleteUser(selectedUserID)
      .then(function (response) {
        showToast("success", "Пользователь успешно удален");
        renderUsers();
      })
      .catch(function (error) {
        
        showToast("error", "Ошибка удаления пользователя");
      });
  };

  const showPopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить пользователя?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: showAcceptToast,
      reject: showRejectToast,
    });
  };

  // Функция для сброса состояния DialogInputObject
  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setSelectedUserID(null);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
  };

  const popUpContent = ({ message, acceptBtnRef, rejectBtnRef, hide }) => {
    return (
      <div className="border-round p-3">
        <span>{message}</span>
        <div className="flex align-items-center gap-2 mt-3">
          <Button
            ref={acceptBtnRef}
            outlined
            label="Да"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("accept", hide);
            }}
            className="p-button-sm p-button-outlined p-button-danger"
          ></Button>
          <Button
            ref={rejectBtnRef}
            label="Отменить"
            outlined
            severity="success"
            onClick={() => {
              handleConfirmPopUpButtonClick("reject", hide);
            }}
            className="p-button-sm p-button-text"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContent} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddUser}
        clearDialogInputObject={clearDialogInputObject}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditUser}
        clearDialogInputObject={clearDialogInputObject}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Пользователи</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          style={{ width: "90%" }}
          value={loading ? skeletonData : users}
          header={headerTemplate}
          showGridlines
          emptyMessage="Нет данных"
        >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="email" header="Почта"></Column>
          <Column field="role" header="Роль"></Column>
          <Column
            header="Действия"
            body={loading ? <Skeleton /> : actionButtonsTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Users;

const skeletonData = [
  {
    id: <Skeleton />,
    name: <Skeleton />,
    email: <Skeleton />,
    role: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    email: <Skeleton />,
    role: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    email: <Skeleton />,
    role: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    email: <Skeleton />,
    role: <Skeleton />,
  },
  {
    id: <Skeleton />,
    name: <Skeleton />,
    email: <Skeleton />,
    role: <Skeleton />,
  },
];
