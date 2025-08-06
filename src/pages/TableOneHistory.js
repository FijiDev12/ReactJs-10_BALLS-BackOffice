import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, TableContainer, Typography, Table, TableRow, Button, TableHead, TableBody, TextField, TableFooter, TablePagination, IconButton } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage'
import moment from 'moment';
import dayjs from 'dayjs';
import api from "../Api/marble_ten"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../Utils';
import Ball1 from "../assets/ball_1.png"
import Ball2 from "../assets/ball_2.png"
import Ball3 from "../assets/ball_3.png"
import Ball4 from "../assets/ball_4.png"
import Ball5 from "../assets/ball_5.png"
import Ball6 from "../assets/ball_6.png"
import Ball7 from "../assets/ball_7.png"
import Ball8 from "../assets/ball_8.png"
import Ball9 from "../assets/ball_9.png"
import Ball10 from "../assets/ball_10.png"


const drawerWidth = 240;



const resultToImageMap = {
    BALL_1: Ball1,
    BALL_2: Ball2,
    BALL_3: Ball3,
    BALL_4: Ball4,
    BALL_5: Ball5,
    BALL_6: Ball6,
    BALL_7: Ball7,
    BALL_8: Ball8,
    BALL_9: Ball9,
    BALL_10: Ball10,
  };

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

const StyledFooterTableRow = styled(TableRow)(({ theme }) => ({
   background : "#004d40"
    
}));


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

  function TablePaginationActions(props) {

    

    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  

function TableOneHistory() {

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
    
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const globalApi = process.env.REACT_APP_LOCAL_URL


    const checkUser = () => {
        api.get(`${globalApi}/API/F10/adminLoginSession?SessionID=${sessionToBeUse}`)
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
    }

    useEffect(() => {
        api.get(`${globalApi}/API/F10/adminLoginSession?SessionID=${sessionToBeUse}`)
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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        checkUser()
    };

    const filteredTest = test.filter((item) =>
    (item.RoundId && item.RoundId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.ReasonMsg && item.ReasonMsg.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.RoundResult && item.RoundResult.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.DateDrawn && item.DateDrawn.toLowerCase().includes(searchQuery.toLowerCase()))
);


    const handleDrawerOpen = () => {
      setOpen(true);
      checkUser()
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
      checkUser()
    };

    const showGameHistory = () => {
        setLoading(true)
        api.get(`${globalApi}/API/F10/getallgamesjournal?GameIdx=1&DateFrom=${dateFrom.format('YYYY-MM-DD HH:mm:ss')}&DateTo=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
        .then((res) => {
            setTest(res.data.data)
            console.log(res.data.data)
            checkUser()
        })
        .finally(() => {
            setLoading(false);
            });
    }

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTest.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
      

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh" }} open={open}>
        <Box sx={{ paddingTop: 8, color: "white" }}>
        <Grid container>
            <Grid item xs={12}>
                <Paper className="paperBG" elevation={3}>
                    <Box sx={{ padding: 3 }}>
                    <Typography variant='h5'>
                        Game History Table One <hr/>
                    </Typography>
                    <Grid sx={{ paddingTop: 2 }} container spacing={2}>
                        <Grid item xs={12} sm={12} md={8}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={12} lg={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker
                                                value={dateFrom}
                                                onChange={(newValue) => setDateFrom(newValue)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker 
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid sx={{ marginTop: "7px" }} item xs={12} sm={12} md={12} lg={4}>
                                <Button
                                    onClick={showGameHistory}
                                    sx={{ width: '70%', height: '60px', backgroundColor: '#006064' }}
                                    variant="contained"
                                    disabled={loading} // Disable the button when loading is true
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
            </Grid>
        </Grid>
        <Grid container sx={{ paddingTop: 1.5 }}>
            <Grid item xs={12}>
            <Box sx={{ maxHeight: '62vh', overflowY: "auto" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Round ID</StyledTableCell>
                            <StyledTableCell align="center">Round Drawn</StyledTableCell>
                            <StyledTableCell align="center">Round Cancelled</StyledTableCell>
                            <StyledTableCell align="center">Reason For Voiding</StyledTableCell>
                            <StyledTableCell align="center">Total Winners</StyledTableCell>
                            <StyledTableCell align="center">Winning Ball</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                         {filteredTest.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={20} align='center'>
                                    NO RESULTS FOUND
                                </StyledTableCell>
                            </StyledTableRow>
                         ) : (
                            filteredTest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((index) => (
                                <StyledTableRow key={index.RoundId}>
                                    <StyledTableCell component="th" scope="row">
                                        {index.RoundId}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{index.DateDrawn ? moment(index.DateDrawn).format("LLL") : "N/A"}</StyledTableCell>
                                    <StyledTableCell align="center">{index.DateCancelled ? moment(index.DateCancelled).format("LLL") : "N/A"}</StyledTableCell>
                                    <StyledTableCell align="center">{index.ReasonMsg}</StyledTableCell>
                                    <StyledTableCell align="center">{index.WinnersCount}</StyledTableCell>
                                    <StyledTableCell align="center">
                                      {index.RoundResult ? (
                                        index.RoundResult.split(',').map(ball => (
                                          <img key={ball} src={resultToImageMap[ball]} alt={ball} style={{ width: 40, height: 40, marginRight: 1 }} />
                                        ))
                                      ) : (
                                        "NOT DECLARED"
                                      )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                         )}
                         {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={20} />
                        </TableRow>
                        )}
                        </TableBody>
                        <TableFooter sx={{ background: "#004d40" }}>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    count={filteredTest.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    sx={{ color: "white" }}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                sx: {
                                                    backgroundColor: 'black',
                                                },
                                            },
                                        },
                                        MenuItemProps: {
                                            sx: {
                                                color: 'white',
                                            },
                                        },
                                        inputProps: {
                                            sx: {
                                                color: 'white',
                                            },
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
            </Grid>
        </Grid>
        </Box>
    </Main>
    </Box>
  )
}

export default TableOneHistory