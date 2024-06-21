import { createContext, useState } from "react";

export const SidebarContext = createContext(null);

export function SidebarArea({ children }) {
  const [sidebarModel, setSidebarModel] = useState(null);

  document.sidebar = sidebarModel;
  return (
    <SidebarContext.Provider value={{ sidebarModel, setSidebarModel }}>
      {children}
    </SidebarContext.Provider>
  );
}
