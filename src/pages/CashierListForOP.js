import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, MenuItem, Typography, Autocomplete, Dialog, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, Backdrop, CircularProgress, TableRow, TableContainer, Table, TableHead, TableBody, DialogContentText, Slide } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled, useTheme} from '@mui/material/styles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import api from "../Api/F10"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { decryptData } from '../Utils';

const drawerWidth = 240;

const getSessionStorage = () => {
  return decryptData(sessionStorage.getItem('F10_Data$0788'));
}
const getOptions = () => {
    const role = getSessionStorage();
    const dynamicOptions = ['-- Select User To Show --'];
  
    if (sessionStorage.getItem('F10_Data$0788') === '6') {
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
    paddingTop: 1,
    
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
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

function CashierListForOP() {

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

    const [ FirstName, setFirstName ] = useState("")
    const [ MiddleName, setMiddleName ] = useState("")
    const [ LastName, setLastName ] = useState("")
    const [ PassHash, setPassHash ] = useState("")
    const [ newPassWord, setNewPassWord ] = useState("")
    const [ confirmPassWord, setConfirmPassWord ] = useState('');
    const [ passwordsMatch, setPasswordsMatch ] = useState(true);
    const [ PhoneNumber, setPhoneNumber ] = useState("")

    const [ Idx, setIdx ] = useState("")
    const [ FirstNameToEdit, setFirstNameToEdit ] = useState("")
    const [ MiddleNameToEdit, setMiddleNameToEdit ] = useState("")
    const [ LastNameToEdit, setLastNameToEdit ] = useState("")
    const [ PhoneNumberToEdit, setPhoneNumberToEdit ] = useState("")

    const [admins, setAdmins] = useState([]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOptionChange = (event, newValue) => {
        setValue(newValue);
      
        if (newValue === 'Cashier List') {
          navigate(`/user/cashierOP?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        } else if (newValue === 'Agent List') {
          navigate(`/user/agentOP?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        } else if (newValue === 'Player List') {
          navigate(`/user/playerOP?d=${encodeURIComponent(adminsession)}&r=${encodeURIComponent(roleName)}&u=${encodeURIComponent(username)}`);
        }
      };


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
    
    useEffect(() => {
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/selcashierlisting?operator_id=OpF10`)
        .then((res) => {
            console.log(res.data)
            setAdmins(res.data.data)
        })
    }, [])


    const handleDrawerOpen = () => {
        setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpenModal(true);
        checkUser()
    };

    const handleClose = () => {
        setOpenModal(false);
        checkUser()
    }
    
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
    sessionStorage.setItem("F10EditNumber", adminData.cashier_contact_no)
    }

    const closeEditModal = () => {
        setIdx("")
        sessionStorage.removeItem("F10EditFirstName")
        sessionStorage.removeItem("F10EditMiddleName")
        sessionStorage.removeItem("F10EditLastName")
        sessionStorage.removeItem("F10EditNumber")
        setOpenModalEdit(false)
    }

    useEffect(() => {
        setFirstNameToEdit(sessionStorage.getItem("F10EditFirstName"));
        setMiddleNameToEdit(sessionStorage.getItem("F10EditMiddleName"));
        setLastNameToEdit(sessionStorage.getItem("F10EditLastName"));
        setPhoneNumberToEdit(sessionStorage.getItem("F10EditNumber"));
      }, [sessionStorage.getItem("F10EditFirstName"), sessionStorage.getItem("F10EditMiddleName"), sessionStorage.getItem("F10EditLastName"),sessionStorage.getItem("F10EditNumber"),]);

    const openChangePassword = (adminData) => {
        setOpenUpdatePassword(true)
        console.log(adminData.pass)
        setIdx(adminData.idx)
    }

    const closeChangePassword = () => {
        setOpenUpdatePassword(false)
    }

      // CASHIER Registration 

    const cashierRegistration = () => {
        setLoading(true);
        api.post(`${process.env.REACT_APP_F10_URL}/API/F10/inscashierregistration`, {
            first_name: FirstName,
            middle_name: MiddleName,
            last_name: LastName,
            cashier_contact_no: PhoneNumber,
            operator_id: "OpF10",
            passhash: PassHash,
            roleidx: "7"
        })
        .then((res) => {
            console.log(res.data.data)
            handleClose()
            if(res.data.data[0].responseCode === "0") {
                Swal.fire({
                    title: "CASHIER ACCOUNT CREATED",
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
                    title: "Invalid operator id",
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
                    title: "Cashier id already exists",
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
                    title: "Mobile number already exists",
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

     // CASHIER UPDATE STATUS
     
    const updateStatus = (adminData) => {

        Swal.fire({
            title: `UPDATE THE STATUS OF ${adminData.first_name} ${adminData.last_name}?`,
            text: "By Clicking 'OKAY' you agree to change the status of this cashier",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OKAY",
        })
        .then((res) => {
            if (res.isConfirmed){
                api.patch(`${process.env.REACT_APP_F10_URL}/API/F10/cashieractivestatus?idx=${adminData.idx}`)
                .then((res) => {
                    if (res.data.data[0].responseCode === "0"){
                        Swal.fire({
                            title: "STATUS UPDATED",
                            icon: "success",
                            confirmButtonText: "OKAY"
                        })
                        .then((res) => {
                            if (res.isConfirmed){
                                window.location.reload()
                            }
                        })
                    }
                    else if (res.data.data[0].responseCode === "-1") {
                        Swal.fire({
                            title: "CASHIER ACCOUNT DOESNT EXISTS",
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
            }
        })
    }

    const editCashierDetails = (e) => {
        e.preventDefault();
        api.patch(`${process.env.REACT_APP_F10_URL}/API/F10/cashierupdprofiledetails`, {
    
            idx : Idx,
            first_name : FirstNameToEdit,
            middle_name : MiddleNameToEdit,
            last_name : LastNameToEdit,
            cashier_contact_no : PhoneNumberToEdit
        })
        .then((res) => {
          closeEditModal()
          console.log(res.data.data)
          if (res.data.data[0].responseCode === "0") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditNumber")
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
            sessionStorage.removeItem("F10EditNumber")
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
            sessionStorage.removeItem("F10EditNumber")
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
            sessionStorage.removeItem("F10EditNumber")
          Swal.fire({
            title: "PLEASE CHECK ALL INPUTS",
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

    const editCashierPassword = () => {
    if (newPassWord === confirmPassWord) {
        api.patch(`${process.env.REACT_APP_F10_URL}/API/F10/cashierupdprofilepassword`, {
        idx: Idx,
        passhash: newPassWord
        })
        .then((res) => {
            if (res.data.data[0].responseCode === "0"){
                closeChangePassword()
            Swal.fire({
                title: "CASHIER PASSWORD UPDATED",
                icon: "success",
                confirmButtonText: "OKAY"
            })
            .then((res) => {
                if (res.isConfirmed){
                    window.location.reload()
                }
            })
        } else if ( res.data.data[0].responseCode === "-2" ) {
          closeChangePassword()
          Swal.fire({
              title: "New password is similar to the current password",
              icon: "error",
              confirmButtonText: "OKAY"
          })
          .then((res) => {
              if (res.isConfirmed){
                  window.location.reload()
              }
          })
      } else if ( res.data.data[0].responseCode === "-1" ) {
          closeChangePassword()
          Swal.fire({
              title: "Cashier account does not exists",
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
                        CASHIER USERS LISTING <hr/>
                    </Typography>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={7}>
                        </Grid>
                        <Grid sx={{ paddingTop: 1 }} item xs={12} sm={12} md={5}>
                            <Grid  container spacing={1}>
                                <Grid item xs={6}>
                                    <Box >
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
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid sx={{ paddingTop : 1 }} container>
                                        <Grid item xs={12}>
                                            <Button onClick={handleClickOpen} sx={{ height: "3.5rem", width: "100%" }} color='warning'  variant="text" startIcon={<GroupAddIcon/>}>
                                                + CASHIER
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
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
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell align="center">Full Name</StyledTableCell>
                            <StyledTableCell align="center">Cashier ID</StyledTableCell>
                            <StyledTableCell align="center">Contact Number</StyledTableCell>
                            <StyledTableCell align="center" >Status(click to change)</StyledTableCell>
                            <StyledTableCell align="center" colSpan={2}>ACTIONS</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {admins
                        .filter(admin => admin.role_name !== "Operator")
                        .map((admin) => (
                            <StyledTableRow key={admin.Idx}>
                            <StyledTableCell component="th" scope="row">
                                {admin.username}
                            </StyledTableCell>
                            <StyledTableCell align="center">{`${admin.first_name} ${admin.last_name}`}</StyledTableCell>
                            <StyledTableCell align="center">{admin.cashier_id}</StyledTableCell>
                            <StyledTableCell align="center">{admin.cashier_contact_no}</StyledTableCell>
                            <StyledTableCell align="center" onClick={() => updateStatus(admin)} style={{ textAlign: 'center', fontWeight: 'bolder', color: admin.is_active === 1 ? '#54B435' : '#FF1E1E', cursor: "pointer"}}>
                            {admin.is_active === 1 ? 'Active' : admin.is_active === 0 ? 'Inactive' : ''}
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
                        ))}
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
        open={openModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
            style: {
                background: 'rgba(0, 0, 0, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"REGISTER CASHIER"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="OPERATOR ID" 
                    id="fullWidth8" variant='filled' 
                    color='success' 
                    focused
                    value={"OpF10"}
                >
                </TextField>
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="FIRST NAME" 
                    id="fullWidth1" variant='filled' 
                    color='success' 
                    focused
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="MIDDLE NAME" 
                    id="fullWidth2" variant='filled' 
                    color='success' 
                    focused
                    value={MiddleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="LAST NAME" 
                    id="fullWidth3" variant='filled' 
                    color='success' 
                    focused
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="CONTACT NUMBER" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={PhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        fullWidth
                        label="Password"
                        id="password"
                        variant="filled"
                        color="success"
                        focused
                        type={showPassword ? 'text' : 'password'}
                        value={PassHash}
                        onChange={(e) => setPassHash(e.target.value)}
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
          <Button autoFocus onClick={cashierRegistration}>
            SUBMIT
          </Button>
          <Button onClick={handleClose} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
    </Dialog>
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
          {"EDIT CASHIER's DETAILS"}
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
                    fullWidth label="CONTACT NUMBER" 
                    id="fullWidth5" variant='filled' 
                    color='success' 
                    focused
                    value={PhoneNumberToEdit}
                    onChange={(e) => setPhoneNumberToEdit(e.target.value)}
                />
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={editCashierDetails}>
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
          {`EDIT CASHIER's PASSWORD`}
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
            <Button autoFocus onClick={editCashierPassword} disabled={!passwordsMatch}>
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

export default CashierListForOP