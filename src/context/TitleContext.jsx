import { createContext, useState } from "react";

export const TitleContext = createContext(null);

export function TitleArea({ children }) {
  const [titleModel, setTitleModel] = useState(null);

  document.title = titleModel;
  return (
    <TitleContext.Provider value={{ titleModel, setTitleModel }}>
      {children}
    </TitleContext.Provider>
  );
}
