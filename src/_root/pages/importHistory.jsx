import { useContext, useEffect, useState } from "react";
import { getImportedLeads } from "../../utilities/api";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { TitleContext } from "../../context/TitleContext";

function ImportHistory() {
  const [importedLeads, setImportedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const { setTitleModel } = useContext(TitleContext);

  // useEffect'ы для рендера, вывода логов

  useEffect(() => {
    setTitleModel("История импортов");

    renderImportedLeads();
  }, []);

  // Сеттер фильтра глобального поиска
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderImportedLeads = () => {
    getImportedLeads().then((response) => {
      setImportedLeads(response.data);
      setLoading(false);
    });
  };

  const headerTemplate = () => {
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

  return (
    <div className="flex flex-column align-items-center justify-content-center">
      <div
        className="flex justify-content-between my-5"
        style={{ width: "90%" }}
      >
        <h2 className="m-0">История импортов</h2>
      </div>
      <Card style={{ width: "90%" }}>
        <DataTable
          value={importedLeads}
          loading={loading}
          paginator
          header={headerTemplate}
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorPosition="top"
          filters={filters}
        >
          <Column field="id" header="ID"></Column>
          <Column field="offer_name" header="Оффер"></Column>
          <Column field="phone" header="Номер телефона"></Column>
          <Column field="full_name" header="Имя / Фамилия"></Column>
          <Column field="email" header="Почта"></Column>
          <Column field="geo" header="Гео"></Column>
          <Column field="funnel" header="Воронка"></Column>
        </DataTable>
      </Card>
    </div>
  );
}

export default ImportHistory;
