import {NavLink} from "react-router-dom";
import {IoMdClose, IoMdMenu} from "react-icons/io";
import {NAV_ITEMS} from "../../../constants/navigation";
import {useEffect, useState} from "react";
import '../../../styles/Sidebar.css';
import UserMenu from "./UserProfile";

export default function Sidebar({open, onOpen, onClose}) {
    const [isMobile, setIsMobile] = useState(
        window.matchMedia("(max-width: 700px)").matches
    );

    useEffect(() => {
        const media = window.matchMedia("(max-width: 700px)");

        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, []);

    return (
        <div>
            <button
                type="button"
                className="openSidebarButton"
                onClick={onOpen}
                aria-label="Open menu"
            >
                <IoMdMenu size={35}/>
            </button>

            <nav
                className={`sidebar-nav ${open ? "show" : ""}`}
                aria-hidden={isMobile && !open}
                inert={isMobile && !open ? "" : undefined}
            >
                <ul>
                    {/*Close sidebar button*/}
                    <button
                        type="button"
                        className="closeSidebarButton"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <IoMdClose size={35}/>
                    </button>

                    {/*Navigation titles*/}
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            end={item.to === "/habit-tracker"}
                            className={({isActive}) =>
                                `nav-item
                                ${item.to === "/habit-tracker" ? "home-link" : ""}
                                ${isActive ? "nav-active" : ""}`
                            }
                        >
                            {item.icon && (
                                <span className="nav-icon">
                                    {item.icon}
                                </span>
                            )}
                            {item.label}
                        </NavLink>
                    ))}

                    {/*Logout button*/}
                    <UserMenu/>
                    {/*<div className="user-row">*/}
                    {/*    <div className="user-avatar">{user?.name?.[0] ?? user?.email?.[0] ?? '?'}</div>*/}
                    {/*    <div className="user-info">*/}
                    {/*        <div className="user-name">{user?.name ?? 'Member'}</div>*/}
                    {/*        <div className="user-email">{user?.email}</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<button className='logout-btn' onClick={handleLogout}>Log out</button>*/}
                </ul>
            </nav>
        </div>
    );
}