import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, TableContainer, Typography, Table, TableRow, Button, TableHead, TableBody, TextField } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled} from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import dayjs from 'dayjs';
import api from "../Api/F10"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../Utils';


const drawerWidth = 240;

const StyledDateTimePicker = styled(DateTimePicker)({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Change this to the desired border color
      },
    },
  });

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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.white,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        background: 'linear-gradient(to bottom left, #0D0E38 100%, #2B0202 100%)',
    },
    '&:nth-of-type(even)': {
      background: 'linear-gradient(to bottom left, #0D0E38 100%, #2B0202 100%)'
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  

function CashReportsForOP() {

    const navigate = useNavigate()
    const queryParameters = new URLSearchParams(window.location.search)
    const adminsession = queryParameters.get("d")
    const sessionToBeUse = decryptData(adminsession);

    const [open, setOpen] = useState(true);
    const [test, setTest] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day').startOf('day'));
    const [dateTo, setDateTo] = useState(dayjs(dayjs(new Date())));
    const [loading, setLoading] = useState(false);

    const checkUser = () => {
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/inscashierloginbysession?session_token=${sessionToBeUse}`)
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
    }

    useEffect (() => {
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/inscashierloginbysession?session_token=${sessionToBeUse}`)
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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        checkUser()
    };

    const filteredTest = test.filter((item) =>
    (item.cashier_id && item.cashier_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.player_name && item.player_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.transaction_id && item.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.ext_id && item.ext_id.toLowerCase().includes(searchQuery.toLowerCase()))
);


    const handleDrawerOpen = () => {
      setOpen(true);
      checkUser()
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
      checkUser()
    };

    const showCashReports = () => {
        setLoading(true)
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/cashierreporttransaction?operator_id=OpF10&date_from=${dateFrom.format('YYYY-MM-DD HH:mm:ss')}&date_to=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
        .then((res) => {
            setTest(res.data.data)
            console.log(res.data.data)
            checkUser()
        })
        .finally(() => {
            setLoading(false);
            });
    }

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh" }} open={open}>
        <Box sx={{ paddingTop: 8, color: "white" }}>
        <Grid container>
            <Grid item xs={12}>
            <Box
                sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                    width: "100%",
                    height: "18vh",
                },
                justifyContent: "center"
                }}
            >
                <Paper className="paperBG" elevation={3}>
                    <Box sx={{ padding: 3 }}>
                    <Typography variant='h5'>
                        Cash Reports <hr/>
                    </Typography>
                    <Grid sx={{ paddingTop: 2 }} container spacing={2}>
                        <Grid item xs={12} sm={12} md={8}>
                            <Grid container spacing={2} >
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker
                                                value={dateFrom}
                                                onChange={(newValue) => setDateFrom(newValue)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker 
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid sx={{ marginTop: "7px" }} item xs={4}>
                                <Button
                                    onClick={showCashReports}
                                    sx={{ width: '70%', height: '60px', backgroundColor: '#006064' }}
                                    variant="contained"
                                    disabled={loading}
                                    >
                                    {loading ? 'Loading...' : 'SUBMIT'}
                                </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Box
                                sx={{
                                    width: 500,
                                    maxWidth: '100%',
                                }}
                                >
                                <TextField 
                                    fullWidth label="SEARCH HERE" 
                                    id="fullWidth" variant='filled' 
                                    color='secondary' 
                                    focused 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    </Box>
                </Paper>
            </Box>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12}>
            <Box
                sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                    width: "100%",
                    height: "100%",
                },
                justifyContent: "center"
                }}
            >
                <Box sx={{ maxHeight: '65vh', overflow: "auto", paddingTop: 3 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Cashier</StyledTableCell>
                            <StyledTableCell align="center">Player Name</StyledTableCell>
                            <StyledTableCell align="center">&#8369;</StyledTableCell>
                            <StyledTableCell align="center">Date Transacted</StyledTableCell>
                            <StyledTableCell align="center">Transaction ID</StyledTableCell>
                            <StyledTableCell align="center">Transaction Type</StyledTableCell>
                            <StyledTableCell align="center">External ID</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filteredTest.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={20} align='center'>
                                    NO DATA TO DISPLAY
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : (
                            filteredTest.map((index) => (
                                <StyledTableRow key={index.RoundId}>
                                    <StyledTableCell component="th" scope="row">
                                        {index.cashier_id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{index.player_name}</StyledTableCell>
                                    <StyledTableCell align="center">{index.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                    <StyledTableCell align="center">{moment(index.date_created).format("LLL")}</StyledTableCell>
                                    <StyledTableCell align="center">{index.transaction_id}</StyledTableCell>
                                    <StyledTableCell style={{ color: index.is_cashin === 1 ? '#54B435' : '#FF1E1E', fontWeight: "bolder"  }} align="center">
                                        {index.is_cashin === 1 ? 'DEPOSIT' : index.is_cashin === 0 ? 'WITHDRAW' : ''}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{index.ext_id}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Box>
            </Box>
            </Grid>
        </Grid>
        </Box>
    </Main>
    </Box>
  )
}

export default CashReportsForOP