import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button, Typography, Box } from '@mui/material';


function QRcode() {
  const [qrcodeUrl, setQrcodeUrl] = useState('');

  useEffect(() => {
    const canvas = document.getElementById('qrCode2');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setQrcodeUrl(dataUrl);
    }
  }, []);

  const handleDownload = () => {
    if (qrcodeUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = qrcodeUrl;
      downloadLink.download = 'qrcode2.png';
      downloadLink.click();
    }
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode2"
      value="https://chat.openai.com/"
      size={200}
      bgColor={'white'}
      level={'H'}
    />
  );

  return (
    <div className="qrcode__container">
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ paddingBottom: "1rem" }} variant='body1'>URL LOGIN GAME ADMIN</Typography>
    </Box>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>{qrcode}</div>
      {qrcodeUrl && (
        <Box>
          <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: "orange", paddingTop: "1rem" }} variant="subtitle1">
            https://chat.openai.com/
          </Typography>
        </Box>
      )}
      <Box onClick={handleDownload}>
        <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} variant="subtitle1">
        <Button sx={{ width: "100%"}} variant='text' color='warning'>CLICK TO DOWNLOAD</Button>
        </Typography>
      </Box>
    </div>
  );
}

export default QRcode;
