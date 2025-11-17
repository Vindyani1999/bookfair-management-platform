import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import MapIcon from "@mui/icons-material/Map";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { styled, type CSSObject, type Theme } from "@mui/material";
import type { DrawerItem } from "../../types/index";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmationModal from "../molecules/LogoutConfirmationModal";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const drawerData: DrawerItem[] = [
  {
    name: "Bookings",
    icon: <DateRangeOutlinedIcon />,
    navPath: "/bookings",
  },
  {
    name: "Manage Maps",
    icon: <MapIcon />,
    navPath: "/manage-maps",
  },
  {
    name: "Manage Stalls",
    icon: <StorefrontOutlinedIcon />,
    navPath: "/manage-stalls",
  },
  {
    name: "Manage Admins",
    icon: <AdminPanelSettingsIcon />,
    navPath: "/manage-admins",
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
  backgroundColor: "#C9D8DA",
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
  backgroundColor: "#C9D8DA",
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
  const [open, setOpen] = React.useState<boolean>(() => {
    const v = localStorage.getItem("drawerOpen");
    if (v === "false") return false;
    return true;
  });
  const [isOpneFullDash, setIsOpnetFullDash] = React.useState<boolean>(() => {
    const v = localStorage.getItem("drawerFull");
    if (v === "true") return true;
    return true;
  });
  const [selectedTab, setSelectedTab] = React.useState(
    localStorage.getItem("tabMemory") || "Bookings"
  );

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("drawerOpen", "true");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("drawerOpen", "false");
  };

  const handleDrawerVariation = () => {
    if (isOpneFullDash) {
      handleDrawerClose();
      setIsOpnetFullDash(false);
      localStorage.setItem("drawerFull", "false");
    } else {
      handleDrawerOpen();
      setIsOpnetFullDash(true);
      localStorage.setItem("drawerFull", "true");
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
            width: "90%",
            m: 1,
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
                        selectedTab === text.name ? "#C9D8DA" : "#EDF1F3",
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
                      fontWeight: 800,
                      color: "#000000",
                      fontFamily: "Roboto Slab",
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
          // match the app's stepper/background so the toolbar spacer isn't white
          backgroundColor: "#C9D8DA",
          // make the main area fill the viewport and prevent page scrolling
          height: "100vh",
          overflow: "hidden",
          // shift the main content to the right when drawer opens/closes
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: open
            ? `${drawerWidth}px`
            : `calc(${theme.spacing(7)} + 1px)`,
        })}
      >
        {/* Removed the DrawerHeader spacer here so pages (like the stepper) can render flush at the top */}
        <Outlet />
      </Box>
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        // userName={admin?.contactPerson || 'Admin'}
      />
    </div>
  );
}
