import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { api } from "../utils/api";
import { connectSocket } from "../utils/socket";


function Login() {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // ==========================================
    // LOGIN
    // ==========================================

    async function handleLogin(event) {

        event.preventDefault();

        setError("");


        if (!login.trim()) {

            setError(
                "Phone number, username or email is required"
            );

            return;

        }


        if (!password) {

            setError(
                "Password is required"
            );

            return;

        }


        try {

            setLoading(true);


            // ======================================
            // BACKEND LOGIN
            // ======================================

            const data = await api(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({

                        login:
                            login.trim(),

                        password:
                            password

                    })

                }
            );


            // ======================================
            // TOKEN
            // ======================================

            if (!data?.token) {

                throw new Error(
                    "Login token was not received"
                );

            }


            localStorage.setItem(
                "token",
                data.token
            );


            // ======================================
            // USER
            // ======================================

            if (data?.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // ==================================
                // SAVE USER ID
                // ==================================

                const userId =
                    data.user._id ||
                    data.user.id ||
                    data.user.userId ||
                    "";


                if (userId) {

                    localStorage.setItem(
                        "userId",
                        String(userId)
                    );

                }

            }


            // ======================================
            // FINAL USER ID FALLBACK
            // ======================================

            const savedUserId =
                localStorage.getItem("userId") ||
                data?.user?._id ||
                data?.user?.id ||
                data?.user?.userId ||
                "";

            if (savedUserId) {

                localStorage.setItem(
                    "userId",
                    String(savedUserId)
                );
            }


            // ======================================
            // CONNECT CALL SOCKET
            // ======================================

            connectSocket();


            // ======================================
            // HOME
            // ======================================

            navigate(
                "/home",
                {
                    replace: true
                }
            );

        }

        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            setError(
                error.message ||
                "Login failed"
            );

        }

        finally {

            setLoading(false);

        }

    }


    return (

        <div className="login-container">

            <div className="login-box">

                <h1>
                    Multigram
                </h1>


                <form
                    onSubmit={handleLogin}
                >

                    <input
                        className="input-text"
                        type="text"
                        placeholder="Phone number, username or email"
                        value={login}
                        autoComplete="username"
                        onChange={(event) =>
                            setLogin(
                                event.target.value
                            )
                        }
                    />


                    <input
                        className="input-text"
                        type="password"
                        placeholder="Password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                    />


                    {error && (

                        <p
                            className="login-error"
                            role="alert"
                        >
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Log in"
                        }

                    </button>

                </form>


                <div className="login-divider">

                    <hr />

                    <span>
                        OR
                    </span>

                    <hr />

                </div>


                <div className="login-fb">

                    <img
                        src="https://www.brandlogopng.com/filesmall/logo/facebook/facebook-round-logo-icon-facebook-phare-creative-studio-dfaj.webp"
                        alt="Facebook"
                    />

                    <p>
                        Log in with Facebook
                    </p>

                </div>


                <a
                    className="forgot-password"
                    href="#"
                    onClick={(event) =>
                        event.preventDefault()
                    }
                >
                    Forgot password?
                </a>

            </div>


            <div className="signup-box">

                <p>

                    Don't have an account?

                    <Link to="/">
                        Sign up
                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Login;