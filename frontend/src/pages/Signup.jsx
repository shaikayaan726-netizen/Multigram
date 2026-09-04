import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";


function Signup() {

    const navigate = useNavigate();


    // ==========================================
    // FORM STATE
    // ==========================================

    const [login, setLogin] = useState("");

    const [fullName, setFullName] = useState("");

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");


    // ==========================================
    // UI STATE
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // SIGNUP
    // ==========================================

    async function handleSignup(event) {

        event.preventDefault();

        setError("");


        // --------------------------------------
        // BASIC VALIDATION
        // --------------------------------------

        if (
            !login.trim() ||
            !fullName.trim() ||
            !username.trim() ||
            !password
        ) {

            setError("Please fill all fields");

            return;

        }


        try {

            setLoading(true);


            // --------------------------------------
            // BACKEND REQUEST
            // --------------------------------------

            const data = await api(
                "/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({

                        login:
                            login.trim(),

                        fullName:
                            fullName.trim(),

                        username:
                            username.trim(),

                        password

                    })

                }
            );


            console.log(
                "SIGNUP RESPONSE:",
                data
            );


            // --------------------------------------
            // SAVE JWT
            // --------------------------------------

            if (data.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );

            }


            // --------------------------------------
            // SUCCESS
            // --------------------------------------

            navigate("/home");

        }
        catch (error) {

            console.error(
                "SIGNUP ERROR:",
                error
            );


            setError(
                error.message ||
                "Signup failed"
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="container">


            {/* ==================================
                MAIN SIGNUP BOX
            ================================== */}

            <div className="signup">


                {/* Instagram Logo */}

               <img src="https://i.postimg.cc/zGLgy81h/icon-512.jpg" alt="Multigram" />

                <h1>
                    Multigram
                </h1>


                <p className="subtitle">

                    Sign up to see photos and videos
                    from your friends.

                </p>


                {/* Facebook */}

                <button
                    className="facebook-btn"
                    type="button"
                >

                    Log in with Facebook

                </button>


                {/* OR */}

                <div className="divider">

                    <hr />

                    <span>
                        OR
                    </span>

                    <hr />

                </div>


                {/* ==================================
                    LOGIN / EMAIL / PHONE
                ================================== */}

                <input
                    type="text"
                    placeholder="Mobile Number or Email"
                    value={login}
                    onChange={function(event) {

                        setLogin(
                            event.target.value
                        );

                    }}
                />


                {/* ==================================
                    FULL NAME
                ================================== */}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={function(event) {

                        setFullName(
                            event.target.value
                        );

                    }}
                />


                {/* ==================================
                    USERNAME
                ================================== */}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={function(event) {

                        setUsername(
                            event.target.value
                        );

                    }}
                />


                {/* ==================================
                    PASSWORD
                ================================== */}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={function(event) {

                        setPassword(
                            event.target.value
                        );

                    }}
                />


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <p className="signup-error">

                        {error}

                    </p>

                )}


                {/* ==================================
                    SIGN UP BUTTON
                ================================== */}

                <button
                    onClick={handleSignup}
                    className="signup-btn"
                    type="button"
                    disabled={loading}
                >

                    {loading
                        ? "Signing up..."
                        : "Sign Up"
                    }

                </button>


                <p className="footer-text">

                    By signing up, you agree to our
                    Terms, Data Policy and Cookies Policy.

                </p>


            </div>


            {/* ==================================
                LOGIN BOX
            ================================== */}

            <div className="login">

                <p>

                    Have an account?

                    {" "}

                    <Link to="/login">

                        Log In

                    </Link>

                </p>

            </div>


        </div>

    );

}


export default Signup;