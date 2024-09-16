import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, Snackbar , Typography, Alert, Dialog, Button, DialogActions, DialogContent, TextField, Stack, DialogTitle, Backdrop, CircularProgress, TableRow, TableContainer, Table, TableHead, TableBody, DialogContentText, Slide } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from "../Api/F10"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decryptData } from '../Utils';
import moneyGif from "../assets/cashGif.gif"

const drawerWidth = 240;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

function CashierManagement() {

    const queryParameters = new URLSearchParams(window.location.search)
    const adminsession = queryParameters.get("d")
    const roleName = queryParameters.get("r")
    const username = queryParameters.get("u")
    const cashierID = queryParameters.get("cid")
    const sessionToBeUse = decryptData(adminsession);

    const navigate = useNavigate()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [ open, setOpen ] = useState(true);
    const [ openSnackBar, setOpenSnackBar ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ WalletBalance, setWalletBalance ] = useState("");
    const [ PlayerName, setPlayerName ] = useState("");

    const [ mobile_no, setMobile_no ] = useState("")
    const [ amount, setAmount ] = useState("")
    const [ ext_id, setext_id ] = useState("")
    const [ Ip_address, setIp_address ] = useState(null)
    const [ cashinOrNot, setCashinOrNot ] = useState(null)

    const [ showdepModal, setShowdepModal ] = useState(false)
    const [ showwithModal, setShowwithModal ] = useState(false)

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenSnackBar(false);
    };

    const handleClick = async () => {
      checkWalletBalace();
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (mobile_no === "") {
        setOpenSnackBar(true)
      } else {
        setShowModal(true)
      }
    }

    const closeModal = () => setShowModal(false)

    
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

  const getData = async()=>{
    const res = await axios.get('https://geolocation-db.com/json/')
    console.log(res.data.IPv4)
    setIp_address(res.data.IPv4)
  }


  const cashinTransaction = () => {
    getData()
    setCashinOrNot(1)
    checkUser()
    setShowdepModal(true)
  }

  const closedepmodal = () => {
    setShowdepModal(false)
  }


  const cashOutTransaction = () => {
    checkUser()
    getData()
    setCashinOrNot(0)
    setShowwithModal(true)
  }

  const closewithmodal = () => {
    setShowwithModal(false)
  }

  console.log(cashinOrNot)

  const checkWalletBalace = () => {
    api.get(`${process.env.REACT_APP_F10_URL}/API/F10/playerwalletbalance?mobile_no=${mobile_no}`)
    .then((res) => {
      const fullName = `${res.data.data[0].firstName} ${res.data.data[0].lastName}`
      setWalletBalance(res.data.data[0].walletBalance)
      setPlayerName(fullName)
    })
  }


  const cashTransaction = () => {

    api.post(`${process.env.REACT_APP_F10_URL}/API/F10/insiscashincashtransc`, {
      cashier_id : decryptData(cashierID),
      operator_id: "OpF10",
      mobile_no: mobile_no,
      amount: amount,
      is_cashin: cashinOrNot,
      ip_address: Ip_address,
      ext_id: ext_id
    })
    .then((res) => {
      console.log(res.data.data)
      if(res.data.data[0].responseCode === "0"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `CASH TRANSACTION SUCCESS`,
          text: `transaction successfully done to ${mobile_no}`,
          icon: "success",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-500"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `External ID already exists.`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-400"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `Insufficient player account balance.`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-300"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `Cashier ID does not exists`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-200"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `Operator ID does not exists`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-100"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `Account does not exists`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
      else if (res.data.data[0].responseCode === "-401"){
        closedepmodal()
        closewithmodal()
        Swal.fire({
          title: `Insufficient operator balance.`,
          icon: "error",
          allowOutsideClick: false
        })
        .then((res) => {
          if (res.isConfirmed){
            sessionStorage.removeItem("F10DataPlayerName")
            sessionStorage.removeItem("F10DataWB$%")
            window.location.reload()
          }
        })
      }
    })
    .catch((err) => {
      closedepmodal()
      closewithmodal()
      Swal.fire({
        title: `ERROR OCCURED`,
        text: `PLEASE CHECK ALL THE INPUT FIELDS`,
        icon: "error",
        allowOutsideClick: false
      })
      .then((res) => {
        if (res.isConfirmed){
          window.location.reload()
        }
      })
    })
  }

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto" }}  open={open}>
        <Box sx={{ paddingTop: 8, width: "100%" }}>
        <Box
            sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
                m: 1,
                width: "100%",
                height: "80vh",
            },
            justifyContent: "center",
            alignItems: "center",
            }}
            >
            <Paper  sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="paperBG" elevation={3}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "70%" }}>
                      <Typography sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }} variant='h4'>CASH IN/OUT</Typography>
                      <Typography sx={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingBottom: "1rem" }} variant='body1'>Kindly complete the input fields appropriately, ensuring that the External ID is unique for each entry.</Typography>
                        <TextField
                          value={decryptData(cashierID)}
                          sx={{ marginY: "1rem" }}
                          focused
                          id="outlined-basic"
                          label="Cashier ID"
                          variant="standard"
                          color='success'
                          />
                          <TextField
                          value={mobile_no}
                          onChange={(e) => setMobile_no(e.target.value)}
                          sx={{ marginY: "1rem" }}
                          focused id="outlined-basic"
                          label="Mobile Number"
                          variant="standard"
                          color='success'
                          />
                          <TextField
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          sx={{ marginY: "1rem" }}
                          focused id="outlined-basic"
                          label="Amount"
                          variant="standard"
                          color='success'
                          />
                          <TextField
                          value={ext_id}
                          onChange={(e) => setext_id(e.target.value)}
                          sx={{ marginY: "1rem" }}
                          focused id="outlined-basic"
                          label="External ID"
                          variant="standard"
                          color='success'
                          />
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                              <Button
                                sx={{ width: "100%", fontWeight: "bolder",  color: "white" }}
                                color='success'
                                variant="outlined"
                                onClick={cashOutTransaction}
                                >
                                WITHDRAW
                              </Button>
                          </Grid>
                          <Grid item xs={4}>
                              <Button
                                sx={{ width: "100%", fontWeight: "bolder",  color: "white" }}
                                color='success'
                                variant="outlined"
                                onClick={cashinTransaction}
                                >
                                  Deposit
                              </Button>
                          </Grid>
                          <Grid item xs={4}>
                              <Button
                                onClick={handleClick}
                                sx={{ width: "100%", fontWeight: "bolder", color: "white" }}
                                color='success'
                                variant="outlined"
                                >
                                Check Balance
                              </Button>
                          </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Box>
        </Box>
    </Main>
    <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Please Input Player's Mobile Number in Input Field
        </Alert>
      </Snackbar>
      <Dialog
        fullScreen={fullScreen}
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
            style: {
                background: "rgba(70, 73, 63, 1)",
                color: "white"
            }
        }}  
      >
        <DialogTitle>{}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box sx={{width: 600,maxWidth: '100%', display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
              <Stack>
                <img src={moneyGif}/>
                <Typography sx={{ paddingBottom: "1rem" }} variant='h6'>CHECK BALANCE</Typography>
                <Typography variant='body1'>{PlayerName}'s Wallet balance is</Typography>
                <Typography variant='h6'>{WalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
              </Stack>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='success' sx={{ color: "white" }} onClick={closeModal}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showdepModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={closedepmodal}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
              background: "rgba(70, 73, 63, 1)",
              color: "white"
          }
      }}
      hideBackdrop={true}
      
      >
        <DialogTitle>{"CASH-IN TRANSACTION"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{color: "white"}} id="alert-dialog-slide-description">
          By selecting "OK," you are confirming your agreement to initiate a deposit/cashin to the specified number {mobile_no}. This transaction is irreversible, so please ensure you include a distinct external ID for tracking purposes. Thank you!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={closedepmodal}>Disagree</Button>
          <Button variant='contained' color='success' onClick={cashTransaction}>Agree</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showwithModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={closewithmodal}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
              background: "rgba(70, 73, 63, 1)",
              color: "white"
          }
      }}
      hideBackdrop={true}
      
      >
        <DialogTitle>{"CASH-OUT TRANSACTION"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{color: "white"}} id="alert-dialog-slide-description">
          By selecting "OK," you are confirming your agreement to initiate a withdraw/cashout to the specified number {mobile_no}. This transaction is irreversible, so please ensure you include a distinct external ID for tracking purposes. Thank you!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={closewithmodal}>Disagree</Button>
          <Button variant='contained' color='success' onClick={cashTransaction}>Agree</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CashierManagement