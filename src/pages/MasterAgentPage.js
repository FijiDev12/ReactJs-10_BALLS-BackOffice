import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, Dialog, Typography, Stack, ButtonGroup, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, TableCell, IconButton, TableRow, TableContainer, Table, TableHead, TableBody, MenuItem, tableCellClasses } from '@mui/material';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs';
import api from "../Api/marble_ten"
import axios from "axios"
import { decryptData } from "../Utils"
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

  const StyledDateTimePicker = styled(DateTimePicker)({
  '& .MuiOutlinedInput-root': {
      '& fieldset': {
      borderColor: 'grey',
      },
  },
  });

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

  const generateLettersOnlyGuid = () => {
    const uuid = uuidv4();
  
    // Remove numbers and special characters, leaving only letters
    const lettersOnly = uuid.replace(/[0-9-]/g, '').substring(0, 5);
  
    return lettersOnly;
  };

function MasterAgentPage() {

  const queryParameters = new URLSearchParams(window.location.search)
  const affCode = queryParameters.get("affc")
  const session = queryParameters.get("d")
  const OPid = queryParameters.get("Id")
  const encryptedCode = queryParameters.get("enc")
  const agentLvl = queryParameters.get("lvl")
  const decryptedSession = decryptData(session)
  const affCodeToUse = decryptData(affCode)
  const uniqueId = generateLettersOnlyGuid();
  const navigate = useNavigate("")

  const [dateFrom, setDateFrom] = useState(dayjs().subtract(7, 'day').startOf('day'));
  const [dateTo, setDateTo] = useState(dayjs(dayjs(new Date())));
  const [loading, setLoading] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [players, setPlayers] = useState([])

  const [ first_name, setfirst_name ] = useState("")
  const [ middle_name, setmiddle_name ] = useState("")
  const [ last_name, setlast_name ] = useState("")
  const [ birthdate, setbirthdate ] = useState("")
  const [ mobile_no, setmobile_no ] = useState("")
  const [ passhash, setpasshash ] = useState("")
  const [ source_of_funds, setsource_of_funds ] = useState("")
  const [ ip_address, setip_address ] = useState("")

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const globalApi = process.env.REACT_APP_LOCAL_URL
  const getData = async()=>{
    const res = await axios.get('https://geolocation-db.com/json/')
    setip_address(res.data.IPv4)
  }

  const openPlayerReg = () => {
    getData()
    setShowRegModal(true)
  }

  const closePlayerReg = () => {
    setShowRegModal(false)
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const registerPlayer = () => {
    api.post(`${globalApi}/API/F10/player_registration`, {
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      birthdate: birthdate,
      mobile_no: mobile_no,
      email_address: `${first_name}.${uniqueId}@gmail.com`,
      passhash: passhash,
      source_of_funds: source_of_funds,
      ip_address: ip_address,
      affiliate_code: affCodeToUse
    })
    .then((res) => {
      console.log(res.data.data[0].responseCode)
      if ( res.data.data[0].responseCode === "0" ) {
        closePlayerReg()
        setfirst_name("")
        setmiddle_name("")
        setlast_name("")
        setmobile_no("")
        setsource_of_funds("")
        setpasshash("")
        Swal.fire({
          title: "PLAYER's ACCOUNT CREATED",
          icon: "success",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      } else if (  res.data.data[0].responseCode === "-1" ){
        closePlayerReg()
        Swal.fire({
          title: "Player name already exists",
          icon: "error",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      } else if (  res.data.data[0].responseCode === "-3" ){
        closePlayerReg()
        Swal.fire({
          title: "Mobile number already exists",
          icon: "error",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      } else if (  res.data.data[0].responseCode === "-6" ){
        closePlayerReg()
        Swal.fire({
          title: "Email address already exists",
          icon: "error",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      } else if (  res.data.data[0].responseCode === "-4" ){
        closePlayerReg()
        Swal.fire({
          title: "Player is below 21 years old",
          icon: "error",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      } else if (  res.data.data[0].responseCode === "-5" ){
        closePlayerReg()
        Swal.fire({
          title: "Affiliate account does not exists",
          icon: "error",
          confirmButtonText: "OKAY",
          allowOutsideClick: false
        })
        .then((res) => {
          if(res.isConfirmed){
            window.location.reload()
          }
        })
      }
    })
    // .catch((err) => {
    //   console.log(err)
    // })
  }

  const showPlayers = () => {
    setLoading(true)
    api.get(`${globalApi}/API/F10/selplayerbyaffialitecode?affiliate_code=${affCodeToUse}&date_from=${dateFrom.format('YYYY-MM-DD HH:mm:ss')}&date_to=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
    .then((res) => {
      console.log(res.data.data)
      setPlayers(res.data.data)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setLoading(false)
    })
  }


  return (
    <Box sx={{ display: "flex", color: "white"}}>
    <CssBaseline/>
      <Box sx={{ color: "white", width: "100vw", height: "100vh", overflowY: "auto"}}>
        <Box sx={{ paddingX: "1rem", paddingY: "1rem" }}>
          <Paper className='paperBG' sx={{ paddingX: "1rem", paddingY: 3, color: "white" }}>
            <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <Typography variant='body1'>Select Date Range</Typography>
              <SettingsPowerIcon sx={{ cursor: "pointer" }} onClick={() => navigate("/log-out") }/>
            </Stack>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                          <StyledDateTimePicker
                          label="Date From"
                          sx={{ width: "100%" }}
                          value={dateFrom}
                          onChange={(newValue) => setDateFrom(newValue)}
                          />
                      </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                          <StyledDateTimePicker
                          label="Date To"
                          sx={{ width: "100%" }}
                          value={dateTo}
                          onChange={(newValue) => setDateTo(newValue)}
                          />
                      </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} lg={1}>
                  <Button color='info' variant='outlined' disabled={loading} onClick={showPlayers} sx={{ width: "100%", height: "90%", marginTop: .8 }}>Show Players</Button>
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} item xs={12} lg={3}>
               
                  {agentLvl === "2"
                  ?
                  <>
                   <ButtonGroup sx={{ width: "100%" }} size="large" variant="text" color='info' aria-label="Basic button group">
                      <Button onClick={openPlayerReg} sx={{ width: "100%"}}>+ Player</Button>
                      <Button onClick={() => navigate(`/commissions?d=${encodeURIComponent(session)}&Id=${encodeURIComponent(OPid)}&enc=${encodeURIComponent(encryptedCode)}&affc=${encodeURIComponent(affCode)}&lvl=${encodeURIComponent(agentLvl)}`) } sx={{ width: "100%" }}>Commission</Button>
                      <Button onClick={() => navigate(`/user/subAgentList?d=${encodeURIComponent(session)}&Id=${encodeURIComponent(OPid)}&enc=${encodeURIComponent(encryptedCode)}&affc=${encodeURIComponent(affCode)}&lvl=${encodeURIComponent(agentLvl)}`) } sx={{ width: "100%"}}>Sub-Agent</Button>
                  </ButtonGroup>
                  </>
                  :
                  <>
                    <ButtonGroup sx={{ width: "100%" }} size="large" variant="text" color='info' aria-label="Basic button group">
                      <Button onClick={openPlayerReg} sx={{ width: "100%"}}>+ Player</Button>
                      <Button onClick={() => navigate(`/commissions?d=${encodeURIComponent(session)}&Id=${encodeURIComponent(OPid)}&enc=${encodeURIComponent(encryptedCode)}&affc=${encodeURIComponent(affCode)}&lvl=${encodeURIComponent(agentLvl)}`) } sx={{ width: "100%" }}>Commission</Button>
                    </ButtonGroup>
                  </>
                  }
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <Box sx={{ paddingY: "1rem" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>Player's Name</StyledTableCell>
                      <StyledTableCell align="center">Mobile Number</StyledTableCell>
                      <StyledTableCell align="center">Date Registered</StyledTableCell>
                      <StyledTableCell align="center">Birth Date</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Source of Funds</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {players.length === 0 ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={20} align='center'>
                          NO RESULTS FOUND
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : (
                      players.map((index) => (
                        <StyledTableRow key={index.idx}>
                        <StyledTableCell component="th" scope="row">
                            {`${index.first_name} ${index.last_name}`}
                        </StyledTableCell>
                        <StyledTableCell align="center">{index.mobile_no}</StyledTableCell>
                        <StyledTableCell align="center">{moment(index.date_created).format("LLL")}</StyledTableCell>
                        <StyledTableCell align="center">{moment(index.birthdate).format("LLL")}</StyledTableCell>
                        <StyledTableCell align="center" style={{ textAlign: 'center', fontWeight: 'bolder', color: index.is_active ? 'green' : 'red'}}>
                              {index.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </StyledTableCell>
                        <StyledTableCell align="center">{index.source_of_funds}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box> 
      <Dialog
        // fullScreen={fullScreen}
        open={showRegModal}
        onClose={closePlayerReg}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
            style: {
                background: 'rgba(70, 73, 63, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"REGISTER PLAYER"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{width: 600,maxWidth: '100%',}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="FIRST NAME" 
                    id="fullWidth12" variant='filled' 
                    color='success' 
                    focused
                    value={first_name}
                    onChange={(e) => setfirst_name(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="MIDDLE NAME" 
                    id="fullWidth13" variant='filled' 
                    color='success' 
                    focused
                    value={middle_name}
                    onChange={(e) => setmiddle_name(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="LAST NAME" 
                    id="fullWidth14" variant='filled' 
                    color='success' 
                    focused
                    value={last_name}
                    onChange={(e) => setlast_name(e.target.value)}
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
                    value={birthdate}
                    onChange={(e) => setbirthdate(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField 
                    margin="dense"
                    fullWidth label="MOBILE NUMBER" 
                    id="fullWidth3" variant='filled' 
                    color='success' 
                    focused
                    value={mobile_no}
                    onChange={(e) => setmobile_no(e.target.value)}
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
                        value={passhash}
                        onChange={(e) => setpasshash(e.target.value)}
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
                        fullWidth label="SOURCE OF FUNDS" 
                        id="fullWidth7" variant='filled' 
                        color='success' 
                        focused
                        select
                        value={source_of_funds}
                        onChange={(e) => setsource_of_funds(e.target.value)}
                    >
                        <MenuItem value="salary">SALARY</MenuItem>
                        <MenuItem value="female">PENSION</MenuItem>
                        <MenuItem value="remittance">REMITTANCE</MenuItem>
                        <MenuItem value="business">BUSINESS</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={closePlayerReg} autoFocus>
            CANCEL
          </Button>
          <Button variant='contained' color='success' autoFocus onClick={registerPlayer}>
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>  
    </Box>
  )
}

export default MasterAgentPage