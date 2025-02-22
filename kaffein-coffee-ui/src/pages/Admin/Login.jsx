import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5135/api/v1/admin/Identity/Login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      
      localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
      localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));

      // Başarılı girişte Admin Paneline yönlendir
      navigate("/admin"); // 👈 "/admin" sayfasına yönlendir

    } catch (error) {
      console.error("Login failed:", error);
      alert("Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="login">
      <h2>Login </h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
