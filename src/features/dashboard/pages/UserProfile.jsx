import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthContext";
import '../../../styles/UserMenu.css';

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <div
            className="user-menu"
            ref={menuRef}
        >
            <button
                className="user-row"
                onClick={() => setOpen(!open)}
            >
                <div className="user-avatar">
                    {user?.email?.[0] ??
                        user?.name?.[0] ??
                        "?"}
                </div>

                {/*<span>*/}
                {/*    {user?.name || "Member"}*/}
                {/*</span>*/}
            </button>

            {open && (
                <div className="dropdown-menu">
                    <button>
                        Profile
                    </button>

                    <button>
                        Settings
                    </button>

                    <button className='logout-btn' onClick={handleLogout}>Log out</button>
                </div>
            )}
        </div>
    );
}