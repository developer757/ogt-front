// import { Ripple } from "primereact/Ripple";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";
import { UserContext } from "../context/UserContext";

function SidebarLink({ handleHide, link }) {
  const { sidebarModel, setSidebarModel } = useContext(SidebarContext);
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    if (link.to === "/login") {
      setUserData(null);
      localStorage.removeItem("userData");
    }

    
    handleHide();
    setSidebarModel(link);
    navigate(`${link.to}`);
  };

  if (userData.role === "Buyer" && link.adminOnly) {
    return "";
  }

  return (
    <li>
      <div
        onClick={() => handleLinkClick(link)}
        className={
          sidebarModel == link
            ? "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 surface-100 transition-duration-150 transition-colors w-full no-underline"
            : "p-ripple flex align-items-center cursor-pointer py-3 px-5 text-700 hover:surface-100 transition-duration-150 transition-colors w-full no-underline"
        }
      >
        <i className={`pi ${link.icon} mr-2`}></i>
        <span className="text-lg font-medium">{link.name}</span>
        {/* <Ripple /> */}
      </div>
    </li>
  );
}

export default SidebarLink;
