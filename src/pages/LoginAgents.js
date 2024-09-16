import React, {useEffect, useState} from 'react'
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import "primereact/resources/themes/md-dark-deeppurple/theme.css"
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import axios from 'axios';
import api from "../Api/F10"
import Swal from "sweetalert2"
import { ProgressSpinner } from 'primereact/progressspinner';
import CryptoJS from 'crypto-js';
import { decryptData } from "../Utils"

function LoginAgents() {

  const [role, setRole] = useState('');
  const [Username, setUsername] = useState('');
  const [PassHash, setPassHash] = useState('');
  const [IPAddress, setIPAddress ] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate()

  const adminLogin = (e) => {
    setLoading(true);
    e.preventDefault();
  
    const getIpData = async () => {
      try {
        const res = await axios.get("https://api.ipify.org/?format=json");
        setIPAddress(res.data.ip);
      } catch (error) {
        console.log(error);
        return;
      }
  
      api.post(`${process.env.REACT_APP_F10_URL}/API/F10/insaffiliatelogin`, {
        encryptcode: Username,
        passhash: PassHash,
        ip_address: IPAddress
      })
        .then((res) => {
          const encryptedSessionId = CryptoJS.AES.encrypt(
            res.data.data[0].session_token, process.env.REACT_APP_CRYPTO_KEY
          ).toString()
  
          if (res.data.data[0].session_token !== "") {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/selaffiliateloginbysession?session_token=${res.data.data[0].session_token}`)
              .then((res) => {
                  console.log(res.data.data[0])
                    Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    timer: 2000
                })

                const encrypteAffiliateCode = CryptoJS.AES.encrypt(
                  res.data.data[0].AffiliateCode, process.env.REACT_APP_CRYPTO_KEY
                ).toString()

                const encryptedEncryptCode= CryptoJS.AES.encrypt(
                  res.data.data[0].EncryptCode, process.env.REACT_APP_CRYPTO_KEY
                ).toString()

                  navigate(`/agentspage?d=${encodeURIComponent(encryptedSessionId)}&affc=${encodeURIComponent(encrypteAffiliateCode)}&Id=${encodeURIComponent(res.data.data[0].Idx)}&enc=${encodeURIComponent(encryptedEncryptCode)}&lvl=${encodeURIComponent(res.data.data[0].AffiliateLevel)}`)
                  
                setLoading(false);

              })
              .catch((error) => {
                console.error(error);
                setLoading(false);
              });
          } else {

            Swal.fire({
              icon: 'error',
              title: "USER DOESNT EXISTS",
              confirmButtonText: 'OK',
              allowOutsideClick: false
            })
            .then((result) => {
              if (result.isConfirmed) {
                window.location.reload()
              }
            });
            setLoading(false); 
        }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
  
    getIpData();
    setUsername("");
    setPassHash("");
  };

 

  return (
    <div className='flex flex-column justify-content-center align-items-center h-screen loginBG'>
      <Card className='p-6 fontStyle'>
        <p className='text-4xl font-bold text-center text-white'>F10 BACK OFFICE - AGENT</p>
        <p className='text-sm text-center text-white'>Enter to get unlimited access to data & information.</p>
        <div className='p-6'>
          <div className='mb-3 w-full'>
            <div className='flex flex-column gap-2'>
              <label htmlFor='username'>Username</label>
              <InputText id='username' value={Username} onChange={(e) => setUsername(e.target.value)} aria-describedby='username-help' className='h-3rem px-3 w-full max-w-md shadow-8' />
            </div>
          </div>
          <div className='mb-3 w-full'>
            <div className='flex flex-column gap-2'>
              <label htmlFor='username'>Password</label>
              <Password
                value={PassHash}
                onChange={(e) => setPassHash(e.target.value)}
                feedback={false}
                tabIndex={1}
                toggleMask
                className='text-center test-input'
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
          <div className='mb-3 w-full'>
            <Button className='BTNLogin' label={loading ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : 'Login'} onClick={adminLogin} disabled={loading} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoginAgents