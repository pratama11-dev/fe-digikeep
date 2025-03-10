import { BarChartOutlined, HomeOutlined, OrderedListOutlined } from "@ant-design/icons";
import { routesType } from "types/Sidebar";
import { MdOutlinePayments } from "react-icons/md";
import { SlNotebook } from "react-icons/sl";
import { FaTicketAlt } from "react-icons/fa";

// eslint-disable-next-line import/prefer-default-export


export const AdminRoutes: routesType = [
  {
    path: "/",
    key: "home",
    name: "Home",
    icon: <HomeOutlined rev="label" />,
    children: [],
  },
  {
    path: "/document",
    key: "document",
    name: "Document",
    icon: <SlNotebook />,
    children: [],
  },
  {
    path: "/categories-document",
    key: "categories-document",
    name: "Categories Document",
    icon: <SlNotebook />,
    children: [],
  },
  {
    path: "/users",
    key: "users",
    name: "Users",
    icon: <SlNotebook />,
    children: [],
  },
];
