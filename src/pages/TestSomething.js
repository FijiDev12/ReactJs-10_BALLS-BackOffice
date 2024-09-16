import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { io } from "socket.io-client"
import moment from 'moment';


const socket = io.connect("http://192.168.210.77:6200")

function TestSomething() {
  var oneWeekAgo = moment().subtract(1, 'week').format('Y-MM-DD');
  var oneWeekAhead = moment().add(1, 'week').format('Y-MM-DD');

  const apiIdx2 = 1

  const [From, setFrom] = useState(oneWeekAgo)
  const [To, setTo] = useState(oneWeekAhead)
   useEffect(() => {
      socket.emit("generate_get_games", { apiIdx2, From, To })
      socket.on("chamberone", (data) => {
        console.log(data)
      })
   }, [socket])
  return (
    <div>
      hello
    </div>
  )
}

export default TestSomething