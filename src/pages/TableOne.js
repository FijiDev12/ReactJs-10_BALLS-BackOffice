import React, { useEffect, useState } from 'react'
import { Box, CssBaseline, Grid, Paper, Stack, Typography, Switch, FormControlLabel, Button, Dialog, Slide, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar,Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import racingFlag from "../assets/racingFlag.png"
import imagedefault from "../assets/default.png"
import api from "../Api/F10"
import moment from 'moment';
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
import { decryptData } from '../Utils';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import gifBall from "../assets/gifBall.gif"
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import dayjs from 'dayjs';
import { socket } from '../socket/socket';

// const socket = io.connect("http://192.168.1.85:6200")

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

function TableOne() {
    
    const navigate = useNavigate()
    const queryParameters = new URLSearchParams(window.location.search)
    const username = queryParameters.get("u")
    const adminsession = queryParameters.get("d")
    const userToBeUsed = decryptData(username);
    const sessionToBeUse = decryptData(adminsession);

    const handleDrawerOpen = () => {
        setOpen(true);
      };
    
      const handleDrawerClose = () => {
        setOpen(false);
      };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [ballGames, setBallGames] = useState([]);
    const [selectedBall, setSelectedBall] = useState(null);
    const [confirmingSelection, setConfirmingSelection] = useState(false);
    const [placement, setPlacement] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalEndRound, setShowModalEndRound] = useState(false);
    const [open, setOpen] = useState(true);

    const [ gameIdxtoUseInOneCycle, setGameIdxtoUseInOneCycle ] = useState("")
    const [remainingTime, setRemainingTime] = useState(10); //90 orig
    const [ show, setShow ] = useState(false)

    const [switch1, setSwitch1] = useState(() => {
        return sessionStorage.getItem('switch1') === 'true';
      });
    const [switch2, setSwitch2] = useState(() => {
        return sessionStorage.getItem('switch2') === 'true';
      });
    const [switch3, setSwitch3] = useState(() => {
        return sessionStorage.getItem('switch3') === 'true';
      });
    // const [switch4, setSwitch4] = useState(() => {
    //     return sessionStorage.getItem('switch4') === 'true';
    //   });

    const [ switch4, setSwitch4 ] = useState(false)

    const [time1, setTime1] = useState("01:00"); //"03:00" original
    const [switchStartTime1, setSwitchStartTime1] = useState(
      sessionStorage.getItem("switchStartTime1")
        ? parseInt(sessionStorage.getItem("switchStartTime1"))
        : null
    );
    const [ timerColor1, setTimeColor1 ] = useState("white")
    const [time2, setTime2] = useState("00:10");
    const [switchStartTime2, setSwitchStartTime2] = useState(
      sessionStorage.getItem("switchStartTime2")
        ? parseInt(sessionStorage.getItem("switchStartTime2"))
        : null
    );
    const [ timerColor2, setTimeColor2 ] = useState("white")
    const [time3, setTime3] = useState("00:00");
    const [switchStartTime3, setSwitchStartTime3] = useState(
      sessionStorage.getItem("switchStartTime3")
        ? parseInt(sessionStorage.getItem("switchStartTime3"))
        : null
    );
    const [ timerColor3, setTimeColor3 ] = useState("white")
    const [ playersWatching, setPlayersWatching ] = useState("")

    const [ currentActive, setCurrentActive ] = useState("")
    const [ currentBet, setCurrentBet ] = useState("")
    const [ currentRoundId, setCurrentRoundId ] = useState("")
    const [clickCount, setClickCount] = useState(0);
    const [ ballPlacing, setBallPlacing ] = useState("")
    const [ cancellationRoundId, setCancellationRoundId ] = useState("")
    const [clickedBalls, setClickedBalls] = useState([]);

    var today = moment().format('Y-MM-DD');
    var tomorrow = moment().add(1, 'day').format('Y-MM-DD');

    const [From, setFrom] = useState(today)
    const [To, setTo] = useState(tomorrow)

    var apiIdx2 = 1

    useEffect(() => {
        socket.emit("generate_get_games", { apiIdx2, From, To })
        socket.on("chamberone", (data) => {
          if(data.data[0].RoundStatus === 0 || 1 || 2 || 10) {
            // checkUser()
          }
        })
      }, [socket])

    /* ----- CHECK USERS HAVE SESSION ----- */

        useEffect(() => {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/adminLoginSession?SessionID=${sessionToBeUse}`)
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
        

    /* ----- CHECK USERS HAVE SESSION ----- */

    /* ----- BALL FUNCTIONS STARTS HERE ----- */

        const closeEndRoundModal = () => {
            setShowModalEndRound(false)
        }

        const storedBallId = decryptData(sessionStorage.getItem('F10_Data$WB1154'));

        useEffect(() => {
            const storedBall = ballGames.find((ball) => ball.id === storedBallId);
            if (storedBall) {
            setSelectedBall(storedBall);
            }
        }, [storedBallId]);

        useEffect(() => {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/get_game_rooms?GameIdx=1`)
                .then((res) => {
                const ballSet = res.data.data[0].ballSet;
                const ballSetInt = JSON.parse(ballSet.replace(/'/g, '"'));
                const BallsImg = [
                    Ball1, Ball2, Ball3, Ball4, Ball5, Ball6, Ball7, Ball8, Ball9,Ball10
                ];
                
                const BallsArray = ballSetInt.map((BallValue, index) => {
                    const uniqueId = `${BallValue}`;
                    const image = BallsImg[index];
                    return {
                    id: uniqueId,
                    image: image
                    };
                });

                setBallGames(BallsArray);
                });
            }, []);


        const handleCardClick = (ballId) => {
            const placements = ['Winner', 'Second', 'Third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
            const placementIndex = clickCount % placements.length; // Get the index using modulo operator
            const placement = `F10_${placements[placementIndex]}`;
            const selectedBall = ballGames.find((ball) => ball.id === ballId);
            
            if (selectedBall) {
                const ballID = CryptoJS.AES.encrypt(selectedBall.id, process.env.REACT_APP_CRYPTO_KEY).toString();
                // const ballID = selectedBall.id
                sessionStorage.setItem(placement, ballID);
                sessionStorage.setItem(`${placement}_Image`, selectedBall.image);
                
                setClickCount(clickCount + 1);
                setClickedBalls([...clickedBalls, ballId]);
            }
        };
    
        const resetThePlacing = () => {
            sessionStorage.removeItem("F10_Winner")
            sessionStorage.removeItem("F10_Winner_Image")
            sessionStorage.removeItem("F10_Second")
            sessionStorage.removeItem("F10_Second_Image")
            sessionStorage.removeItem("F10_Third")
            sessionStorage.removeItem("F10_Third_Image")
            sessionStorage.removeItem("F10_fourth")
            sessionStorage.removeItem("F10_fourth_Image")
            sessionStorage.removeItem("F10_fifth")
            sessionStorage.removeItem("F10_fifth_Image")
            sessionStorage.removeItem("F10_sixth")
            sessionStorage.removeItem("F10_sixth_Image")
            sessionStorage.removeItem("F10_seventh")
            sessionStorage.removeItem("F10_seventh_Image")
            sessionStorage.removeItem("F10_eighth")
            sessionStorage.removeItem("F10_eighth_Image")
            sessionStorage.removeItem("F10_ninth")
            sessionStorage.removeItem("F10_ninth_Image")
            sessionStorage.removeItem("F10_tenth")
            sessionStorage.removeItem("F10_tenth_Image")
            window.location.reload()
        }

        const closeModal = () => {
            setSelectedBall(null);
            setConfirmingSelection(false);
            setShowModal(false);
        };

        const prevWinningBall = () => {
            sessionStorage.setItem("winningBall", sessionStorage.getItem("F10_Winner_Image"))
            sessionStorage.setItem("2ndBall", sessionStorage.getItem("F10_Second_Image"))
            sessionStorage.setItem("3rdBall", sessionStorage.getItem("F10_Third_Image"))
            sessionStorage.setItem("4thBall", sessionStorage.getItem("F10_fourth_Image"))
            sessionStorage.setItem("5thBall", sessionStorage.getItem("F10_fifth_Image"))
            sessionStorage.setItem("6thBall", sessionStorage.getItem("F10_sixth_Image"))
            sessionStorage.setItem("7thBall", sessionStorage.getItem("F10_seventh_Image"))
            sessionStorage.setItem("8thBall", sessionStorage.getItem("F10_eighth_Image"))
            sessionStorage.setItem("9thBall", sessionStorage.getItem("F10_ninth_Image"))
            sessionStorage.setItem("10thBall", sessionStorage.getItem("F10_tenth_Image"))
         }


        const winningBall = sessionStorage.getItem("winningBall")
        const winningBall2 = sessionStorage.getItem("2ndBall")
        const winningBall3 = sessionStorage.getItem("3rdBall")
        const winningBall4 = sessionStorage.getItem("4thBall")
        const winningBall5 = sessionStorage.getItem("5thBall")
        const winningBall6 = sessionStorage.getItem("6thBall")
        const winningBall7 = sessionStorage.getItem("7thBall")
        const winningBall8 = sessionStorage.getItem("8thBall")
        const winningBall9 = sessionStorage.getItem("9thBall")
        const winningBall10 = sessionStorage.getItem("10thBall")
    /* ----- BALL FUNCTIONS ENDS HERE ----- */

    /* ----- SWITCHES TIMER FUNCTIONS STARTS HERE ----- */

    useEffect(() => {
        if (switchStartTime1 !== null) {
          const initialTime =60; //180 original
          const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - switchStartTime1) / 1000);
            const remainingSeconds = initialTime - elapsedSeconds;
            setTime1(formatTime(remainingSeconds));
      
            if (remainingSeconds <= 10) {
              setTimeColor1("red");
            }
      
            if (remainingSeconds <= 0) {
                clearInterval(interval);
                setTimeColor1("red");
                setTime1("00:00")
                switch2Function({ target: { checked: true } });
            }
          }, 1000);
      
          return () => {
            clearInterval(interval);
          };
        }
      }, [switchStartTime1]);
    
      useEffect(() => {
        if (switchStartTime1 !== null) {
          sessionStorage.setItem("switchStartTime1", switchStartTime1.toString());
        }
      }, [switchStartTime1]);



      useEffect(() => {
        if (switchStartTime2 !== null) {
          const initialTime = 10;
          const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - switchStartTime2) / 1000);
            const remainingSeconds = initialTime - elapsedSeconds;
            setTime2(formatTime(remainingSeconds));
    
            if (remainingSeconds <= 5) {
              setTimeColor2("red");
            }
      
            if (remainingSeconds <= 0) {
              clearInterval(interval);
              setTimeColor2("red");
              setTime2("00:00")
              switch3Function({ target: { checked: true } });
            }
          }, 1000);
      
          return () => {
            clearInterval(interval);
          };
        }
      }, [switchStartTime2]);
    
      useEffect(() => {
        if (switchStartTime2 !== null) {
          sessionStorage.setItem("switchStartTime2", switchStartTime2.toString());
        }
      }, [switchStartTime2]);


      useEffect(() => {
        if (switchStartTime3 !== null) {
          const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - switchStartTime3) / 1000);
            setTime3(formatTime(elapsedSeconds));
          }, 1000);
          return () => clearInterval(interval);
        }
      }, [switchStartTime3]);
    
      useEffect(() => {
        if (switchStartTime3 !== null) {
          sessionStorage.setItem("switchStartTime3", switchStartTime3.toString());
        }
      }, [switchStartTime3]);


      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(
          2,
          "0"
        )}`;
      };



    /* ----- SWITCHES TIMER FUNCTIONS ENDS HERE ----- */

    /* ----- END ROUND MODAL FUNCTIONS ----- */

    useEffect(() => {
        const storedRemainingTime = sessionStorage.getItem('remainingTime');
        const storedShow = sessionStorage.getItem('showModal');
    
        if (storedRemainingTime !== null && storedShow !== null) {
          setRemainingTime(parseInt(storedRemainingTime, 10));
          setShow(storedShow === 'true');
        }
      }, []);
  
      useEffect(() => {
        sessionStorage.setItem('remainingTime', remainingTime);
        sessionStorage.setItem('showModal', show);
      }, [remainingTime, show]);
  
      useEffect(() => {
        if (show) {
          const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
              if (prevTime === 0) {
                clearInterval(timer);
                handleClose();
                sessionStorage.removeItem("F10_Winner_Image")
                sessionStorage.removeItem("F10_Second_Image")
                sessionStorage.removeItem("F10_Third_Image")
                sessionStorage.removeItem("F10_fourth_Image")
                sessionStorage.removeItem("F10_fifth_Image")
                sessionStorage.removeItem("F10_sixth_Image")
                sessionStorage.removeItem("F10_seventh_Image")
                sessionStorage.removeItem("F10_eighth_Image")
                sessionStorage.removeItem("F10_ninth_Image")
                sessionStorage.removeItem("F10_tenth_Image")
                sessionStorage.removeItem("switchStartTime1");
                sessionStorage.removeItem("switchStartTime2");
                sessionStorage.removeItem("switchStartTime3");
                sessionStorage.removeItem("F10_Data$$TimeCaptureOpen");
                sessionStorage.removeItem("F10_Data$$TimeCaptureClose");
                sessionStorage.removeItem("F10_Data$$TimeCaptureDraw");
                sessionStorage.removeItem("F10_Data$GID3322");
                sessionStorage.removeItem("F10_Winner");
                sessionStorage.removeItem("F10_Second");
                sessionStorage.removeItem("F10_tenth");
                sessionStorage.removeItem("F10_seventh");
                sessionStorage.removeItem("F10_ninth");
                sessionStorage.removeItem("F10_Third");
                sessionStorage.removeItem("F10_eighth");
                sessionStorage.removeItem("F10_fourth");
                sessionStorage.removeItem("F10_fifth");
                sessionStorage.removeItem("F10_sixth");
                window.location.reload()
                return 10; //90orig
              } else {
                return prevTime - 1;
              }
            });
          }, 1000);
    
          return () => {
            clearInterval(timer);
          };
        }
      }, [show]);
    
      const handleClose = () => {
        setShow(false);
        sessionStorage.removeItem('remainingTime');
        sessionStorage.removeItem('showModal');
      };
    
      const handleShow = () => {
        setShow(true);
      };


    /* ----- END ROUND MODAL FUNCTIONS ----- */

    /* ----- SWITCHES FUNCTIONS STARTS HERE ----- */


    const switch1Function = (e) => {

        if(sessionStorage.getItem("switch2") === "false" && sessionStorage.getItem("switch3") === "false"){
            const isChecked = e.target.checked
            setSwitch1(isChecked);

            if (isChecked) {
                OpenRound();
                sessionStorage.setItem("F10_Data$$TimeCaptureOpen", moment().format("LLL"));
                playerWatching()
                setSwitch4(false)
              }
        } else {
            console.log("failed")
        }
      };

    const switch2Function = (e) => {

        if (sessionStorage.getItem("switch1") === "true") {
            const isChecked = e.target.checked;
            setSwitch2(isChecked);

            if (isChecked) {
                CloseRound()
                sessionStorage.setItem("F10_Data$$TimeCaptureClose", moment().format("LLL"));
                playerWatching()
                setSwitch1(false);
                getActiveBettors()
            }
        } else {
            console.log("failed")
        }
      };

    const switch3Function = (e) => {

        if (sessionStorage.getItem("switch2") === "true"){
            const isChecked = e.target.checked;
            setSwitch3(isChecked);

            if (isChecked) {
                ballRacing()
                sessionStorage.setItem("F10_Data$$TimeCaptureDraw", moment().format("LLL"));
                playerWatching()
                setSwitch2(false);
            }
        } else {
            console.log("failed")
        }
      };

    const switch4Function = (e) => {

        if (sessionStorage.getItem("switch1") === "true" || sessionStorage.getItem("switch2") === "true" || sessionStorage.getItem("switch3") === "true" || sessionStorage.getItem("switch1") === "false" || sessionStorage.getItem("switch2") === "false" || sessionStorage.getItem("switch3") === "false"){
            const isChecked = e.target.checked;
            setSwitch4(isChecked);

            if (isChecked) {
                voidRound()
                playerWatching()
            }
        } else {
            console.log("failed")
        }
      };

    const endDeclarationRound = () => {
        if(sessionStorage.getItem("switch3") === "true"){
            endRound()
            playerWatching()
            sessionStorage.setItem("F10_Data$$PrevDraw",moment().format("LLL"))
        }else{
            console.log("failed")
        }
    }


      useEffect(() => {
        sessionStorage.setItem('switch1', switch1);
        sessionStorage.setItem('switch2', switch2);
        sessionStorage.setItem('switch3', switch3);
        sessionStorage.setItem('switch4', switch4);
      }, [switch1, switch2, switch3, switch3]);


    /* ----- SWITCHES FUNCTIONS ENDS HERE ----- */

    /* ----- OPEN,CLOSE,RACING,END ROUND FUNCTIONS STARTS HERE ----- */

        useEffect(() => {
            const dateFrom = dayjs().subtract(7, 'day').startOf('day').add(0, 'hours');
            const dateTo = dayjs(dayjs(new Date()));
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/getallgamesjournal?GameIdx=1&DateFrom=${dateFrom.format("YYYY-MM-DD HH:mm:ss")}&DateTo=${dateTo.format('YYYY-MM-DD HH:mm:ss')}`)
            .then((res) => {
                setCancellationRoundId(res.data.data[0].RoundId)
            })
            .catch((err) => {
                console.log(err)
            })
        }, [])
         
         const OpenRound = () => {
            api.post(`${process.env.REACT_APP_F10_URL}/API/F10/inscreategames`, {
                GameIdx : 1,
                CreatedBy : userToBeUsed
            })
            .then((res) => {
                if ( res.data.data[0].ResponseCode === "0"){
                    socket.emit("generate_get_games", { apiIdx2, From, To })
                    const generatedIdx = res.data.data[0].ResponseMsg
                    const roundidxCurrent = generatedIdx.slice(generatedIdx.indexOf(":") + 2);
                    const gameIdxInCycle = generatedIdx.slice(generatedIdx.indexOf(":") + 2);
                    const encryptedGameIdx = CryptoJS.AES.encrypt(gameIdxInCycle, process.env.REACT_APP_CRYPTO_KEY).toString()
                    const decryptedGameIdx = decryptData(encryptedGameIdx)
                    const formattedGameIdx = roundidxCurrent.slice(0, 8).toUpperCase()
                    sessionStorage.setItem("F10_Data$GID3322", encryptedGameIdx)
                    setCurrentRoundId(formattedGameIdx)
                    setGameIdxtoUseInOneCycle(decryptedGameIdx)
                    setTime1("03:00");
                    setSwitchStartTime1(Date.now());
                    Swal.fire ({
                        title: "ROUND OPEN",
                        icon: "success",
                        timer: 2000
                      })
                }else {
                    Swal.fire ({
                        title: "OPEN ROUND UNSUCCESSFUL!",
                        icon: "error",
                        text: "Please Check The Game Status",
                        timer: 2000
                    })
                } 
            })
            .catch((err) => {
                console.log(err)
            })
         }

        const CloseRound = () => {
            api.post(`${process.env.REACT_APP_F10_URL}/API/F10/insclosegames`, {
                GameIdx : 1,
                RoundId: decryptData(sessionStorage.getItem("F10_Data$GID3322")) || gameIdxtoUseInOneCycle || cancellationRoundId,
                ClosedBy: userToBeUsed
            })
            .then((res) => {
                if ( res.data.data[0].ResponseCode === "0") {
                    socket.emit("generate_get_games", { apiIdx2, From, To })
                    setTime2("00:10");
                    setSwitchStartTime2(Date.now());
                    Swal.fire ({
                        title: "BETTING CLOSED",
                        icon: "success",
                        timer: 2000
                      })
                } else {
                    Swal.fire ({
                        title: "CLOSE BET UNSUCCESSFUL!",
                        icon: "error",
                        text: "Please Check The Game Status",
                        timer: 2000
                    })
                }
            })
        }

        const ballRacing = () => {
            api.post(`${process.env.REACT_APP_F10_URL}/API/F10/insdealinggames`, {
                GameIdx : 1,
                RoundId : decryptData(sessionStorage.getItem("F10_Data$GID3322")) || gameIdxtoUseInOneCycle || cancellationRoundId,
                DealtBy: userToBeUsed
            })
            .then((res) => {
                if ( res.data.data[0].ResponseCode === "0") {
                    socket.emit("generate_get_games", { apiIdx2, From, To })
                    setSwitchStartTime3(Date.now());
                    setTime3("00:00");
                    Swal.fire ({
                        title: "BALLS ARE RACING!",
                        icon: "success",
                        timer: 2000
                      })
                } else {
                    Swal.fire ({
                        title: "UNSUCCESSFUL!",
                        icon: "error",
                        text: "Please Check The Game Status",
                        timer: 2000
                    })
                }
                
            })
        }


        const endRound = () => {
            const roundResult = [
                sessionStorage.getItem("F10_Winner"),
                sessionStorage.getItem("F10_Second"),
                sessionStorage.getItem("F10_Third"),
                sessionStorage.getItem("F10_fourth"),
                sessionStorage.getItem("F10_fifth"),
                sessionStorage.getItem("F10_sixth"),
                sessionStorage.getItem("F10_seventh"),
                sessionStorage.getItem("F10_eighth"),
                sessionStorage.getItem("F10_ninth"),
                sessionStorage.getItem("F10_tenth")
            ].map(decryptData).join(',');
        
            api.post(`${process.env.REACT_APP_F10_URL}/API/F10/gamesjournaldrawtwo`, {
                GameIdx: 1,
                RoundId : decryptData(sessionStorage.getItem("F10_Data$GID3322")) || gameIdxtoUseInOneCycle || cancellationRoundId,
                RoundResult: roundResult,
                DrawnBy: userToBeUsed
            })
            .then((res) => {
                setSwitch3(false);
                if (res.data.data[0].ResponseCode === "0") {
                    socket.emit("generate_get_games", { apiIdx2, From, To })
                    totalPayout()
                    setTime1("00:00");
                    setTime2("00:00");
                    setTime3("00:00");
                    prevWinningBall();
                    handleShow();
                }
            })
        }

        const voidRound = () => {
            Swal.fire({
                title: 'Provide a Reason for Cancellation',
                input: 'text',
                inputPlaceholder: 'Enter the reason...',
                showCancelButton: true,
                confirmButtonText: 'Void Round',
                })
                .then((result) => {
                    if(result.isConfirmed) {
                        const cancellationReason = result.value
                        setSwitch1(false);
                        setSwitch2(false);
                        setSwitch3(false);
                        api.post(`${process.env.REACT_APP_F10_URL}/API/F10/inscancelgames`, {
                            GameIdx: 1,
                            RoundId: decryptData(sessionStorage.getItem("F10_Data$GID3322")) || gameIdxtoUseInOneCycle || cancellationRoundId,
                            CancelledBy: userToBeUsed,
                            ReasonMsg: cancellationReason
                        })
                        .then((res) => {
                            if(res.data.data[0].ResponseCode === "0") {
                                Swal.fire({
                                    icon: 'success',
                                    title: "ROUND VOIDED",
                                    confirmButtonText: 'OK',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                        setTime1("00:00");
                                        setTime2("00:00");
                                        setTime3("00:00");
                                        sessionStorage.removeItem("switchStartTime1");
                                        sessionStorage.removeItem("switchStartTime2");
                                        sessionStorage.removeItem("switchStartTime3");
                                        sessionStorage.removeItem("F10_Data$$TimeCaptureOpen");
                                        sessionStorage.removeItem("F10_Data$$TimeCaptureClose");
                                        sessionStorage.removeItem("F10_Data$$TimeCaptureDraw");
                                        window.location.reload();
                                        setSwitch4(false)
                                    }
                                });
                            }
                        })
                    } else {
                        setSwitch4(false)
                    }
                })
        }
    /* ----- OPEN,CLOSE,RACING,END ROUND AND VOID ROUND FUNCTIONS ENDS HERE ----- */

    /* ----- PLAYERS WATCHING STARTS HERE ----- */

        const playerWatching = () => {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/getselroundsviewer?GameIdx=1`)
            .then((res) => {
                setPlayersWatching(res.data.data.length)
            })
        }

    /* ----- PLAYERS WATCHING ENDS HERE ----- */

    /* ----- PLAYERS TOTAL BETS, TOTAL PAY OUTS, PREVIOUS AND CURRENT STARTS HERE ----- */

        const playersJournalPerRound = (callback) => {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/playersjournalselsummarypergamesa?GameIdx=1&Counter=1`)
            .then((res) => {
                callback(res.data.data[0]);
                sessionStorage.setItem("F10_Data$$PO334", res.data.data[0].TotalWin)
            })
            .then((err) => {
                console.log(err)
            })
        }

        const getActiveBettors = () => {
            playersJournalPerRound((data) => {
                setCurrentActive(data.TotalPlayers);

                const currentBetTableOne = data.TotalBet
                const formattedBet = currentBetTableOne.toLocaleString();
                setCurrentBet(formattedBet)
            });
        }

        const totalPayout = () => {
            playersJournalPerRound((data) => {
              sessionStorage.setItem("F10_Data$$PrevB", data.TotalBet)
              sessionStorage.setItem("F10_Data$$PrevR", data.RoundId)
            })
        }

    /* ----- PLAYERS TOTAL BETS, TOTAL PAY OUTS, PREVIOUS AND CURRENT ENDS HERE ----- */

    const firstPlace = sessionStorage.getItem("F10_Winner_Image")
    const secondPlace = sessionStorage.getItem("F10_Second_Image")
    const thirdPlace = sessionStorage.getItem("F10_Third_Image")
    const fourthPlace = sessionStorage.getItem("F10_fourth_Image")
    const fifthPlace = sessionStorage.getItem("F10_fifth_Image")
    const sixthPlace = sessionStorage.getItem("F10_sixth_Image")
    const seventhPlace = sessionStorage.getItem("F10_seventh_Image")
    const eighthPlace = sessionStorage.getItem("F10_eighth_Image")
    const ninthPlace = sessionStorage.getItem("F10_ninth_Image")
    const tenthPlace = sessionStorage.getItem("F10_tenth_Image")

    const sessionStorageKeys = ["F10_Winner_Image", "F10_Second_Image", "F10_Third_Image", "F10_fourth_Image", "F10_fifth_Image", "F10_sixth_Image", "F10_seventh_Image", "F10_eighth_Image", "F10_ninth_Image", "F10_tenth_Image"];

    function getOrdinalSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const remainder10 = number % 10;
        const remainder100 = number % 100;
    
        return suffixes[(remainder10 === 1 && remainder100 !== 11) || remainder10 === 2 || remainder10 === 3 ? remainder10 : 0];
    }

    useEffect(() => {
        // no-op if the socket is already connected
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

  return (
    <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
    <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
    <Main sx={{ height: "100vh", overflowY: "auto" }} open={open}>
        <Box sx={{ paddingTop: 8, color: "white" }}>
        <Grid container>
            <Grid item xs={12}>
                <Paper sx={{ paddingX: "1rem", marginBottom: 1 }} className="paperBG" elevation={3}>
                    <Box sx={{ padding: 3, color: "white" }}>
                    <Typography variant='h5'>
                        Game Details <hr/>
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4}>
                            <Box>
                                <Typography sx={{ paddingTop: 1.5 }}>
                                    Table Name : Table One
                                </Typography>
                                <Typography>
                                    Current Round Number : {currentRoundId ? `${currentRoundId}` : "Start The Round"}
                                </Typography>
                                    <Stack spacing={1} sx={{ paddingTop: 5 }}>
                                        <Typography>
                                            Player's Watching : <Button color='secondary' variant='outlined' sx={{ width: "50%", color: "white" }} onClick={playerWatching}>{playersWatching ? `${playersWatching} players are watching` : "Click to show"}</Button>
                                        </Typography>
                                        <Typography>
                                            Players Betted : {currentActive ? `${currentActive}` : "0"}
                                        </Typography>
                                        <Typography>
                                            Total Gross Bet : {currentBet ? `${currentBet}.00` : "0.00"}
                                        </Typography>
                                    </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={6} lg={4}>
                            <Typography sx={{ paddingTop: 1.5 }}>
                                Update Game Status
                            </Typography>
                            <Box sx={{ paddingTop: 1.5}}>
                                <Stack spacing={0}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <FormControlLabel control={<Switch checked={switch1} onChange={switch1Function} />} disabled={switch3} label={
                                            <div style={{ color: "#65B741", display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                                                <span>OPEN ROUND</span> 
                                            </div>
                                        }/>
                                        <span className={`timer ${timerColor1 === 'red' ? 'timer-red' : ''}`}>{time1}</span>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <FormControlLabel control={<Switch checked={switch2} onChange={switch2Function}/>}  disabled={switch1} label={
                                            <div style={{ color: "#E3651D" }}>
                                                CLOSE ROUND
                                            </div>
                                        }/> 
                                        <span className={`timer ${timerColor2 === 'red' ? 'timer-red' : ''}`} style={{ paddingLeft: "145px" }}>{time2}</span>     
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <FormControlLabel control={<Switch checked={switch3} onChange={switch3Function} />} disabled={switch2} label={
                                            <div style={{ color: "#4CB9E7" }}>
                                                BALL RACING 
                                            </div>
                                        }/>
                                        <span className={`timer ${timerColor3 === 'red' ? 'timer-red' : ''}`} style={{ paddingLeft: "152px",color: "#4CB9E7" }}>{time3}</span>
                                    </Box>
  
                                    <FormControlLabel control={<Switch checked={switch4} onChange={switch4Function} />} label={
                                        <div style={{ color: "#EA1179" }}>
                                            VOID ROUND 
                                        </div>
                                    }/>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={6} lg={4}>
                            <Typography sx={{ paddingTop: 1.5 }}>
                                Time Stamps
                            </Typography>
                            <Box sx={{ paddingTop: 1.8}}>
                                <Stack spacing={2}>
                                    <Typography>
                                        {sessionStorage.getItem("F10_Data$$TimeCaptureOpen")}
                                    </Typography>
                                    <Typography>
                                        {sessionStorage.getItem("F10_Data$$TimeCaptureClose")}
                                    </Typography>
                                    <Typography>
                                        {sessionStorage.getItem("F10_Data$$TimeCaptureDraw")}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12}>
                <Paper sx={{ paddingX: "1rem" }} className="paperBG" elevation={3}>
                    <Box sx={{ padding: 3, color: "white" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Typography variant='h5'>INPUT RESULT <hr/> </Typography>
                            <Box className="ballCSS" sx={{ paddingTop: "80px" }}>
                                {ballGames.slice(0, 5).map((ball) => (
                                    <div key={ball.id} style={{ pointerEvents: clickedBalls.includes(ball.id) ? 'none' : 'auto' }}>
                                        <img
                                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: clickedBalls.includes(ball.id) ? 'not-allowed' : 'pointer', opacity: clickedBalls.includes(ball.id) ? 0.5 : 1 }}
                                            src={ball.image}
                                            alt={`Ball ${ball.id}`}
                                            onClick={() => (clickedBalls.includes(ball.id) || sessionStorage.getItem("switch3") === "false") ? null : handleCardClick(ball.id)}
                                        />
                                    </div>
                                ))}
                            </Box>
                            <Box className="ballCSS" sx={{ paddingTop: "20px" }}>
                                {ballGames.slice(5, 10).map((ball) => (
                                    <div key={ball.id} style={{ pointerEvents: clickedBalls.includes(ball.id) ? 'none' : 'auto' }}>
                                        <img
                                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: clickedBalls.includes(ball.id) ? 'not-allowed' : 'pointer', opacity: clickedBalls.includes(ball.id) ? 0.5 : 1 }}
                                            src={ball.image}
                                            alt={`Ball ${ball.id}`}
                                            onClick={() => (clickedBalls.includes(ball.id) || sessionStorage.getItem("switch3") === "false") ? null : handleCardClick(ball.id)}
                                        />
                                    </div>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Typography variant='h5'>PLACING <hr /> </Typography>
                            <Box className="ballCSS" sx={{ paddingTop: "58px" }}>
                                {sessionStorageKeys.slice(0, 5).map((key, index) => (
                                    <div key={index}>
                                        <img
                                        style={{ width: "100%" }}
                                        src={sessionStorage.getItem(key) === null ? imagedefault : sessionStorage.getItem(key)}
                                        />
                                        <Typography variant='body1' align='center'>{index + 1}{getOrdinalSuffix(index + 1)} Place</Typography>
                                    </div>
                                ))}
                            </Box>
                            <Box className="ballCSS" sx={{ paddingTop: "20px" }}>
                                {sessionStorageKeys.slice(5, 10).map((key, index) => (
                                    <div key={index + 5}>
                                        <img
                                        style={{ width: "100%" }}
                                        src={sessionStorage.getItem(key) === null ? imagedefault : sessionStorage.getItem(key)}
                                        />
                                        <Typography variant='body1' align='center'>{index + 1 + 5}{getOrdinalSuffix(index + 1 + 5)} Place</Typography>
                                    </div>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Typography sx={{ textAlign: "center" }} variant='h5'>PREVIOUS RESULT <hr /></Typography>
                                <Box sx={{ paddingTop: "2rem" }} className="prev-result">
                                    <img
                                    src={winningBall === null ? racingFlag : winningBall}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall2 === null ? racingFlag : winningBall2}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall3 === null ? racingFlag : winningBall3}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall4 === null ? racingFlag : winningBall4}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall5 === null ? racingFlag : winningBall5}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                </Box>
                                <Box sx={{ paddingTop: "1rem" }} className="prev-result">
                                    <img
                                    src={winningBall6 === null ? racingFlag : winningBall6}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall7 === null ? racingFlag : winningBall7}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall8 === null ? racingFlag : winningBall8}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall9 === null ? racingFlag : winningBall9}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                    <img
                                    src={winningBall10 === null ? racingFlag : winningBall10}
                                    alt="Default Image"
                                    style={{ width: '60px', height: '60px', display: "flex", justifyContent: "center", alignItems: "center" }}
                                    />
                                </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", paddingTop: 3 }}>
                                <Typography variant='h6'>
                                    Round Number: {sessionStorage.getItem("F10_Data$$PrevR") && sessionStorage.getItem("F10_Data$$PrevR").slice(0, 8).toUpperCase()}
                                </Typography>
                                <Typography variant='h6'>
                                    Total Gross Bet : {sessionStorage.getItem("F10_Data$$PrevB") === null ? "0" : sessionStorage.getItem("F10_Data$$PrevB")}.00
                                </Typography>
                                <Typography variant='h6'>
                                    Total Pay Out : {sessionStorage.getItem("F10_Data$$PO334") === null ? "0" : sessionStorage.getItem("F10_Data$$PO334")}.00
                                </Typography>
                                <Grid container>
                                    <Grid sx={{ }} item xs={5.5}>
                                        <Button
                                            sx={{ width: "100%", marginTop: 2 }}
                                            onClick={resetThePlacing}
                                            color="success"
                                            variant="contained"
                                            disabled={!firstPlace || !secondPlace || !thirdPlace || !fourthPlace || !fifthPlace || !sixthPlace || !seventhPlace || !eighthPlace || !ninthPlace || !tenthPlace}
                                            >
                                            RESET Round
                                        </Button>
                                    </Grid>
                                    <Grid sx={{ }} item xs={5.5}>
                                        <Button
                                            sx={{ width: "100%", marginTop: 2 }}
                                            onClick={endDeclarationRound}
                                            color="error"
                                            variant="contained"
                                            disabled={!firstPlace || !secondPlace || !thirdPlace || !fourthPlace || !fifthPlace || !sixthPlace || !seventhPlace || !eighthPlace || !ninthPlace || !tenthPlace}
                                            >
                                            END ROUND
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
        </Box>
    </Main>
    <Dialog
        fullScreen={fullScreen}
        open={show}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeEndRoundModal}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
            style: {
                background: "rgba(0, 0, 0, 0.9)",
                color: "white"
            }
        }}
        BackdropProps={{
            onClick: (event, reason) => {
            },
        }}
    >
        <DialogTitle>{<img style={{ maxWidth: "100%", height: "auto" }} src={require("../assets/minibanner.png")} alt="Banner" />}</DialogTitle>
        <DialogContent>
            <Typography sx={{ textAlign: "center" }}>
                ROUND ENDED, BALLS ARE PREPARING FOR NEXT ROUND WITHIN:
                <span style={{ color: "white" }}>
                    <br /><strong>{remainingTime}</strong> Seconds Left
                    <br /><img style={{ maxWidth: "75%", height: "auto" }} src={gifBall} alt="Your GIF" />
                </span>
            </Typography>
        </DialogContent>
    </Dialog>
  </Box>
  )
}

export default TableOne