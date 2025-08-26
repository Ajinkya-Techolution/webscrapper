import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react';

function App() {
  const fetchRole = async () => {
    const res = await fetch(`http://localhost:3000/api/auth/session`, {
      method: "GET",
      credentials: 'include'
    });
    const session = await res.json();
    console.log("Session",session)
    if(session){
      window.location.href="http://localhost:3000/api/auth/signout?callbackUrl=https://webscrapper-1-mjdo.onrender.com"
    }

    if (!session ||!session.user) {
      window.location.href = "http://localhost:3000/api/auth/signin?callbackUrl=https://webscrapper-1-mjdo.onrender.com";
      return;
    }
  }
  const fetchCard=async()=>{
    const res=await fetch(`http://localhost:3000/api/auth/session`,{
      method:"GET",
      credentials:"include"
    });
    const response=await res.json();
    setData(response.data);

  }
  const [data,setData]=useState([]);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={fetchRole}>
          count
        </button>
        <button className='card'
        onClick={fetchCard}>
          role
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {data.map((d:any)=>{
        <h1>{d.name}</h1>
      })}
    </>
  )
}

export default App
