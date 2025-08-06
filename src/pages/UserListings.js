import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, MenuItem, Typography, Autocomplete, Dialog, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, Backdrop, CircularProgress, TableRow, TableContainer, Table, TableHead, TableBody, DialogContentText, Slide } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled, useTheme} from '@mui/material/styles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import api from "../Api/marble_ten"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { decryptData } from '../Utils';

const drawerWidth = 240;

const getSessionStorage = () => {
     // Implement your logic to get the role from sessionStorage
  // For example, if you store the role in sessionStorage with key 'role'
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

function UserListings() {

    const queryParameters = new URLSearchParams(window.location.search)
    const adminsession = queryParameters.get("d")
    const roleName = queryParameters.get("r")
    const username = queryParameters.get("u")
    const sessionToBeUse = decryptData(adminsession);
    const navigate = useNavigate()

    const [open, setOpen] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openModalOperatorList, setOpenModalOperatorList] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [value, setValue] = useState(options[0]);
    const [inputValue, setInputValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [ FirstName, setFirstName ] = useState("")
    const [ MiddleName, setMiddleName ] = useState("")
    const [ LastName, setLastName ] = useState("")
    const [ RoleIdx, setRoleIdx ] = useState("")
    const [ Username, setUsername ] = useState("")
    const [ PassHash, setPassHash ] = useState("")
    const [ BirthDate, setBirthDate ] = useState("")
    const [ Gender, setGender ] = useState("")
    const [ Address, setAddress ] = useState("")
    const [ ZipCode, setZipCode ] = useState("")
    const [ Email, setEmail ] = useState("")
    const [ PhoneNumber, setPhoneNumber ] = useState("")

    const [ Idx, setIdx ] = useState("")
    const [ FirstNameToEdit, setFirstNameToEdit ] = useState("")
    const [ MiddleNameToEdit, setMiddleNameToEdit ] = useState("")
    const [ LastNameToEdit, setLastNameToEdit ] = useState("")
    const [ BirthDateToEdit, setBirthDateToEdit ] = useState("")
    const [ GenderToEdit, setGenderToEdit ] = useState("")
    const [ ZipCodeToEdit, setZipCodeToEdit ] = useState("")
    const [ AddressToEdit, setAddressToEdit ] = useState("")
    const [ EmailToEdit, setEmailToEdit ] = useState("")
    const [ PhoneNumberToEdit, setPhoneNumberToEdit ] = useState("")

    const [admins, setAdmins] = useState([]);
    const [operators, setOperators] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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


    const globalApi = process.env.REACT_APP_LOCAL_URL

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

    const handleClickOpen = () => {
        setOpenModal(true);
       checkUser()
    };

    const handleClose = () => {
        setOpenModal(false);
        checkUser()
    }

    const operatorListopen = () => {
        showOperators()
        setOpenModalOperatorList(true);
       checkUser()
    };

    const operatorListclose = () => {
        setOpenModalOperatorList(false);
        checkUser()
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        checkUser()
      };

    const openEditModal = (adminData) => {
    setOpenModalEdit(true)
    console.log(adminData)
    setIdx(adminData.Idx)
    sessionStorage.setItem("F10EditFirstName", adminData.FirstName)
    sessionStorage.setItem("F10EditMiddleName", adminData.MiddleName)
    sessionStorage.setItem("F10EditLastName", adminData.LastName)
    sessionStorage.setItem("F10EditBday", adminData.BirthDate)
    sessionStorage.setItem("F10EditGender", adminData.Gender)
    sessionStorage.setItem("F10EditAddress", adminData.Address)
    sessionStorage.setItem("F10EditNumber", adminData.PhoneNumber)
    sessionStorage.setItem("F10EditZipcode", adminData.ZipCode)
    sessionStorage.setItem("F10EditEmail", adminData.Email)
    }

    const closeEditModal = () => {
        setOpenModalEdit(false)
    }

    useEffect(() => {
        setFirstNameToEdit(sessionStorage.getItem("F10EditFirstName"));
        setMiddleNameToEdit(sessionStorage.getItem("F10EditMiddleName"));
        setLastNameToEdit(sessionStorage.getItem("F10EditLastName"));
        setBirthDateToEdit(sessionStorage.getItem("F10EditBday"));
        setGenderToEdit(sessionStorage.getItem("F10EditGender"));
        setAddressToEdit(sessionStorage.getItem("F10EditAddress"));
        setPhoneNumberToEdit(sessionStorage.getItem("F10EditNumber"));
        setZipCodeToEdit(sessionStorage.getItem("F10EditZipcode"));
        setEmailToEdit(sessionStorage.getItem("F10EditEmail"));
      }, [sessionStorage.getItem("F10EditFirstName"), sessionStorage.getItem("F10EditMiddleName"), sessionStorage.getItem("F10EditLastName"), sessionStorage.getItem("F10EditBday"), sessionStorage.getItem("F10EditGender"), sessionStorage.getItem("F10EditAddress"), sessionStorage.getItem("F10EditNumber"), sessionStorage.getItem("F10EditZipcode"), sessionStorage.getItem("F10EditEmail")]);

    const openDeleteModal = (adminData) => {
    setOpenDelete(true)
    setIdx(adminData.Idx)
    sessionStorage.setItem("F10UserNameDelete", adminData.Username)
    }

    const closeDeleteModal = () => {
    setOpenDelete(false)
    }

    const showOperators = () => {
        api.get(`${globalApi}/API/F10/seloperatorlist?operator_id=OpF10`)
        .then((res) => {
            console.log(res.data.data)
            setOperators(res.data.data)
        })
    }

      // Admin Registration 

    const createAdmin = () => {
        setLoading(true);
        api.post(`${globalApi}/API/F10/user_admin_registration`, {
            FirstName: FirstName,
            MiddleName: MiddleName,
            LastName: LastName,
            RoleIdx: RoleIdx,
            Username: Username,
            PassHash: PassHash,
            BirthDate: BirthDate,
            Gender: Gender,
            Address: Address,
            ZipCode: ZipCode,
            Email: Email,
            PhoneNumber: PhoneNumber
        })
        .then((res) => {
            console.log(res.data.data)
            handleClose()
            if(res.data.data[0].ResponseCode === "0") {
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

            } else if (res.data.data[0].ResponseCode === "-11"){
                Swal.fire({
                    title: "First name and last name must be unique",
                    icon: "error",
                    confirmButtonText: "OK",
                    allowOutsideClick: false
                })
                .then((result) => {
                    if (result.isConfirmed){
                        window.location.reload()
                    }
                })
            } else if (res.data.data[0].ResponseCode === "-10"){
                Swal.fire({
                    title: "Username already exists",
                    icon: "error",
                    confirmButtonText: "OK",
                    allowOutsideClick: false
                })
                .then((result) => {
                    if (result.isConfirmed){
                        window.location.reload()
                    }
                })
            } else if (res.data.data[0].ResponseCode === "-1"){
                Swal.fire({
                    title: "Invalid role",
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

    const editAdminUserDetails = (e) => {
        e.preventDefault();
        api.post(`${globalApi}/API/F10/adminupdatedetails`, {
    
            Idx : Idx,
            FirstName : FirstNameToEdit,
            MiddleName : MiddleNameToEdit,
            LastName : LastNameToEdit,
            BirthDate : BirthDateToEdit,
            Gender : GenderToEdit,
            ZipCode : ZipCodeToEdit,
            Address : AddressToEdit,
            Email : EmailToEdit,
            PhoneNumber : PhoneNumberToEdit
        })
        .then((res) => {
          closeEditModal()
          if (res.data.data[0].ResponseCode === "0") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditBday")
            sessionStorage.removeItem("F10EditGender")
            sessionStorage.removeItem("F10EditAddress")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditZipcode")
            sessionStorage.removeItem("F10EditEmail")
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
          } else if (res.data.data[0].ResponseCode === "-1") {
            setIdx("")
            sessionStorage.removeItem("F10EditFirstName")
            sessionStorage.removeItem("F10EditMiddleName")
            sessionStorage.removeItem("F10EditLastName")
            sessionStorage.removeItem("F10EditBday")
            sessionStorage.removeItem("F10EditGender")
            sessionStorage.removeItem("F10EditAddress")
            sessionStorage.removeItem("F10EditNumber")
            sessionStorage.removeItem("F10EditZipcode")
            sessionStorage.removeItem("F10EditEmail")
            Swal.fire({
              title: "SEEMS THIS USER IS NOT EXISTS",
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
          sessionStorage.removeItem("F10EditBday")
          sessionStorage.removeItem("F10EditGender")
          sessionStorage.removeItem("F10EditAddress")
          sessionStorage.removeItem("F10EditNumber")
          sessionStorage.removeItem("F10EditZipcode")
          sessionStorage.removeItem("F10EditEmail")
          Swal.fire({
            title: "SET BIRTHDATE",
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

    const deleteAdminUser = () => {
    api.delete(`${globalApi}/API/F10/adminuserdelete?Idx=${Idx}`)
    .then((res) => {
        closeDeleteModal()
        if ( res.data.data[0].ResponseCode === "0" ) {
        sessionStorage.removeItem("F10UserNameDelete")
        setIdx("")
        Swal.fire({
            title: "ADMIN SUCCESSFULLY DELETED",
            icon: "success",
            confirmButtonText: "OKAY"
        })
        .then((res) => {
            if (res.isConfirmed){
            window.location.reload()
            }
        })
        } else if ( res.data.data[0].ResponseCode === "-1" ) {
        sessionStorage.removeItem("F10UserNameDelete")
        setIdx("")
        Swal.fire({
            title: "SEEMS THIS USER IS NOT EXISTS",
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
    }


    useEffect(() => {
        api.get(`${globalApi}/API/F10/all_User?RoleIdx=0`)
        .then((res) => {
            console.log(res.data)
            setAdmins(res.data.data)
        })
    }, [])

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
                    <Box sx={{ padding: 2 }}>
                    <Typography variant='h5'>
                        ADMIN USERS LISTING <hr/>
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
                                        <Grid item xs={decryptData(roleName) === "System Administrator" ? 6 : 12}>
                                            <Button onClick={handleClickOpen} sx={{ height: "3.5rem", width: "100%" }} color='warning'  variant="text" startIcon={<GroupAddIcon/>}>
                                                + ADMINS
                                            </Button>
                                        </Grid>
                                        
                                        {decryptData(roleName) === "System Administrator" ? (
                                        <Grid item xs={6}>
                                            <Button onClick={operatorListopen} sx={{ height: "3.5rem", width: "100%" }} color='warning'  variant="text" startIcon={<GroupAddIcon/>}>
                                                SHOW OPERATOR
                                            </Button>
                                        </Grid>
                                        ) : null}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Box>
                </Paper>
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
                            <StyledTableCell align="right">Full Name</StyledTableCell>
                            <StyledTableCell align="right">Role</StyledTableCell>
                            <StyledTableCell align="right">Birth Date</StyledTableCell>
                            <StyledTableCell align="right">Gender</StyledTableCell>
                            <StyledTableCell align="right">Address</StyledTableCell>
                            <StyledTableCell align="right">Email</StyledTableCell>
                            <StyledTableCell align="right">Contact Number</StyledTableCell>
                            <StyledTableCell align="center" colSpan={2}>ACTIONS</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {admins.map((admin) => (
                            <StyledTableRow key={admin.Idx}>
                            <StyledTableCell component="th" scope="row">
                                {admin.Username}
                            </StyledTableCell>
                            <StyledTableCell align="right">{`${admin.FirstName} ${admin.LastName}`}</StyledTableCell>
                            <StyledTableCell align="right">{admin.RoleName}</StyledTableCell>
                            <StyledTableCell align="right">{moment(admin.BirthDate).format('LL')}</StyledTableCell>
                            <StyledTableCell align="right">{admin.Gender}</StyledTableCell>
                            <StyledTableCell align="right">{admin.Address}</StyledTableCell>
                            <StyledTableCell align="right">{admin.Email}</StyledTableCell>
                            <StyledTableCell align="right">{admin.PhoneNumber}</StyledTableCell>
                            <StyledTableCell align="center">
                              <EditButton onClick={() => openEditModal(admin)}>
                                Edit
                              </EditButton>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <DeleteButton onClick={() => openDeleteModal(admin)}>
                                Delete
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
                background: 'rgba(70, 73, 63, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"REGISTER ADMINS"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={4}>
                <TextField 
                    margin="dense"
                    fullWidth label="EMAIL ADDRESS" 
                    id="fullWidth4" variant='filled' 
                    color='success' 
                    focused
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Grid>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
                <TextField 
                    margin="dense"
                    fullWidth
                    label="BIRTH DATE" 
                    id="fullWidth6"
                    variant='filled' 
                    color='success' 
                    focused
                    type='date'
                    value={BirthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        margin="dense"
                        fullWidth label="GENDER" 
                        id="fullWidth7" variant='filled' 
                        color='success' 
                        focused
                        select
                        value={Gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <MenuItem value="male">MALE</MenuItem>
                        <MenuItem value="female">FEMALE</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        margin="dense"
                        fullWidth label="ROLE" 
                        id="fullWidth8" variant='filled' 
                        color='success' 
                        focused
                        select
                        value={RoleIdx}
                        onChange={(e) => setRoleIdx(e.target.value)}
                    >
                        <MenuItem value="1">SYSTEM ADMIN</MenuItem>
                        <MenuItem value="2">CHAMBER ONE ADMIN</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="ADDRESS" 
                    id="fullWidth9" variant='filled' 
                    color='success' 
                    focused
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="ZIP CODE" 
                    id="fullWidth10" variant='filled' 
                    color='success' 
                    focused
                    value={ZipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="USERNAME" 
                    id="fullWidth11" variant='filled' 
                    color='success' 
                    focused
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
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
          <Button autoFocus onClick={createAdmin}>
            SUBMIT
          </Button>
          <Button onClick={handleClose} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog
    fullScreen={fullScreen}
    open={openModalOperatorList}
    onClose={operatorListclose}
    aria-labelledby="responsive-dialog-title"
    PaperProps={{
        style: {
            background: 'rgba(1, 1, 1, 1)',
            color: "white",
            maxWidth: 'none', // Set maxWidth to none for full width
        },
    }}
>
    <DialogTitle id="responsive-dialog-title">
        {"OPERATORS"}
    </DialogTitle>
    <DialogContent>
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Operator Name</StyledTableCell>
                        <StyledTableCell align="right">Full Name</StyledTableCell>
                        <StyledTableCell align="right">Operator ID</StyledTableCell>
                        <StyledTableCell align="right">Location</StyledTableCell>
                        <StyledTableCell align="right">Operator Balance</StyledTableCell>
                        <StyledTableCell align="right">Contact Number</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {operators.map((operator) => (
                        <StyledTableRow key={operator.idx}>
                        <StyledTableCell component="th" scope="row">
                            {operator.operator_name}
                        </StyledTableCell>
                        <StyledTableCell align="right">{`${operator.first_name} ${operator.last_name}`}</StyledTableCell>
                        <StyledTableCell align="right">{operator.operator_id}</StyledTableCell>
                        <StyledTableCell align="right">{operator.operator_location}</StyledTableCell>
                        <StyledTableCell align="right">{operator.operator_balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                        <StyledTableCell align="right">{operator.operator_contact_no}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </DialogContent>
    <DialogActions>
        <Button variant='outlined' color='error' onClick={operatorListclose} autoFocus>
            CLOSE
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
          {"EDIT ADMIN USER's DETAILS"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="EMAIL ADDRESS" 
                    id="fullWidth4" variant='filled' 
                    color='success' 
                    focused
                    value={EmailToEdit}
                    onChange={(e) => setEmailToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="BIRTH DATE" 
                    id="fullWidth6" variant='filled' 
                    color='success' 
                    focused
                    type='date'
                    value={BirthDateToEdit}
                    onChange={(e) => setBirthDateToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="ADDRESS" 
                    id="fullWidth9" variant='filled' 
                    color='success' 
                    focused
                    value={AddressToEdit}
                    onChange={(e) => setAddressToEdit(e.target.value)}
                />
                </Grid>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
                    <TextField 
                        margin="dense"
                        fullWidth label="GENDER" 
                        id="fullWidth7" variant='filled' 
                        color='success' 
                        focused
                        select
                        value={GenderToEdit}
                        onChange={(e) => setGenderToEdit(e.target.value)}
                    >
                        <MenuItem value="male">MALE</MenuItem>
                        <MenuItem value="female">FEMALE</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                <TextField 
                    margin="dense"
                    fullWidth label="ZIP CODE" 
                    id="fullWidth10" variant='filled' 
                    color='success' 
                    focused
                    value={ZipCodeToEdit}
                    onChange={(e) => setZipCodeToEdit(e.target.value)}
                />
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={editAdminUserDetails}>
            SUBMIT
          </Button>
          <Button onClick={closeEditModal} autoFocus>
            CANCEL
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`YOU ARE ABOUT TO DELETE ${sessionStorage.getItem("F10UserNameDelete")}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            BY CLICKING DELETE BUTTON THIS ADMIN WILL BE DELETED AND ITS NOT IRREVERSIBLE, THE ACCOUNT CANNOT BE RECOVERED
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAdminUser}>DELETE</Button>
          <Button onClick={closeDeleteModal}>CANCEL</Button>
        </DialogActions>
    </Dialog>
    <Backdrop open={loading} style={{ zIndex: 1 }}>
    <CircularProgress color="secondary" />
    </Backdrop>
      </>
    </Box>
  )
}

export default UserListings