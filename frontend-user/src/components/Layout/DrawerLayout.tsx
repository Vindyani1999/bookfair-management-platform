import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { styled, type CSSObject, type Theme } from "@mui/material";
import type { DrawerItem } from "../../utils/types";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmationModal from "../molecules/LogoutConfirmationModal";

const drawerWidth = 240;

const drawerData: DrawerItem[] = [
  {
    name: "Dashboard",
    icon: <DashboardOutlinedIcon />,
    navPath: "/dashboard",
  },
  {
    name: "Your Bookings",
    icon: <DateRangeOutlinedIcon />,
    navPath: "/bookings",
  },
  {
    name: "Help",
    icon: <TelegramIcon />,
    navPath: "/help",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    navPath: "/settings",
  },
  {
    name: "Logout",
    icon: <LogoutOutlinedIcon />,
    navPath: "",
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#DACDC9",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#DACDC9",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: (props: { open?: boolean }) => props.open,

      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: (props: { open?: boolean }) => !props.open,

      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function DrawerLayout() {
  const [open, setOpen] = React.useState(false);
  const [isOpneFullDash, setIsOpnetFullDash] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(
    localStorage.getItem("tabMemory") || "Your Bookings"
  );

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (
      location.pathname === "" ||
      location.pathname === "/" ||
      location.pathname === ""
    ) {
      navigate("/bookings", { replace: true });
      setSelectedTab("Your Bookings");
      return;
    }

    const matched = drawerData.find((d) => d.navPath === location.pathname);
    if (matched) {
      setSelectedTab(matched.name);
      localStorage.setItem("tabMemory", matched.name);
    }
  }, [location.pathname, navigate]);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerVariation = () => {
    if (isOpneFullDash) {
      handleDrawerClose();
      setIsOpnetFullDash(false);
    } else {
      handleDrawerOpen();
      setIsOpnetFullDash(true);
    }
  };

  const handleTabClick = (text: DrawerItem) => {
    if (text.name === "Logout") {
      setShowLogoutModal(true);
      return;
    }

    setSelectedTab(text.name);
    localStorage.setItem("tabMemory", text.name);
    if (text.navPath) {
      navigate(text.navPath);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div>
      <Drawer variant="permanent" open={open}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            m: 0,
            bgcolor: "#EDF1F3",
            borderRadius: "30px",
            boxShadow: "5px 5px 8px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <DrawerHeader>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                mb: 7,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: isOpneFullDash === false ? "center" : "end",
                  mt: 2,
                  p: 1,
                }}
              >
                <IconButton onClick={handleDrawerVariation} sx={{ width: 5 }}>
                  {isOpneFullDash === false ? (
                    <ArrowForwardOutlinedIcon />
                  ) : (
                    <ArrowBackOutlinedIcon />
                  )}
                </IconButton>
              </Box>
              {isOpneFullDash ? (
                <img src="/images/black_logo.png" alt="Logo" style={{}} />
              ) : (
                <ImportContactsOutlinedIcon sx={{ ml: 1 }} />
              )}
            </Box>
          </DrawerHeader>
          <List>
            {drawerData.map((text) => (
              <ListItem
                key={text.name}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      bgcolor:
                        selectedTab === text.name ? "#DACDC9" : "#EDF1F3", // hardcoded
                      borderRadius: "0px 30px 30px 0px",
                      mr: 1,
                    },
                    open
                      ? {
                        justifyContent: "initial",
                      }
                      : {
                        justifyContent: "center",
                      },
                  ]}
                  onClick={() => handleTabClick(text)}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                        color: "#000000",
                      },
                      open
                        ? {
                          mr: 3,
                        }
                        : {
                          mr: "auto",
                        },
                    ]}
                  >
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text.name}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      color: "#000000", // hardcoded
                      fontFamily: "Roboto Slab", //hardcoded
                    }}
                    sx={[
                      open
                        ? {
                          opacity: 1,
                        }
                        : {
                          opacity: 0,
                        },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={(theme: Theme) => ({
          flexGrow: 1,
          backgroundColor: "#DACDC9",
          height: "100vh",
          overflow: "hidden",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: open
            ? `${drawerWidth}px`
            : `calc(${theme.spacing(7)} + 1px)`,
        })}
      >
        <Box
          className="page-root"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            "& > :first-of-type": {
              position: "sticky",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              zIndex: 1100,
              transform: "translateZ(0)",
            },
            "& > :not(:first-of-type)": {
              flex: 1,
              overflowX: "auto",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.contactPerson || "User"}
      />
    </div>
  );
}
