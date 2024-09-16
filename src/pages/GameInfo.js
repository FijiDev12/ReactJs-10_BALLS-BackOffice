import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, TextField, CssBaseline,InputAdornment, Button, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { decryptData } from "../Utils"
import api from "../Api/F10"
import Swal from 'sweetalert2';
import { Chart } from 'primereact/chart';
import QRcode from '../components/QRcode';
import QRcode2 from '../components/QRcode2';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

function GameInfo() {


    const navigate = useNavigate()

    const [open, setOpen] = useState(true);
    const queryParameters = new URLSearchParams(window.location.search)
    const session = queryParameters.get("d")
    const sessionUsing = decryptData(session)

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [ first_name, setfirst_name ] = useState("")
    const [ middle_name, setmiddle_name ] = useState("")
    const [ last_name, setlast_name ] = useState("")
    const [ cashier_contact_no, setcashier_contact_no ] = useState("")
    const [ passhash, setpasshash ] = useState("")

    const [ avgBet, setAvgBet ] = useState("")
    const [ avgWin, setAvgWin ] = useState("")
    const [ avgPlayers, setAvgPlayers ] = useState("")


    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    useEffect (() => {
      api.get(`${process.env.REACT_APP_F10_URL}/API/F10/inscashierloginbysession?session_token=${sessionUsing}`)
      .then((res) => {
        if (res.data.data[0].username === "" || res.data.data[0].cashierId === ""){
          Swal.fire({
            title: "ACCOUNT LOGGED IN TO ANOTHER DEVICE!",
            text: "Click OK to Sign Out",
            icon: "warning",
            confirmButtonText: "OK",
            allowOutsideClick: false
          })
          .then((result) => {
              if (result.isConfirmed){
                  navigate("/log-out")
              }
          })
        }
      })
    }, [])


    const today = new Date();
    today.setHours(23, 59, 59);

    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);

    const formattedToday = today.toISOString().split('T')[0] + ' 23:59:59';
    const formattedTenDaysAgo = tenDaysAgo.toISOString().split('T')[0] + ' 00:00:00';

    // console.log(formattedTenDaysAgo)
    // console.log(formattedToday)


    useEffect (() => {
      api.get(`${process.env.REACT_APP_F10_URL}/API/F10/getplayersdetailsbydaterange?GameIdx=1&DateFrom=${formattedTenDaysAgo}&DateTo=${formattedToday}`)
      .then((res) => {
        console.log(res.data.data)
        setAvgBet(res.data.data[0].TotalAverageBets)
        setAvgWin(res.data.data[0].TotalAverageWins)
        setAvgPlayers(res.data.data[0].TotalAveragePlayers)
      })
    }, [])

    
    useEffect(() => {
      const refreshPage = () => {
        window.location.reload(true);
      };
      const intervalId = setInterval(refreshPage, 60000);

      return () => clearInterval(intervalId);
    }, []);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      api.get(`${process.env.REACT_APP_F10_URL}/API/F10/playersjournalselsummarypergamesa?GameIdx=1&Counter=10`)
      .then((res) => {
        const extractedData = res.data.data
        const labels = extractedData.map((entries) => entries.RoundId.split('-')[0].toUpperCase())

        const datasets = [
          {
            label: 'TOTAL GROSS BET IN LAST 10 ROUNDS',
            data: extractedData.map((entry) => entry.TotalBet),
            fill: false,
            borderColor: "#5FCC9C",
            backgroundColor: "white",
            tension: 0.4,
          },
          {
            label: 'TOTAL PAYOUT IN LAST 10 ROUNDS',
            data: extractedData.map((entry) => entry.TotalWin),
            fill: false,
            borderColor: "#FF1E1E",
            backgroundColor: "white",
            tension: 0.4,
          },
        ];

        const formattedData = {
          labels: labels,
          datasets: datasets,
        };

        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  
  
      const options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: "white"
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: "white"
                  },
                  grid: {
                      color: "white"
                  }
              },
              y: {
                  ticks: {
                      color: "white"
                  },
                  grid: {
                      color: "white"
                  }
              }
          }
      };
      setChartOptions(options);
    }, []);


  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center"}} open={open}>
        <Grid sx={{  color: "white", width: "100vw" }} container spacing={2}>
        <Grid sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }} item xs={12} md={8} lg={8}>
              <Stack spacing={.5} sx={{ width: "100%" }}>
                <Paper className='paperBG' sx={{ paddingY: 5, paddingX: 5 }}>
                  <Box sx={{ color: "white", paddingBottom: "1rem" }}>
                    <Typography variant='h6'>Over the past ten days, the average figures are as follows:</Typography>
                  </Box>
                <Box sx={{ color: "white"}}>
                  <Stack spacing={.5}>
                  <Typography>The average total of gross bets stands at &#8369; <strong>{typeof avgBet === 'number' ? avgBet.toFixed(2) : 'N/A'}</strong></Typography>
                  <Typography>The average total of gross payouts is &#8369; <strong>{typeof avgWin === 'number' ? avgWin.toFixed(2) : 'N/A'}</strong></Typography>
                  <Typography>The average number of players who placed bets is <strong>{typeof avgPlayers === 'number' ? avgPlayers.toFixed(2) : 'N/A'}</strong> players</Typography>
                  </Stack>
                </Box>
              </Paper>
              <Chart style={{ width: "100%" }}  type="line" data={chartData} options={chartOptions} />
            </Stack>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} item xs={12} md={4} lg={4}>
            <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} container>
              <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} item xs={12} md={12} lg={6}>
                <QRcode/>
              </Grid>
              <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} item xs={12} md={12} lg={6}>
                <QRcode2/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    </Main>
  </Box>
  )
}

export default GameInfo