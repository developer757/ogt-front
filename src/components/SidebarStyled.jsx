import { Sidebar } from "primereact/sidebar";
// import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/styleclass";

import { sidebarLinks } from "../utilities/renderSidebarLinks";
import SidebarLink from "./SidebarLink";
import { useRef, useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { UserContext } from "../context/UserContext";

function SidebarStyled({ visible, setVisible, theme }) {
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const { sidebarModel, setSidebarModel } = useContext(SidebarContext); // Access active link from context

  const { userData } = useContext(UserContext);

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => handleHide()}
      content={({ closeIconRef, hide }) => (
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-center px-3 py-5 flex-shrink-0">
            <img src="/assets/images/logo.svg" width={200} />
          </div>
          <div className="overflow-y-auto">
            <ul className="list-none p-0 m-0">
              {sidebarLinks.map((link, index) => {
                if (link.adminOnly && userData.role === "Buyer") {
                  return "";
                }
                if ("links" in link) {
                  const isOpen =
                    sidebarModel && link.links.some((l) => l === sidebarModel); // Check if active link is within dropdown

                  return (
                    <li key={index} className="w-full">
                      <StyleClass
                        nodeRef={
                          link.name === "Лиды"
                            ? btnRef1
                            : link.name === "Инструменты"
                            ? btnRef2
                            : btnRef3
                        }
                        selector="@next"
                        enterClassName="hidden"
                        enterActiveClassName="slidedown"
                        leaveToClassName="hidden"
                        leaveActiveClassName="slideup"
                        initialClassName={isOpen ? "show" : "hidden"} // Set initial visibility based on activeLink
                      >
                        <a
                          ref={
                            link.name === "Лиды"
                              ? btnRef1
                              : link.name === "Инструменты"
                              ? btnRef2
                              : btnRef3
                          }
                          className="p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                        >
                          <i className="pi pi-chart-line mr-2"></i>
                          <span className="font-medium text-lg">
                            {link.name}
                          </span>
                          <i className="pi pi-chevron-down ml-auto mr-1"></i>
                          {/* <Ripple /> */}
                        </a>
                        <ul
                          className={`list-none py-0 pl-0 pr-0 m-0 overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out ${
                            isOpen ? "show" : "hidden"
                          }`}
                        >
                          {link.links.map((link, index) => (
                            <SidebarLink
                              key={index}
                              link={link}
                              handleHide={handleHide}
                            />
                          ))}
                        </ul>
                      </StyleClass>
                    </li>
                  );
                }
                return (
                  <SidebarLink
                    key={index}
                    link={link}
                    handleHide={handleHide}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      )}
    />
  );
}

export default SidebarStyled;
