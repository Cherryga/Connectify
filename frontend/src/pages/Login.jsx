
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { makeRequest } from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    email: "",
    otp: "",
  });
  const [err, setErr] = useState(null);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate() 

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login, completeLogin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    
    try {
      if (loginMode === 'password') {
        await login({ username: inputs.username, password: inputs.password });
      } else {
        // OTP login
        const res = await makeRequest.post("/auth/verify-otp-login", {
          email: inputs.email,
          otp: inputs.otp
        });
        completeLogin(res.data);
      }
      navigate("/");
    } catch (err) {
      setErr(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!inputs.email) {
      setErr("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setErr(null);
    
    try {
      await makeRequest.post("/auth/send-otp", { email: inputs.email });
      setOtpSent(true);
      setErr(null);
    } catch (err) {
      setErr(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with friends, share moments, and discover amazing content on Connectify - your social network for meaningful connections.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                Create Account
              </button>
            </Link>
            <button 
              onClick={() => setLoginMode(loginMode === 'password' ? 'otp' : 'password')}
              className="w-full sm:w-auto px-8 py-3 border-2 border-purple-500 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-all"
            >
              {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
            </button>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {loginMode === 'password' ? 'Sign In' : 'OTP Login'}
              </h2>
              <p className="text-gray-600">
                {loginMode === 'password' 
                  ? 'Enter your credentials to access your account' 
                  : 'Enter your email to receive a verification code'
                }
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginMode === 'password' ? (
                <>
                  <div className="space-y-4">
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={inputs.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="relative">
                      <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    
                    {otpSent && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          name="otp"
                          value={inputs.otp}
                          onChange={handleChange}
                          maxLength="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                          required
                        />
                      </div>
                    )}
                  </div>
                  
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  )}
                </>
              )}

              {err && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {typeof err === "string" ? err : JSON.stringify(err)}
                </div>
              )}

              {(loginMode === 'password' || otpSent) && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              )}

              {loginMode === 'password' && (
                <div className="text-center">
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
