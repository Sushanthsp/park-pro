import React, { useState, useEffect } from 'react';
import { login, register } from '../service/api';
import actions from '../redux/user/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/material/Input';

export default function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const tabs = {
        LOGIN: "LOGIN",
        SIGNUP: "SIGNUP"
    }

    const [input, setInput] = useState({
        name: "",
        number: null,
        password: ""
    })

    const [inputError, setInputError] = useState({
        name: false,
        number: false,
        password: false
    })

    const [catchError, setcatchError] = useState(null)

    const onChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
        setInputError({
            ...inputError, [e.target.name]: false
        })
        setcatchError(null)
    }

    const [loading, setLoading] = useState(false)

    const loginFun = (e) => {

        e.preventDefault()

        if (!input?.number) {
            setInputError({ ...inputError, number: true })
            return
        }
        if (!input?.password) {
            setInputError({ ...inputError, password: true })
            return
        }
        delete input.name;
        setLoading(true)
        login(input).then(res => {
            if (res?.status) {
                navigate('/')
                dispatch(actions.setLoggedIn(true))
                dispatch(actions.setToken(res?.data?.token))
                dispatch(actions.setUser(res?.data))
            }
            else {
                setcatchError(res?.message)
            }
        })
            .catch(err => {
                console.log(err?.response?.data?.message)
                setcatchError(err?.response?.data?.message?.details ? err?.response?.data?.message?.details[0]?.message : err?.response?.data?.message)
            })
            .finally(res => {
                setLoading(false)
            })
    }
    const signUpFun = (e) => {
        e.preventDefault()
        if (!input?.name) {
            setInputError({ ...inputError, name: true })
            return
        }
        if (!input?.number) {
            setInputError({ ...inputError, number: true })
            return
        }
        if (!input?.password) {
            setInputError({ ...inputError, password: true })
            return
        }
        setLoading(true)
        register(input).then(res => {
            if (res?.status) {
                navigate('/')
                dispatch(actions.setLoggedIn(true))
                dispatch(actions.setToken(res?.data?.token))
                dispatch(actions.setUser(res?.data))
            }
            else {
                setcatchError(res?.message)
            }

        })
            .catch(err => {
                setcatchError(err)
            })
            .finally(res => {
                setLoading(false)
            })
    }

    const [activeTab, setActiveTab] = useState(tabs.LOGIN)

    return (

        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            {Object.entries(inputError).some(([key, value]) => value === true) || catchError ? (
                <h6 className="w-80 md:w-full p-4 m-auto bg-white rounded-md shadow-xl shadow-indigo-600/40 ring ring-2 ring-red-600 md:max-w-xl absolute top-10 left-0 right-0 mx-auto ">
                    {inputError?.name ? "Name is required" : inputError?.number ? "Phone is required" : inputError?.password ? "Password is required" : catchError ? catchError : null}
                </h6>
            ) : null}
            {activeTab === tabs.LOGIN ? (
                <div className="w-95 md:w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-indigo-600/40 ring ring-2 ring-indigo-600 md:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 uppercase">
                        Sign in
                    </h1>
                    <form className="mt-6">
                        <div className="mb-2">
                            <label htmlFor="number" className="block text-sm font-semibold text-gray-800">
                                Phone
                            </label>
                            <input
                                type="number"
                                value={input?.number}
                                onChange={onChange}
                                name="number"
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                                Password
                            </label>
                            <input
                                type="password"
                                value={input?.password}
                                onChange={onChange}
                                name="password"
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>

                        <div className="mt-6">
                            {loading ? (
                                <button
                                    disabled
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                >
                                    loading...
                                </button>
                            ) : (
                                <button
                                    onClick={loginFun}
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        {" "}
                        Don't have an account?{" "}
                        <a
                            onClick={() => {
                                 setActiveTab(tabs.SIGNUP);
                            }}
                            className="font-medium text-indigo-600 hover:underline cursor-pointer"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            ) : (
                <div className="w-95 md:w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-indigo-600/40 ring ring-2 ring-indigo-600 md:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 uppercase">
                        Sign up
                    </h1>
                    <form className="mt-6">
                        <div className="mb-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                                Name
                            </label>
                            <input
                                type="text"
                                value={input?.name}
                                onChange={onChange}
                                name="name"
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />

                        </div>
                        <div className="mb-2">
                            <label htmlFor="number" className="block text-sm font-semibold text-gray-800">
                                Phone
                            </label>
                            <input
                                type="number"
                                value={input?.number}
                                onChange={onChange}
                                name="number"
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                                Password
                            </label>
                            <input
                                type="password"
                                value={input?.password}
                                onChange={onChange}
                                name="password"
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>

                        <div className="mt-6">
                            {loading ? (
                                <button
                                    disabled
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                >
                                    loading...
                                </button>
                            ) : (
                                <button
                                    onClick={signUpFun}
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                >
                                    Sign up
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        Already have an account?{" "}
                        <a
                            onClick={() => {
                                 setActiveTab(tabs.LOGIN);
                            }}
                            className="font-medium text-indigo-600 hover:underline cursor-pointer"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            )}


        </div>
    );
}