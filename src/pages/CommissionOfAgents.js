import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, Dialog, Typography, Stack, ButtonGroup, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, TableCell, IconButton, TableRow, TableContainer, Table, TableHead, TableBody, MenuItem, tableCellClasses, TableFooter } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs';
import api from "../Api/F10"
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

      const StyledFooterTableRow = styled(TableRow)(({ theme }) => ({
        background: '#1B2430',
        
    }));
  
    const generateLettersOnlyGuid = () => {
      const uuid = uuidv4();
    
      // Remove numbers and special characters, leaving only letters
      const lettersOnly = uuid.replace(/[0-9-]/g, '').substring(0, 5);
    
      return lettersOnly;
    };

function CommissionOfAgents() {

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
    const [showCommission, setShowCommission] = useState([])

    const [totalComm, setTotalComm] = useState("")
    const [totalGross, setTotalGross] = useState("")
    const [totalSaComm, setTotalSaComm] = useState("")
    const [totalMaComm, setTotalMaComm] = useState("")


    const showComm = () => {
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/getagentcommission?affiliate_code=${affCodeToUse}&date_from=${dateFrom.format('YYYY-MM-DD HH:mm:ss')}&date_to=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
        .then((res) => {
            setShowCommission(res.data.data)

            if (Array.isArray(res.data.data)) {
                // If data is an array of objects
                let totalComms = 0;
                let gross = 0
                let totalSaComm = 0
                let totalMaComm = 0
    
                res.data.data.forEach((item) => {
                    const maComms = item.MAComms || 0;
                    const saComms = item.SAComms || 0;
    
                    totalComms += maComms - saComms;
                    gross += maComms + saComms
                    totalSaComm += saComms;
                    totalMaComm += maComms;
                });
    
                setTotalComm(totalComms)
                setTotalGross(gross)
                setTotalSaComm(totalSaComm);
                setTotalMaComm(totalMaComm);
                
                console.log("Total Commission:", totalComms);
                console.log("Total gross:", gross);
                console.log("Total totalSaComm:", totalSaComm);
                console.log("Total totalMaComm:", totalMaComm);
            } else {
                console.error("Invalid data format. Expected an array.");
            }
            
        })
        .catch((err) => {
            console.log(err)
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
              <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => navigate(`/agentspage?d=${encodeURIComponent(session)}&Id=${encodeURIComponent(OPid)}&enc=${encodeURIComponent(encryptedCode)}&affc=${encodeURIComponent(affCode)}&lvl=${encodeURIComponent(agentLvl)}`) }/>
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
                <Grid item xs={12} lg={4}>
                  <Button onClick={showComm} color='info' variant='outlined' disabled={loading} sx={{ width: "100%", height: "90%", marginTop: .7 }}>Show Commissions</Button>
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} item xs={12} lg={3}>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <Box sx={{ paddingY: "1rem" }}>
            {agentLvl === "2"
            ?
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>Player's Name</StyledTableCell>
                      <StyledTableCell align="center">Sub-Agent</StyledTableCell>
                      <StyledTableCell align="center">Total Bet</StyledTableCell>
                      <StyledTableCell align="center">Total Win</StyledTableCell>
                      <StyledTableCell align="center">Master Agent Commission</StyledTableCell>
                      <StyledTableCell align="center">Sub Agent Commission</StyledTableCell>
                      <StyledTableCell align="center">Gross Amount</StyledTableCell>
                      <StyledTableCell align="center">Net Pay</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {showCommission.length === 0 ? (
                        <StyledTableRow>
                            <StyledTableCell colSpan={20} align='center'>
                                NO RESULTS FOUND
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        showCommission.map((index) => (
                            <StyledTableRow key={index.PlayerName}>
                                <StyledTableCell component="th" scope="row">
                                    {index.PlayerName}
                                </StyledTableCell>
                                <StyledTableCell align="center">{index.SA.length === 0 ? '-' : index.SA}</StyledTableCell>
                                <StyledTableCell align="center">{index.TotalBets.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center">{index.TotalWins.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center">{index.MAComms.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center">{index.SAComms.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <StyledFooterTableRow>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="left"><Typography variant='body2' sx={{color: "white"}}>TOTAL</Typography></StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant='body2' sx={{color: "white"}}>{totalMaComm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant='body2' sx={{color: "white"}}>{totalSaComm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant='body2' sx={{color: "white"}}>{totalGross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant='body2' sx={{color: "white"}}>{totalComm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography></StyledTableCell>
                    </StyledFooterTableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </>
          :
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>Player's Name</StyledTableCell>
                      <StyledTableCell align="center">Total Bet</StyledTableCell>
                      <StyledTableCell align="center">Total Win</StyledTableCell>
                      <StyledTableCell align="center">Sub Agent Commission</StyledTableCell>
                      <StyledTableCell align="center">Net Pay</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {showCommission.length === 0 ? (
                        <StyledTableRow>
                            <StyledTableCell colSpan={20} align='center'>
                                NO RESULTS FOUND
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        showCommission.map((index) => (
                            <StyledTableRow key={index.PlayerName}>
                                <StyledTableCell component="th" scope="row">
                                    {index.PlayerName}
                                </StyledTableCell>
                                <StyledTableCell align="center">{index.TotalBets.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center">{index.TotalWins.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center">{index.SAComms.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <StyledFooterTableRow>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="left"><Typography variant='body2' sx={{color: "white"}}>TOTAL</Typography></StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center"><Typography variant='body2' sx={{color: "white"}}>{totalSaComm.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography></StyledTableCell>
                    </StyledFooterTableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </>
          }
          </Box>
        </Box>
      </Box> 
      {/* <Dialog
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
      </Dialog>   */}
    </Box>
  )
}

export default CommissionOfAgents