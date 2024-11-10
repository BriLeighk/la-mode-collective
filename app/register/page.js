'use client'
import Header from '../Components/Header'
import { useState } from 'react';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!fullName || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            setShowError(true);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setShowError(true);
            return;
        }

        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                setError('Email is already in use.');
                setShowError(true);
                return;
            }

            await createUserWithEmailAndPassword(auth, email, password);
            setShowSuccess(true);
            setShowError(false);
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }, 2000); // 2-second delay
        } catch (err) {
            setError(err.message);
            setShowError(true);
            setShowSuccess(false);
        }
    };

    return (
      <>
        <Header />
        <div className="grid grid-rows-[20px_1fr_20px] items-center p-8 pb-20 gap-16 min-h-screen mt-64">
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-sm shadow-lg shadow-[#29302B] bg-[#445148]">
            <h2 className="mt-10 text-center text-5xl text-[#D0F0C0]">Register</h2>
            <div className="mt-14 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-" onSubmit={handleRegister}>
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-300">Full Name</label>
                  <div className="mt-2">
                    <input
                      id="full-name"
                      name="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm border-[1px] focus:border-[#D0F0C0] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
               
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">Email address</label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm border-[1px] focus:border-[#D0F0C0] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">Password</label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm border-[1px] focus:border-[#D0F0C0] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-300">Confirm Password</label>
                  <div className="mt-2">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm border-[1px] focus:border-[#D0F0C0] focus:outline-none"
                      style={{ fontSize: '1rem', fontWeight: 'bold', paddingLeft: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#D0F0C0] rounded"
                    style={{transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'}}
                  >
                    Create Account
                  </button>
                  <a href="/login"
                    className="w-full sm:w-auto flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm border border-gray-400 hover:border-[#D0F0C0] rounded"
                    style={{transition: 'background-color 0.3s ease-in-out', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'}}
                  >
                    Already have an account? Login here
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-[#D0F0C0] text-[#445148] p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
            Registration successful! Redirecting to login...
          </div>
        )}
        {showError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out">
            {error}
          </div>
        )}
      </>
    );
}