"use client";
import { Inter } from "next/font/google";
// import "./globals.css";
import React, { createContext, useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";

// import { useRouter } from "next/navigation";
const SelectedPageContext = createContext();
const inter = Inter({ subsets: ["latin"] });
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { getData } from "@/hook/Hook";
import { mnu } from "@/components/menu";
import Link from "next/link";

const category = {
  NEWSKY: "home",
  "Sản xuất": "produce",
  "Kinh doanh": "business",
  Kho: "storage",
  "Vật tư": "products",
  "Mua hàng": "purchase",
  "Kế toán": "accountancy",
  "Nhân sự": "humanResources",
};
const settings = ["Thông tin", "Đổi mật khẩu", "Đăng xuất"];
const drawerWidth = 270;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function regularLayout({ children }) {
  const [categoriesChild, setCategoriesChild] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCateClick = (key) => {
    const value = category[key];
    window.location.href = "/" + value;
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Adjust "/your-service-url" to the specific endpoint you need to hit
  //       const serviceURL = "/product-service/category";
  //       const result = await getData(serviceURL);
  //       setCategoriesChild(result); // Update your state with the fetched data
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };

  //   fetchData(); // Call the async function
  // }, []); // Empty dependency array ensures this effect runs only once
  //Xây dựng sidebar category
  const pathname = usePathname();
  let pathname1 = pathname.split("/");
  let pathSplit = pathname1[1];
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  function getChildCategories(categoryName, data) {
    const category = data?.find((item) => item.catName === categoryName);

    if (!category) {
      return []; // Category not found
    }

    const children = data.filter((item) => item.isChildOf === category.id);
    let result = [...children];

    // children.forEach((child) => {
    //   const subChildren = getChildCategories(child.catName, data);
    //   result = [...result, ...subChildren];
    // });

    return result;
  }

  const categoriesAfterFilter = getChildCategories(
    getKeyByValue(category, pathSplit),
    categoriesChild
  );

  function titleCategory(mnu, pathSplit) {
    return mnu[pathSplit];
  }
  const titleCategoryList = titleCategory(mnu, pathSplit);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            key={"home"}
            onClick={() => handleCateClick("NEWSKY")}
            sx={{
              fontSize: 24,
              color: "white",
              display: "block",
              fontWeight: 700,
            }}
          >
            NEWSKY
          </Button>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              mx: 4,
            }}
          >
            {Object.keys(category)
              .slice(1)
              .map((key) => (
                <Button
                  key={key}
                  onClick={() => handleCateClick(key)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontWeight: 700,
                    letterSpacing: -0.5,
                    mx: 1,
                  }}
                >
                  {key}
                </Button>
              ))}
          </Box>
          <Badge badgeContent={4} color="success" style={{ marginRight: 20 }}>
            <NotificationsIcon style={{ color: "white" }} />
          </Badge>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {titleCategoryList.map((cate, index) => (
            <ListItem key={cate.link} disablePadding sx={{ display: "block" }}>
              <Link href={cate.link} style={{ textDecoration: "none" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    color: "black",
                  }}
                >
                  <Tooltip title={cate.title} placement="right-start">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "none",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={cate.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* <List>
              {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "664px" }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
