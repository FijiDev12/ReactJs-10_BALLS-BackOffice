// AppBar.js
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import moment from 'moment';
import { decryptData } from "../Utils"


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Topbar = ({ open, handleDrawerOpen }) => {
  const [ time, setTime ] = useState("");
  
  const queryParameters = new URLSearchParams(window.location.search)
  const session = queryParameters.get("u")
  const decryptedUsername = decryptData(session)

  setInterval(function() {
    setTime(moment().format('LLL'))
  }, 1000)

  return (
    <AppBar position="fixed" open={open} sx={{ display: 'flex', background: 'transparent' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
            paddingLeft: 2
          }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ flexGrow: 1 }} />
        <Typography className="appBarText" variant="subtitle1" noWrap component="div">
          Hello {decryptedUsername} || {time}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
