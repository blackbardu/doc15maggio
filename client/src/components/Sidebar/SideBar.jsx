import { NavLink } from "react-router-dom";
import { FaBars, FaHome} from "react-icons/fa";
import { BiMath, BiMoneyWithdraw } from "react-icons/bi";
import { TbCloudDataConnection } from 'react-icons/tb'
import { RxLetterCaseCapitalize } from 'react-icons/rx'
import { MdOutlineComputer } from 'react-icons/md'
import { GiCrucifix, GiGreekTemple } from 'react-icons/gi'
import { TbWeight } from 'react-icons/tb'
import { AiOutlineTranslation, AiFillCode } from "react-icons/ai";
import { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiAdminFill } from 'react-icons/ri'
import SidebarMenu from "./SidebarMenu";
import io from 'socket.io-client'
import { MyArrayContext } from '../MyArrayContext';
import './Sidebar.css'

const routes = [
  {
    path: "/main",
    name: "Dashboard",
    icon: <FaHome />,
    file: 'exclude',
    link: 'dashboard'
  },
  {
    path: "/coordinatore",
    name: "Coordinatore",
    icon: <RiAdminFill />,
    file: 'exclude',
    link: 'coordinatore'
  },
  {
    path: "/italiano",
    name: "Italiano",
    icon: <RxLetterCaseCapitalize />,
    file: 'italiano',
    link: 'italiano'
  },
  {
    path: "/storia",
    name: "Storia",
    icon: <GiGreekTemple />,
    file: 'storia',
    link: 'storia'
  },
  {
    path: "/inglese",
    name: "Inglese",
    icon: <AiOutlineTranslation />,
    file: 'inglese',
    link: 'inglese'
  },
  {
    path: "/matematica",
    name: "Matematica",
    icon: <BiMath />,
    file: 'matematica',
    link: 'matematica'
  },
  {
    path: "/informatica",
    name: "Informatica",
    icon: <AiFillCode />,
    file: 'informatica',
    link: 'informatica'
  },
  {
    path: "/sistemi",
    name: "Sistemi e reti",
    icon: <TbCloudDataConnection />,
    file: 'sistemi',
    link: 'sistemi'
  },
  {
    path: "/tpsit",
    name: "TPSIT",
    icon: <MdOutlineComputer />,
    file: 'tpsit',
    link: 'tpsit'
  },
  {
    path: "/gpoi",
    name: "GPOI",
    icon: <BiMoneyWithdraw />,
    file: 'gpoi',
    link: 'gpoi'
  },
  {
    path: "/religione",
    name: "Religione",
    icon: <GiCrucifix />,
    file: 'religione',
    link: 'religione'
  },
  {
    path: "/ginnastica",
    name: "Scienze motorie",
    icon: <TbWeight />,
    file: 'ginnastica',
    link: 'ginnastica'
  },
  
  /*{
    path: "/settings",
    name: "Settings",
    icon: <BiCog />,
    exact: true,
    subRoutes: [
      {
        path: "/settings/profile",
        name: "Profile ",
        icon: <FaUser />,
      },
      {
        path: "/settings/2fa",
        name: "2FA",
        icon: <FaLock />,
      },
      {
        path: "/settings/billing",
        name: "Billing",
        icon: <FaMoneyBill />,
      },
    ],
  },*/
  
];

const SideBar = ({ children }) => {
  const { myArray } = useContext(MyArrayContext);
  const filteredRoutes = routes.filter(
    (route) => route.link === 'dashboard' || myArray.includes(route.link)
  );

  const socket = io.connect('http://localhost:3001')

  const handleSidebarLinkClick = (pageName) => {
    if(pageName != 'exclude')
    {
      socket.emit('get_files', {pageName});
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  15 maggio
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.link === 'dashboard' || filteredRoutes.includes(route)) {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                  onClick={() => handleSidebarLinkClick(route.link)}
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            }})}
          </section>
        </motion.div>

        <main className="w-100">{children}</main>
      </div>
    </>
  );
};

export default SideBar;
