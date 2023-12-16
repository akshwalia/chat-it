import { useEffect, useState } from 'react';
import './App.css'
import logInGIF from './assets/login.gif'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem('auth-token');

    if (!token) {
      setLoading(false);
      return;
    }
    token = `Bearer ${token}`;

    async function checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/checkAuth', {
          headers: {
            'Authorization': token
          }
        });
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        navigate('/main');
      }
      catch(err) {
        console.error(err.response.data);
        setLoading(false);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('userInfo');
      }
    }
    checkAuth();
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setVerifying(true);
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:3000/login',
        {
          username, password
        }
      );
      console.log(response.data);

      localStorage.setItem('auth-token', response.data.token);
      setVerifying(false);

      navigate('/main');
    }
    catch (err) {
      console.error(err);
      setVerifying(false);
    }
  }

  if(loading) {
    return (
      <div className='text-[60px] flex flex-col justify-center items-center h-screen'>Loading...</div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-2 items-center'>
        <div className="left flex flex-col items-center justify-center h-screen -translate-y-20">
          <img src={logInGIF} className='w-[500px]' />
          <h2 className='text-[50px] font-bold'>ChatIt</h2>
        </div>
        <div className="right flex justify-center items-center h-screen">
          <div className="card bg-white w-[550px] h-[450px] rounded-md p-10 flex flex-col justify-center gap-8 -translate-x-8">
            <h1 className='text-4xl'>Log In</h1>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <input type="text" name='username' id='username' placeholder='Username' className='border-solid border-black border-2 px-2 py-[3px]' required />
              <input type="password" name='password' id='password' placeholder='Password' className='border-solid border-black border-2 px-2 py-[3px]' required />
              <button className='bg-primary-blue py-2 text-white hover:bg-secondary-blue'>
                { verifying? <i className="fa-solid fa-spinner-third animate-spin"></i> : 'LOG IN'}
              </button>
            </form>
            <p className='text-center'>New to ChatIt? <Link to='/' className='text-primary-blue hover:text-secondary-blue'>Register</Link></p>
          </div>
        </div>
      </div>


    </>
  )
}

export default Login
