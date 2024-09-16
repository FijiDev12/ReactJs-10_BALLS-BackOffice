// Drawer.js
import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../Utils';


const drawerWidth = 240;

const drawerItems = [
  { text: 'Game Info', icon: <InfoIcon /> },
  { text: 'System Admin', icon: <AdminPanelSettingsIcon /> },
  { text: 'Game Admin', icon: <SportsSoccerIcon /> },
  { text: 'Game History', icon: <HistoryIcon /> },
  { text: 'Cash IN/OUT', icon: <LocalAtmIcon /> },
  { text: 'User Listing', icon: <PeopleIcon /> },
  { text: 'Agent Listing', icon: <PeopleIcon /> },
  { text: 'Cashiers', icon: <PeopleIcon /> },
  { text: 'Cash Reports', icon: <PriceChangeIcon /> },
  { text: 'Sign-Out', icon: <ExitToAppIcon /> },
  { text: 'Log-Out', icon: <ExitToAppIcon /> },
];

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ open, handleDrawerClose }) => {


  const queryParameters = new URLSearchParams(window.location.search)
  const sessionId = queryParameters.get("d")
  const roleName = queryParameters.get("r")
  const username = queryParameters.get("u")


  const theme = useTheme();
  const navigate = useNavigate();

  const filteredItemsInDrawer = drawerItems.filter(item => {
    if (decryptData(roleName) === "System Administrator" ) {
      return [ "System Admin", "Game History", "User Listing", "Cash Reports", "Sign-Out"].includes(item.text)
    }
    else if (decryptData(roleName) === "Chamber One ( Game Admin )") {
      return [ "Game Admin", "Game History", "Sign-Out" ].includes(item.text)
    }
    else if (sessionStorage.getItem("F10_Data$0788") === "6") {
      return [ "Game Info", "Game History", "User Listing", "Cash Reports", "Log-Out" ].includes(item.text)
    }
    else if (sessionStorage.getItem("F10_Data$0788") === "7") {
      return [ "Cash IN/OUT", "Agent Listing","Log-Out" ].includes(item.text)
    }
  })


  const handleListItemClick = (text) => {
    let rightRoute = ""

    switch (text) {
      case "Game History":
        if ( decryptData(roleName) === "System Administrator" ) {
          rightRoute = "historyTableOne";
        } else if ( decryptData(roleName) === "Chamber One ( Game Admin )" ) {
          rightRoute = "historyTableOne";
        } else if ( sessionStorage.getItem("F10_Data$0788") === "6" ) {
          rightRoute = "OPhistorytable";
        }
        break;
      case 'Game Info':
        rightRoute = "gameInfo"
        break;
      case 'System Admin':
        rightRoute = "systemAdminpage"
        break;
      case 'Game Admin':
        rightRoute = "gameTableOne"
        break;
      case 'User Listing':
        if ( decryptData(roleName) === "System Administrator" ) {
          rightRoute = "admin-Users";
        } else if ( sessionStorage.getItem("F10_Data$0788") === "6" ) {
          rightRoute = "user/cashierOP";
        }
        break;
      case 'Cash Reports':
        if ( decryptData(roleName) === "System Administrator" ) {
          rightRoute = "transcReports";
        } else if ( sessionStorage.getItem("F10_Data$0788") === "6" ) {
          rightRoute = "transcReportsOP";
        }
        break;
      case 'Cash IN/OUT':
        rightRoute = "cashierManagement"
        break;
      case 'Agent Listing':
        rightRoute = "user/agentOP"
        break;
      case 'Sign-Out':
        navigate('/sign-out')
        return;
      case 'Log-Out':
        navigate('/log-out')
        return;
        default:
        break;
    }

    navigate(`/${rightRoute}?d=${encodeURIComponent(sessionId)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`)

  }


  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">
          BALL BACK OFFICE
        </Typography>
        <IconButton sx={{ color: "white" }} onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {filteredItemsInDrawer.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleListItemClick(item.text)}>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: "white" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

