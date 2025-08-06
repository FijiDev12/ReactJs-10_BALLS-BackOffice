import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, TextField, CssBaseline,SpeedDialAction , Button, Typography, SpeedDialIcon , SpeedDial , ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { decryptData } from "../Utils"
import api from "../Api/marble_ten"
import Swal from 'sweetalert2';
import { Chart } from 'primereact/chart';
import QRcode from '../components/QRcode';


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

// const BlackSpeedDial = styled(SpeedDial)(({ theme }) => ({
//   '&.MuiSpeedDial-root': {
//     color: '#fff', // White text
//   },
// }));

// const BlackSpeedDialAction = styled(SpeedDialAction)(({ theme }) => ({
//   '&.MuiSpeedDialAction-fab': {
//     backgroundColor: '#000', // Black background
//     color: '#fff', // White icon
//   },
// }));

// const actions = [
//   { icon: <Diversity3Icon />, name: '10-Days average Players' },
//   { icon: <AttachMoneyIcon />, name: '10-Days average Bet' },
//   { icon: <MoneyOffIcon />, name: '10-Days average PayOut' }
// ];


function SystemAdminPage() {


    const navigate = useNavigate()

    const [open, setOpen] = useState(true);
    const queryParameters = new URLSearchParams(window.location.search)
    const session = queryParameters.get("d")
    const sessionUsing = decryptData(session)

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [ operator_name, setoperator_name ] = useState("")
    const [ operator_location, setoperator_location ] = useState("")
    const [ operator_contact_no, setoperator_contact_no ] = useState("")
    const [ first_name, setfirst_name ] = useState("")
    const [ middle_name, setmiddle_name ] = useState("")
    const [ last_name, setlast_name ] = useState("")
    const [ operator_id, setoperator_id ] = useState("")

    const [ avgBet, setAvgBet ] = useState("")
    const [ avgWin, setAvgWin ] = useState("")
    const [ avgPlayers, setAvgPlayers ] = useState("")


    const globalApi = process.env.REACT_APP_LOCAL_URL

    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    useEffect (() => {
      api.get(`${globalApi}/API/F10/adminLoginSession?SessionID=${sessionUsing}`)
      .then((res) => {
        if (res.data.data[0].RoleName === "" || res.data.data[0].Username === ""){
          Swal.fire({
            title: "ACCOUNT LOGGED IN TO ANOTHER DEVICE!",
            text: "Click OK to Sign Out",
            icon: "warning",
            confirmButtonText: "OK",
            allowOutsideClick: false
          })
          .then((result) => {
              if (result.isConfirmed){
                  navigate("/sign-out")
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

    // console.log("Ten days ago:", formattedTenDaysAgo);
    // console.log("Today:", formattedToday);


    useEffect (() => {
      api.get(`${globalApi}/API/F10/getplayersdetailsbydaterange?GameIdx=1&DateFrom=${formattedTenDaysAgo}&DateTo=${formattedToday}`)
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
      api.get(`${globalApi}/API/F10/playersjournalselsummarypergamesa?GameIdx=1&Counter=10`)
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

   // OPERATOR REGISTRATION

   const operatorRegistration = () => {
    setLoading(true);
    api.post(`${globalApi}/API/F10/insoperator`, {
        operator_name: operator_name,
        operator_location: operator_location,
        operator_contact_no: operator_contact_no,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        operator_id: operator_id
    })
    .then((res) => {
        console.log(res.data.data)
        if(res.data.data[0].responseCode === "0") {
            Swal.fire({
                title: "ACCOUNT CREATED",
                icon: "success",
                confirmButtonText: "OK",
            })
            .then((result) => {
                if (result.isConfirmed){
                    window.location.reload()
                }
            })

        } else if (res.data.data[0].responseCode === "-1"){
            Swal.fire({
                title: "Operator name already exists",
                icon: "error",
                confirmButtonText: "OK",
                allowOutsideClick: false
            })
            .then((result) => {
                if (result.isConfirmed){
                    window.location.reload()
                }
            })
        } else if (res.data.data[0].responseCode === "-2"){
            Swal.fire({
                title: "Operator ID already exists",
                icon: "error",
                confirmButtonText: "OK",
                allowOutsideClick: false
            })
            .then((result) => {
                if (result.isConfirmed){
                    window.location.reload()
                }
            })
        } else if (res.data.data[0].responseCode === "-3"){
            Swal.fire({
                title: "Operator contact no. already exists",
                icon: "error",
                confirmButtonText: "OK",
                allowOutsideClick: false
            })
            .then((result) => {
                if (result.isConfirmed){
                    window.location.reload()
                }
            })
        }

    })
    .catch((err) => {
        console.log(err)
    })
    .finally(() => {
        setLoading(false)
    })
}

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center" }} open={open}>
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
              <Stack>
              <Box>
              <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "90%" }} container spacing={2}>
              <Stack  sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "90%" }} spacing={.1}>
                <Typography variant='h5'>OPERATOR REGISTRATION</Typography>
                <Typography variant='subtitle2'>Fill this form carefully </Typography>
              </Stack>
              <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR NAME" 
                    id="fullWidth1" variant='filled' 
                    color='success' 
                    focused
                    value={operator_name}
                    onChange={(e) => setoperator_name(e.target.value)}
                />
              </Grid>
              <Grid  item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR LOCATION" 
                    id="fullWidth2" variant='filled' 
                    color='success' 
                    focused
                    value={operator_location}
                    onChange={(e) => setoperator_location(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="MOBILE NUMBER" 
                    id="fullWidth3" variant='filled' 
                    color='success' 
                    focused
                    value={operator_contact_no}
                    onChange={(e) => setoperator_contact_no(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR FIRST NAME" 
                    id="fullWidth4" variant='filled' 
                    color='success' 
                    focused
                    value={first_name}
                    onChange={(e) => setfirst_name(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR MIDDLE NAME" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={middle_name}
                    onChange={(e) => setmiddle_name(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR LAST NAME" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={last_name}
                    onChange={(e) => setlast_name(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR ID" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={operator_id}
                    onChange={(e) => setoperator_id(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Button onClick={operatorRegistration} sx={{ width: "100%", color: "white", fontWeight: "bolder" }} color='success'  variant='outlined'>SUBMIT</Button>
              </Grid>
              </Grid>
              </Box>
              </Stack>
          </Grid>
        </Grid>
        {/* <Box sx={{ height: "100vh", transform: 'translateZ(0px)', flexGrow: 1 }}>
          <BlackSpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 20, right: 50 }}
            icon={<SettingsSuggestIcon />}
          >
            {actions.map((action) => (
              <BlackSpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </BlackSpeedDial>
        </Box> */}
    </Main>
  </Box>
  )
}

export default SystemAdminPage