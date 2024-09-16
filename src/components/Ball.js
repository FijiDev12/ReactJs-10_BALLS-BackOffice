import React from 'react';
import Paper from '@mui/material/Paper';


const Ball = ({ number, color, onClick }) => {
    const ballStyle = {
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer', // Add cursor pointer for better UX
    };
  
    const numberCircleStyle = {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'black',
    };
  
    const handleClick = () => {
      onClick({ number, color });
    };
  
    return (
      <Paper style={ballStyle} onClick={handleClick}>
        <div style={numberCircleStyle}>{number}</div>
      </Paper>
    );
  };

  export default Ball;