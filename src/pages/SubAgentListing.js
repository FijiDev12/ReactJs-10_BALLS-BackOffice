import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, Dialog, Typography, Stack, ButtonGroup, Button, DialogActions, DialogContent, TextField, InputAdornment, DialogTitle, TableCell, IconButton, TableRow, TableContainer, Table, TableHead, TableBody, MenuItem, tableCellClasses, TableFooter } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

      const StyledFooterTableRow = styled(TableRow)(({ theme }) => ({
        background: '#1B2430',
        
    }));
  
    const generateLettersOnlyGuid = () => {
      const uuid = uuidv4();
    
      // Remove numbers and special characters, leaving only letters
      const lettersOnly = uuid.replace(/[0-9-]/g, '').substring(0, 5);
    
      return lettersOnly;
    };

function SubAgentListing() {

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

    const [showAgentRegister, setShowAgentRegister] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    
    const [searchQuery, setSearchQuery] = useState('');
    const [subAgentList, setSubAgentList] = useState([])


    const [ FirstName, setFirstName ] = useState("")
    const [ MiddleName, setMiddleName ] = useState("")
    const [ LastName, setLastName ] = useState("")
    const [ MobileNo, setMobileNo ] = useState("")
    const [ PassHash, setPassHash ] = useState("")


    const openDialogAgent = () => {
        setShowAgentRegister(true)
    }

    const closeDialogAgent = () => {
        setShowAgentRegister(false)
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };


    useEffect (() => {
        api.get(`${process.env.REACT_APP_F10_URL}/API/F10/getsubagentbyma?affiliate_code=${affCodeToUse}`)
        .then((res) => {
            console.log(res.data.data)
            setSubAgentList(res.data.data)
        })
    }, [])

    const filteredAgent = subAgentList.filter((item) =>
    (item.FirstName && item.FirstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.MiddleName && item.MiddleName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.LastName && item.LastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.EncryptCode && item.EncryptCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.MobileNo && item.MobileNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.Commission && item.Commission.toLowerCase().includes(searchQuery.toLowerCase()))
    );



    const subAgentRegistration = () => {
        api.post(`${process.env.REACT_APP_F10_URL}/API/F10/insagentregistration`, {
            FirstName: FirstName,
            MiddleName: MiddleName,
            LastName: LastName,
            MobileNo: MobileNo,
            PassHash: PassHash,
            ParentIdx: OPid,
            AffiliateLevel: 3,
            OperatorId: "OpF10",
            Commission: 2,
            EmailAddress: `${FirstName}.${uniqueId}@gmail.com`
        })
        .then((res) => {
            console.log(res.data.data)
            if (res.data.data[0].responseMessage === "Affiliate account successfully created"){
                setFirstName("")
                setMiddleName("")
                setLastName("")
                setMobileNo("")
                setPassHash("")
                closeDialogAgent()

                Swal.fire({
                    title: "Affiliate Registration Success",
                    icon: "success",
                    confirmButtonText: "OK",
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                  });
            }
            else if (res.data.data[0].responseMessage === "Affiliate id already exists"){
                closeDialogAgent()
                Swal.fire({
                    title: "Affiliate name already exists",
                    icon: "error"
                })
            }
            else if (res.data.data[0].responseMessage === "Mobile no already exists"){
                closeDialogAgent()
                Swal.fire({
                    title: "Mobile Number already exists",
                    icon: "error"
                })
            }
            else if (res.data.data[0].responseMessage === "Email Address already exists"){
                closeDialogAgent()
                Swal.fire({
                    title: "Email Address already exists",
                    icon: "error"
                })
            }
        })
    }


   
  return (
    <Box sx={{ display: "flex", color: "white"}}>
    <CssBaseline/>
      <Box sx={{ color: "white", width: "100vw", height: "100vh", overflowY: "auto"}}>
        <Box sx={{ paddingX: "1rem", paddingY: "1rem" }}>
          <Paper className='paperBG' sx={{ paddingX: "1rem", paddingY: 3, color: "white" }}>
            <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <Typography variant='h6'>Sub Agent List</Typography>
                <Stack sx={{ paddingRight: ".5rem" }} direction="row" spacing={2}>
                    <PersonAddIcon onClick={openDialogAgent} sx={{ cursor: "pointer" }}/>
                    <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => navigate(`/agentspage?d=${encodeURIComponent(session)}&Id=${encodeURIComponent(OPid)}&enc=${encodeURIComponent(encryptedCode)}&affc=${encodeURIComponent(affCode)}&lvl=${encodeURIComponent(agentLvl)}`) }/>
                </Stack>
            </Stack>
            <TableContainer sx={{ marginTop: 8 }} component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>Code</StyledTableCell>
                      <StyledTableCell align="center">First Name</StyledTableCell>
                      <StyledTableCell align="center">Middle Name</StyledTableCell>
                      <StyledTableCell align="center">Last Name</StyledTableCell>
                      <StyledTableCell align="center">Contact Number</StyledTableCell>
                      <StyledTableCell align="center">Date Registered</StyledTableCell>
                      <StyledTableCell align="center">Player Count</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAgent.length === 0 ? (
                        <StyledTableRow>
                            <StyledTableCell colSpan={20} align='center'>
                                NO RESULTS FOUND
                            </StyledTableCell>
                        </StyledTableRow>
                    ) : (
                        filteredAgent.map((index) => (
                            <StyledTableRow key={index.Idx}>
                                <StyledTableCell component="th" scope="row">
                                    {index.EncryptCode}
                                </StyledTableCell>
                                <StyledTableCell align="center">{index.FirstName}</StyledTableCell>
                                <StyledTableCell align="center">{index.MiddleName}</StyledTableCell>
                                <StyledTableCell align="center">{index.LastName}</StyledTableCell>
                                <StyledTableCell align="center">{index.MobileNo}</StyledTableCell>
                                <StyledTableCell align="center">{moment(index.DateCreated).format('L')}</StyledTableCell>
                                <StyledTableCell align="center">{index.PlayerCount}</StyledTableCell>
                                <StyledTableCell align="center" style={{ textAlign: 'center', fontWeight: 'bolder', color: index.IsActive ? 'green' : 'red'}}>
                                    {index.IsActive ? 'ACTIVE' : 'INACTIVE'}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Box sx={{ paddingY: "1rem" }}>
            
          </Box>
        </Box>
      </Box> 
      <Dialog
        // fullScreen={fullScreen}
        open={showAgentRegister}
        onClose={closeDialogAgent}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
            style: {
                background: 'rgba(70, 73, 63, 1)',
                color: "white"
            },
          }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"REGISTER SUB AGENT"}
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
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    margin="dense"
                    fullWidth label="MIDDLE NAME" 
                    id="fullWidth13" variant='filled' 
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
                    id="fullWidth14" variant='filled' 
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
                    id="12" variant='filled' 
                    color='success' 
                    focused
                    value={MobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
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
          <Button color='error' onClick={closeDialogAgent} autoFocus>
            CANCEL
          </Button>
          <Button variant='contained' color='success' autoFocus onClick={subAgentRegistration}>
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>  
    </Box>
  )
}

export default SubAgentListing