import React,{useState,useEffect} from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from './../../components/InputForm/InputFrom';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';
import imageLogo from'../../assets/images/logo-login.png'
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import {useNavigate}from'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from './../../hooks/useMutationHook';
import Loading from './../../components/LoadingComponent/Loading';
import * as message from'../../components/Message/Message'
const SignUpPage = () => {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
     const[confirmPassword,setConfirmPassword]=useState('')
    const handleOnchangeEmail=(value)=>{
        setEmail(value)
    }
      const mutation=useMutationHooks(
            data=>UserService.signupUser(data)
      )
      const{data,isLoading,isSuccess,isError}=mutation
      useEffect(() => {
    if (isSuccess) {
        message.success()
        handleNavigateSignIn()
    } else if (isError) {
        message.error()
    }
}, [isSuccess, isError])
        const handleOnchangePassword=(value)=>{
        setPassword(value)
    }
            const handleOnchangeConfirmPassword=(value)=>{
        setConfirmPassword(value)
    }
    const navigate=useNavigate()
    const handleNavigateSignIn=()=>{
        navigate('/sign-in')
    }
    const handleSignUp=()=>{
        mutation.mutate({email,password,confirmPassword})
       
    }
  const [isShowPassword, setIsShowPassword] = useState(false);
const [isShowComfirmPassword, setIsShowConfirmPassword] = useState(false);
    return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.53)',height:'100vh'}}>
      <div style={{width:'800px',height:'445px',borderRadius:'6px',background:'#fff',display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin chào</h1>
        <p>Đăng nhập và tạo tài khoản</p>
    
      <InputForm style={{marginBottom:'10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>

      <div style={{ position: "relative",marginBottom:'10px' }}>
    <span
    onClick={()=>setIsShowPassword(!isShowPassword)}
        style={{
            zIndex: 10,
            position: "absolute",
            top: '4px',
            right: '8px',
            
        }}
    >
        {isShowPassword ? (
            <EyeFilled />
        ) : (
            <EyeInvisibleFilled />
        )}
    </span>
    <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword} />
</div>
      <div style={{ position: "relative" }}>
    <span
    onClick={()=>setIsShowConfirmPassword(!isShowComfirmPassword)}
        style={{
            zIndex: 10,
            position: "absolute",
            top: '4px',
            right: '8px'
        }}
    >
        {isShowComfirmPassword ? (
            <EyeFilled />
        ) : (
            <EyeInvisibleFilled />
        )}
    </span>
    <InputForm placeholder="comfirm password" type={isShowComfirmPassword ? "text" : "password"}
     value={confirmPassword}onChange={handleOnchangeConfirmPassword} />
</div>
{data?.status==='ERR'&&<span style={{color:'red'}}>{data?.message}</span>}
<Loading isLoading={isLoading}>
        <ButtonComponent
        disabled={!email.length || !password.length || !confirmPassword.length}
                onClick={handleSignUp}
                variant="borderless"
                size={40}
                styleButton={{
                    background: 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '100%',
                    border: 'none',
                    borderRadius: '4px',
                    margin:'26px 0 10px'
                }}
                textButton={'Đăng ký'}
                styleTextButton={{ color: '#fff',fontSize:'15px',fontWeight:'700' }}
        ></ButtonComponent>
</Loading>
        <p>Bạn đã có tài khoản?<WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
          </WrapperContainerLeft>
      <WrapperContainerRight> 
        <Image src={imageLogo} preview={false} alt='image-logo' height="203px" width="203px" />
        <h4>Mua sắm tại LTTD</h4>
      </WrapperContainerRight>
    </div>
</div>
  )
}

export default SignUpPage