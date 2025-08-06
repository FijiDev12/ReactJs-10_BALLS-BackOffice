import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, MenuItem, Typography, Autocomplete, Dialog, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, Backdrop, CircularProgress, TableRow, TableContainer, Table, TableHead, TableBody, Select, Slide } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled, useTheme} from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import api from "../Api/marble_ten"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { decryptData } from '../Utils';
import moment from 'moment';

const drawerWidth = 240;

const getSessionStorage = () => {
  return decryptData(sessionStorage.getItem('F10_Data$0788'));
}
const getOptions = () => {
    const role = getSessionStorage();
    const dynamicOptions = ['-- Select User To Show --'];
  
    if (role === 'System Administrator') {
      dynamicOptions.push('Admin List');
      dynamicOptions.push('Cashier List');
      dynamicOptions.push('Agent List');
      dynamicOptions.push('Player List');
    }
  
    return dynamicOptions;
  };
  
  const options = getOptions();

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const MyAutocomplete = styled(Autocomplete)({
    width: '100%',
    
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
    },
  });
  
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
      background: 'linear-gradient(to bottom left, #0D0E38 100%, #2B0202 100%)',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const EditButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    background: theme.palette.success.dark
  }));
  
  const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    background: theme.palette.error.dark
  }));

function PlayerList() {
    const globalApi = process.env.REACT_APP_LOCAL_URL
    const queryParameters = new URLSearchParams(window.location.search)
    const adminsession = queryParameters.get("d")
    const roleName = queryParameters.get("r")
    const username = queryParameters.get("u")
    const sessionToBeUse = decryptData(adminsession);
    const navigate = useNavigate()

    const [open, setOpen] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openUpdatePassword, setOpenUpdatePassword] = useState(false);
    const [value, setValue] = useState(options[0]);
    const [inputValue, setInputValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [ newPassWord, setNewPassWord ] = useState("")
    const [ confirmPassWord, setConfirmPassWord ] = useState('');
    const [ passwordsMatch, setPasswordsMatch ] = useState(true);
    const [ mobileNumber, setMobileNumber ] = useState("")

    const [ Idx, setIdx ] = useState("")
    const [ FirstNameToEdit, setFirstNameToEdit ] = useState("")
    const [ MiddleNameToEdit, setMiddleNameToEdit ] = useState("")
    const [ LastNameToEdit, setLastNameToEdit ] = useState("")
    const [ BirthdateToEdit, setBirthdateToEdit ] = useState("")
    const [ PhoneNumberToEdit, setPhoneNumberToEdit ] = useState("")
    const [ EmailToEdit, setEmailToEdit ] = useState("")
    const [ SourceFundsToEdit, setSourceFundsToEdit ] = useState("")

    const [admins, setAdmins] = useState([]);
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day').startOf('day'));
    const [dateTo, setDateTo] = useState(dayjs(dayjs(new Date())));
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null); 

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOptionChange = (event, newValue) => {
        setValue(newValue);
      
        if (newValue === 'Admin List') {
            navigate(`/admin-Users?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        } else if (newValue === 'Cashier List') {
            navigate(`/user/cashier?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        } else if (newValue === 'Agent List') {
            navigate(`/user/agent?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        } else if (newValue === 'Player List') {
          navigate(`/user/player?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
      }
      };

    
  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await api.get(`${globalApi}/API/F10/selaffiliateslisting?operator_id=OpF10`);
      setAgents(response.data.data);
      } catch (error) {
      console.error('Error fetching agents:', error);
      }
  };
  fetchData()
  }, [])



  const handleAgentChange = (event, newValue1) => {
    setSelectedAgent(newValue1);

    if (newValue1) {
      sessionStorage.setItem('F10Data-$aff5544', CryptoJS.AES.encrypt(newValue1.AffiliateCode, process.env.REACT_APP_CRYPTO_KEY).toString());
    } else {
      sessionStorage.removeItem('encryptedCode');
    }
  };

  const showPlayer = () => {
    api.get(`${globalApi}/API/F10/selplayerbyaffialitecode?affiliate_code=${decryptData(sessionStorage.getItem("F10Data-$aff5544"))}&date_from=${dateFrom.format('YYYY-MM-DD HH:mm:ss')}&date_to=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
    .then((res) => {
      console.log(res.data.data)
      setAdmins(res.data.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }


    const checkUser = () => {
        api.get(`${globalApi}/API/F10/adminLoginSession?SessionID=${sessionToBeUse}`)
        .then((res) => {
            if (res.data.data[0].RoleName === "" || res.data.data[0].Username === ""){
                console.log(res.data.data)
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


    const handleDrawerOpen = () => {
        setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        checkUser()
      };

    const openEditModal = (adminData) => {
    setOpenModalEdit(true)
    console.log(adminData.idx)
    setIdx(adminData.idx)
    sessionStorage.setItem("F10EditFirstName", adminData.first_name)
    sessionStorage.setItem("F10EditMiddleName", adminData.middle_name)
    sessionStorage.setItem("F10EditLastName", adminData.last_name)
    sessionStorage.setItem("F10EditEmail", adminData.email_address)
    sessionStorage.setItem("F10EditNumber", adminData.mobile_no)
    sessionStorage.setItem("F10EditSourceFunds", adminData.source_of_funds)
    }

    const closeEditModal = () => {
        setIdx("")
        sessionStorage.removeItem("F10EditFirstName")
        sessionStorage.removeItem("F10EditMiddleName")
        sessionStorage.removeItem("F10EditLastName")
        sessionStorage.removeItem("F10EditEmail")
        sessionStorage.removeItem("F10EditNumber")
        sessionStorage.removeItem("F10EditSourceFunds")
        setOpenModalEdit(false)
    }

    useEffect(() => {
        setFirstNameToEdit(sessionStorage.getItem("F10EditFirstName"));
        setMiddleNameToEdit(sessionStorage.getItem("F10EditMiddleName"));
        setLastNameToEdit(sessionStorage.getItem("F10EditLastName"));
        setEmailToEdit(sessionStorage.getItem("F10EditEmail"));
        setPhoneNumberToEdit(sessionStorage.getItem("F10EditNumber"));
        setSourceFundsToEdit(sessionStorage.getItem("F10EditSourceFunds"));
      }, [sessionStorage.getItem("F10EditFirstName"), sessionStorage.getItem("F10EditMiddleName"), sessionStorage.getItem("F10EditLastName"),sessionStorage.getItem("F10EditNumber"),sessionStorage.getItem("F10EditEmail"),sessionStorage.getItem("F10EditSourceFunds")]);

    const openChangePassword = (adminData) => {
        setOpenUpdatePassword(true)
        setMobileNumber(adminData.mobile_no)
        setIdx(adminData.idx)
    }

    const closeChangePassword = () => {
        setOpenUpdatePassword(false)
    }

    const playerEditDetails = (e) => {
        e.preventDefault();
        api.patch(`${globalApi}/API/F10/updplayerprofiledetails`, {
    
            idx : Idx,
            first_name : FirstNameToEdit,
            middle_name : MiddleNameToEdit,
            last_name : LastNameToEdit,
            birthdate : BirthdateToEdit,
            mobile_no : PhoneNumberToEdit,
            email_address : EmailToEdit,
            source_of_funds : SourceFundsToEdit
        })
        .then((res) => {
          closeEditModal()
          console.log(res.data.data)
          if (res.data.data[0].responseCode === "0") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditEmail")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditSourceFunds")
            Swal.fire({
              title: "THIS USER's DETAILS HAS BEEN UPDATED",
              icon: "success",
              confirmButtonColor: "OKAY"
            })
            .then((res) => {
              if (res.isConfirmed) {
                window.location.reload()
              }
            })
          } else if (res.data.data[0].ResponseCode === "-3") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditEmail")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditSourceFunds")
            Swal.fire({
              title: "MOBILE NUMBER IS ALREADY EXISTS",
              icon: "error",
              confirmButtonColor: "OKAY"
            })
            .then((res) => {
              if (res.isConfirmed) {
                window.location.reload()
              }
            })
          } else if (res.data.data[0].ResponseCode === "-2") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditEmail")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditSourceFunds")
            Swal.fire({
              title: "CASHIER's NAME ALREADY EXISTS",
              icon: "error",
              confirmButtonColor: "OKAY"
            })
            .then((res) => {
              if (res.isConfirmed) {
                window.location.reload()
              }
            })
          }
        })
        .catch((err) => {
            console.log(err)
          closeEditModal()
          setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditEmail")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditSourceFunds")
          Swal.fire({
            title: "INPUT BIRTHDATE",
            icon: "error",
            confirmButtonText: "OK"
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          })
        })
      }

    const playerChangePassword = () => {
    if (newPassWord === confirmPassWord) {
        api.patch(`${globalApi}/API/F10/updplayerpassword`, {
          mobile_no: mobileNumber,
          passhash_new: newPassWord,
          passhash_confirm: confirmPassWord
        })
        .then((res) => {
            if (res.data.data[0].responseCode === "0"){
                closeChangePassword()
            Swal.fire({
                title: "PLAYER PASSWORD UPDATED",
                icon: "success",
                confirmButtonText: "OKAY",
                allowOutsideClick: false
            })
            .then((res) => {
                if (res.isConfirmed){
                    setNewPassWord("")
                    setConfirmPassWord("")
                }
            })
        } else if ( res.data.data[0].responseCode === "-1" ) {
            closeChangePassword()
            Swal.fire({
                title: "Player account does not exists",
                icon: "error",
                confirmButtonText: "OKAY"
            })
            .then((res) => {
                if (res.isConfirmed){
                    window.location.reload()
                }
            })
        }
        })
        .catch((error) => {
        console.error('Error updating password:', error);
        });
    } else {
        setPasswordsMatch(false);
    }
    };

    const handleNewPasswordChange = (e) => {
    setNewPassWord(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassWord);
    };

    const handleConfirmPasswordChange = (e) => {
    setConfirmPassWord(e.target.value);
    setPasswordsMatch(newPassWord === e.target.value);
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
            <Box
                sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                    width: "100%",
                    height: "15vh",
                },
                justifyContent: "center"
                }}
            >
                <Paper className="paperBG" elevation={3}>
                    <Box sx={{ padding: 2 }}>
                    <Typography variant='h5'>
                        PLAYER USERS LISTING <hr/>
                    </Typography>
                    <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} container>
                        <Grid sx={{ paddingTop: 1, display: "flex", justifyContent: "center", alignItems: "center" }} item xs={10}>
                            <Grid container spacing={1}>
                            <Grid sx={{ paddingTop: 1}} item xs={3}>
                            <MyAutocomplete
                                options={agents}
                                getOptionLabel={(option) => `${option.FirstName} ${option.LastName} (${option.EncryptCode})`}
                                value={selectedAgent}
                                onChange={handleAgentChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Agent" variant="outlined" />
                                )}
                                sx={{ width: '100%', paddingTop: 1 }}
                                />
                            </Grid>
                                <Grid sx={{ paddingTop: 1 }} item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker
                                                value={dateFrom}
                                                onChange={(newValue) => setDateFrom(newValue)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid sx={{ paddingTop: 1 }} item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <StyledDateTimePicker 
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid sx={{ marginTop: "7px" }} item xs={3}>
                                <Button
                                    onClick={showPlayer}
                                    sx={{ width: '80%', height: '60px', backgroundColor: '#006064' }}
                                    variant="contained"
                                    disabled={loading}
                                    >
                                    {loading ? 'Loading...' : 'SHOW PLAYERS'}
                                </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid sx={{ paddingTop: 1, display: "flex", justifyContent: "center", alignItems: "center" }} item xs={2}>
                            <MyAutocomplete
                                value={value}
                                onChange={handleOptionChange}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                id="controllable-states-demo"
                                options={options}
                                sx={{ width: '100%', paddingTop: 1 }}
                                renderInput={(params) => <TextField {...params} />}
                            />
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
                <Box sx={{ maxHeight: '62vh', overflow: "auto" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">First Name</StyledTableCell>
                            <StyledTableCell align="center">Middle Name</StyledTableCell>
                            <StyledTableCell align="center">Last Name</StyledTableCell>
                            <StyledTableCell align="center">Source Of Income</StyledTableCell>
                            <StyledTableCell align="center">Contact Number</StyledTableCell>
                            <StyledTableCell align="center">Email Address</StyledTableCell>
                            <StyledTableCell align="center" >Status</StyledTableCell>
                            <StyledTableCell align="center" colSpan={2}>ACTIONS</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                          {admins.length === 0 ? (
                            <StyledTableRow>
                              <StyledTableCell colSpan={20} align='center'>
                                NO DATA TO DISPLAY
                              </StyledTableCell>
                            </StyledTableRow>
                          ) : (
                            admins.map((admin) => (
                              <StyledTableRow key={admin.Idx}>
                                <StyledTableCell align="center">{admin.first_name}</StyledTableCell>
                                <StyledTableCell align="center">{admin.middle_name}</StyledTableCell>
                                <StyledTableCell align="center">{admin.last_name}</StyledTableCell>
                                <StyledTableCell align="center">{admin.source_of_funds}</StyledTableCell>
                                <StyledTableCell align="center">{admin.mobile_no}</StyledTableCell>
                                <StyledTableCell align="center">{admin.email_address}</StyledTableCell>
                                <StyledTableCell align="center" style={{ textAlign: 'center', fontWeight: 'bolder', color: admin.is_active ? 'green' : 'red'}}>
                                {admin.is_active ? 'Active' : 'Inactive'}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <EditButton sx={{ width: "100%" }} onClick={() => openEditModal(admin)}>
                                    Edit
                                  </EditButton>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <DeleteButton sx={{ width: "100%" }} onClick={() => openChangePassword(admin)}>
                                    EDIT PASSWORD
                                  </DeleteButton>
                                </StyledTableCell>
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
    <>
    <Dialog
        fullScreen={fullScreen}
        open={openModalEdit}
        onClose={closeEditModal}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
            style: {
                background: 'rgba(1, 1, 1, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"EDIT PLAYER's DETAILS"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    margin="dense"
                    fullWidth label="FIRST NAME"
                    id="fullWidth1" variant='filled'
                    color='success'
                    focused
                    value={FirstNameToEdit}
                    onChange={(e) => setFirstNameToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="MIDDLE NAME" 
                    id="fullWidth2" variant='filled' 
                    color='success' 
                    focused
                    value={MiddleNameToEdit}
                    onChange={(e) => setMiddleNameToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="LAST NAME" 
                    id="fullWidth3" variant='filled' 
                    color='success' 
                    focused
                    value={LastNameToEdit}
                    onChange={(e) => setLastNameToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth
                    label="BIRTH DATE" 
                    id="fullWidth6"
                    variant='filled' 
                    color='success' 
                    focused
                    type='date'
                    value={BirthdateToEdit}
                    onChange={(e) => setBirthdateToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="CONTACT NUMBER" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={PhoneNumberToEdit}
                    onChange={(e) => setPhoneNumberToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="EMAIL ADDRESS" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={EmailToEdit}
                    onChange={(e) => setEmailToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="SOURCE OF FUNDS" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={SourceFundsToEdit}
                    onChange={(e) => setSourceFundsToEdit(e.target.value)}
                />
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={playerEditDetails}>
            SUBMIT
          </Button>
          <Button onClick={closeEditModal} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog
        fullScreen={fullScreen}
        open={openUpdatePassword}
        onClose={closeChangePassword}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
            style: {
                background: 'rgba(1, 1, 1, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {`EDIT ${mobileNumber}'s PASSWORD`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth
                    label="NEW PASSWORD"
                    id="fullWidth12"
                    variant='filled'
                    color='success'
                    focused
                    type={showPassword ? 'text' : 'password'}
                    value={newPassWord}
                    onChange={handleNewPasswordChange}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth
                    label="CONFIRM PASSWORD"
                    id="fullWidth13"
                    variant='filled'
                    color='success'
                    type={showPassword ? 'text' : 'password'}
                    focused
                    value={confirmPassWord}
                    onChange={handleConfirmPasswordChange}
                    error={!passwordsMatch}
                    helperText={!passwordsMatch && "Passwords do not match"}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={playerChangePassword} disabled={!passwordsMatch}>
            SUBMIT
            </Button>
          <Button onClick={closeChangePassword} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
    </Dialog>
    <Backdrop open={loading} style={{ zIndex: 1 }}>
    <CircularProgress color="secondary" />
    </Backdrop>
      </>
    </Box>
  )
}

export default PlayerList