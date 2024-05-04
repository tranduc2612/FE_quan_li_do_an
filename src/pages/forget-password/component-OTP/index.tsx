import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { auth } from '~/firebase/config';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { EnumStepOTP } from '..';


function PageOtp({phone ,setStep}:any) {
    const refCap = useRef<any>();
    const reCapchaa = useRef<any>();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading,setLoading] = useState(false);
    const [displayCapcha,setDisplayCapcha] = useState(true);
    const [confirmation,setConfirmation] = useState<any>();
    
    useEffect(()=>{
        if(refCap.current){
            const sendSMS = async ()=>{
                const recapcha = new RecaptchaVerifier(auth,"recaptcha",{
                    callback: () => {
                        console.log("reCAPTCHA verified successfully");
                        setTimeout(()=>{
                            setDisplayCapcha(false); // Ẩn reCAPTCHA sau khi xác thực thành công
                        },2000)
                    },
                });
                const confirmation = await signInWithPhoneNumber(auth, "+84 "+phone, recapcha);
                setConfirmation(confirmation)
                reCapchaa.current = recapcha;
            }
            
            sendSMS()
        }
    },[])

    useEffect(()=>{
        if(otp.length === 6){
            verifyOtp();
        }
    },[otp])

    const verifyOtp = async()=>{
        try{
            setLoading(true)
            const req = await confirmation.confirm(otp)
            toast.success("Xác thực thành công !");
            setStep(EnumStepOTP.CHANGE_PASSWORD)
        }catch(err){
            toast.warn("Mã OTP không đúng")
        }
        setLoading(false)
    }
    return ( <>
        
        {
            displayCapcha ?
            <div
                ref={refCap}
                style={
                {width: "100%",
                marginTop: "10px"
                }} id="recaptcha">

            </div>
            :
            <><div>
            <span className="text-primary-blue mb-2">Xác thực mã OTP</span>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                    backgroundColor:'#e4e6eb',
                    width:"50px",
                    height:"50px",
                }}
                />
            </div>
            <div>
                <span className="text-xs">*Mã đã được gửi về số điện thoại của bạn</span>
            </div>
            
            {
                loading ? 
                <LoadingButton  
                        loading
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                >Đang xác thực</LoadingButton>
                :
                <Button variant="contained" type="submit" onClick={verifyOtp}>Xác thực mã OTP</Button>
            }</>
        }

    </> );
}

export default PageOtp;