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

function Login() {

  
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
  
      api.post(`${process.env.REACT_APP_F10_URL}/API/F10/adminLogin`, {
        Username: Username,
        PassHash: PassHash,
        IPAddress: IPAddress,
      })
        .then((res) => {
          console.log(res.data.data);

          const encryptedSessionId = CryptoJS.AES.encrypt(
            res.data.data[0].ResponseMsg, process.env.REACT_APP_CRYPTO_KEY
          ).toString()
  
          if (res.data.data[0].ResponseCode === "0") {
            api.get(`${process.env.REACT_APP_F10_URL}/API/F10/adminLoginSession?SessionID=${res.data.data[0].ResponseMsg}`)
              .then((res) => {

                Swal.fire({
                  icon: "success",
                  title: "Login Successful",
                  timer: 2000
                })

                const encryptedRoleName = CryptoJS.AES.encrypt(
                  res.data.data[0].RoleName, process.env.REACT_APP_CRYPTO_KEY
                ).toString()

                const encryptedUsername = CryptoJS.AES.encrypt(
                  res.data.data[0].Username, process.env.REACT_APP_CRYPTO_KEY
                ).toString()


                sessionStorage.setItem("F10_Data$0788", encryptedRoleName)
                sessionStorage.setItem("F10_Data$5513", encryptedUsername)

                
                const decryptedRoleName = decryptData(sessionStorage.getItem("F10_Data$0788"))

                console.log(decryptedRoleName)

                if ( decryptedRoleName === "System Administrator") {
                  navigate(`/systemAdminpage?d=${encodeURIComponent(encryptedSessionId)}&r=${encodeURIComponent(encryptedRoleName)}&u=${encodeURIComponent(encryptedUsername)}`)
                } else if ( decryptedRoleName == "Chamber One ( Game Admin )" ) {
                  navigate(`/gameTableOne?d=${encodeURIComponent(encryptedSessionId)}&r=${encodeURIComponent(encryptedRoleName)}&u=${encodeURIComponent(encryptedUsername)}`)
                }
                setLoading(false);
              })
              .catch((error) => {
                console.error(error);
                setLoading(false);
              });
          } else if (res.data.data[0].ResponseCode === "-1") {

              Swal.fire({
                icon: 'error',
                title: "User does not exists",
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
          else if (res.data.data[0].ResponseCode === "-2") {

            Swal.fire({
              icon: 'error',
              title: "Username and password not matched",
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
        <p className='text-4xl font-bold text-center text-white'>F10 BACK OFFICE - ADMIN</p>
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
          {/* Button with embedded ProgressSpinner */}
          <div className='mb-3 w-full'>
            <Button className='BTNLogin' label={loading ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : 'Login'} onClick={adminLogin} disabled={loading} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login