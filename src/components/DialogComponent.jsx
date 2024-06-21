import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch";
import { Password } from "primereact/password";

export const DialogComponent = ({
  type,
  isDialogVisible,
  setIsDialogVisible,
  leadDialogType,
  setLeadDialogType,
  header,
  inputs,
  dialogInputObject,
  setDialogInputObject,
  clearDialogInputObject,
  handleAdd,
  handleEdit,
  formatCalendarDate,
  formatCalendarTime,
}) => {
  const handleDialogInputChange = (field, value) => {
    setDialogInputObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    
  };
  
  return (
    <Dialog
      header={header}
      visible={isDialogVisible}
      resizable={false}
      draggable={false}
      onHide={() => {
        setIsDialogVisible(false);
        clearDialogInputObject();
      }}
      className={`w-full ${
        type.includes("lead") || type.includes("offer") ? "" : "max-w-25rem"
      } min-w-25rem`}
      style={{ maxWidth: "700px" }}
      content={({ hide }) => (
        <>
          <div className="p-dialog-header">
            <div className="p-dialog-title">{header}</div>
            <div className="p-dialog-header-icons flex gap-3">
              {type === "lead" ? (
                <Button
                  icon="pi pi-pencil"
                  text
                  severity="success"
                  disabled={leadDialogType === "edit-lead"}
                  onClick={() =>
                    setLeadDialogType(
                      leadDialogType === "post-lead" ? "edit-lead" : "post-lead"
                    )
                  }
                />
              ) : (
                ""
              )}
              <Button
                icon="pi pi-times"
                text
                severity="success"
                onClick={(e) => hide(e)}
              />
            </div>
          </div>

          <div
            className={`${
              type.includes("lead") || type.includes("offer")
                ? "p-dialog-content w-full flex flex-wrap gap-3 justify-content-center"
                : "p-dialog-content flex flex-column gap-4 "
            }`}
          >
            {inputs.map((input, index) => {
              return (
                <div
                  className="w-full flex flex-column gap-2"
                  key={index}
                  style={
                    type.includes("lead") || type.includes("offer")
                      ? { maxWidth: "calc(50% - 0.5rem)" }
                      : {}
                  }
                >
                  <h4 className="m-0">{input.label}</h4>
                  {input.type === "text" ? (
                    <InputText
                      value={dialogInputObject[input.key]}
                      onChange={(e) =>
                        handleDialogInputChange(input.key, e.target.value)
                      }
                      style={{ width: "100%" }}
                      placeholder={input.placeholder}
                      disabled={
                        leadDialogType === "post-lead" || input.disabled
                      }
                    />
                  ) : input.type === "password" ? (
                    <Password
                      value={
                        input.confirmedPassword
                          ? input.confirmedPassword
                          : dialogInputObject[input.key]
                      }
                      onChange={(e) =>
                        input.setConfirmedPassword
                          ? input.setConfirmedPassword(e.target.value)
                          : handleDialogInputChange(input.key, e.target.value)
                      }
                      style={{ width: "100%" }}
                      placeholder={input.placeholder}
                      toggleMask
                      feedback={false}
                    />
                  ) : input.type === "dropdown" ? (
                    <Dropdown
                      value={dialogInputObject[input.key]}
                      onChange={(e) => {
                        
                        
                        input.setDropdownValue
                          ? input.setDropdownValue(e.value)
                          : handleDialogInputChange(input.key, e.value);
                      }}
                      options={input.options}
                      placeholder={input.placeholder}
                      className="w-full"
                      disabled={
                        leadDialogType === "post-lead" || input.disabled
                      }
                    />
                  ) : input.type === "calendar" ? (
                    <Calendar
                      locale="ru"
                      value={
                        input.key === "offer_start" || input.key === "offer_end"
                          ? formatCalendarTime(
                              dialogInputObject[input.key],
                              "to Date"
                            )
                          : formatCalendarDate(
                              dialogInputObject[input.key],
                              "to Date"
                            )
                      }
                      onChange={(e) => {
                        input.key === "offer_start" || input.key === "offer_end"
                          ? handleDialogInputChange(
                              input.key,
                              formatCalendarTime(e.value, "to string")
                            )
                          : handleDialogInputChange(
                              input.key,
                              formatCalendarDate(e.value, "to string")
                            );
                      }}
                      {...(input.key === "offer_start" ||
                      input.key === "offer_end"
                        ? { timeOnly: true }
                        : { dateFormat: "dd-mm-yy" })}
                      placeholder={input.placeholder}
                      disabled={
                        leadDialogType === "post-lead" || input.disabled
                      }
                    />
                  ) : input.type === "multiselect" ? (
                    <MultiSelect
                      value={dialogInputObject[input.key]}
                      onChange={(e) => {
                        handleDialogInputChange(input.key, e.value);
                      }}
                      options={input.options}
                      filter
                      maxSelectedLabels={3}
                      className="w-full"
                      placeholder={input.placeholder}
                    />
                  ) : input.type === "switch" ? (
                    <InputSwitch
                      checked={Boolean(dialogInputObject[input.key])}
                      onChange={(e) => {
                        handleDialogInputChange(input.key, Number(e.value));
                      }}
                    />
                  ) : input.type === "button" ? (
                    <Button
                      style={{ width: "fit-content" }}
                      label={input.placeholder}
                      onClick={input.onClick}
                    />
                  ) : (
                    <span>Другой тип input</span>
                  )}
                </div>
              );
            })}
            <div
              className="flex align-items-end w-full"
              style={{ maxWidth: "calc(50% - 0.5rem)" }}
            >
              <Button
                label={
                  type.includes("add")
                    ? "Добавить"
                    : type.includes("edit") ||
                      (type === "lead" && leadDialogType === "edit-lead")
                    ? "Редактировать"
                    : "Отправить"
                }
                onClick={() =>
                  type.includes("add") || leadDialogType === "post-lead"
                    ? handleAdd(dialogInputObject)
                    : type.includes("edit") || leadDialogType === "edit-lead"
                    ? handleEdit(dialogInputObject)
                    : null
                }
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    ></Dialog>
  );
};
