

function PostMenu() {

    // Menu open hai ya close hai ye track karne ke liye state
    const [menuOpen, setMenuOpen] = useState(false);

    // Three dots par click hone par menu open/close karenge
    function handleMenu() {

        setMenuOpen(!menuOpen);

    }

    return (

        <div className="post-menu">

            {/* Three Vertical Dots */}

            <button
                className="icon-btn"
                onClick={handleMenu}
            >

                <FiMoreVertical />

            </button>


            {/* Edit / Delete Menu */}

            {menuOpen && ( 

                <div className="post-menu-box">

                    <button>
                        Edit
                    </button>

                    <button>
                        Delete
                    </button>

                </div>

            )}

        </div>

    );
}

export default PostMenu;