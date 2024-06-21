import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";

export default function PaginatorComponent({
  renderFunction,
  setLoading,
  first,
  setFirst,
  rows,
  setRows,
  page,
  setPage,
  totalRecords,
}) {
  useEffect(() => {
    if (page !== null) {
      renderFunction();
    }
  }, [page, rows]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
  };
  
  return (
    <div className="card">
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[20, 50, 100]}
        onPageChange={onPageChange}
      />
    </div>
  );
}
