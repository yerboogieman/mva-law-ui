import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";
import Brand from "../Brand/Brand";

export default function SideNav() {

    const toast = useContext(MessageContextDispatch);

    const [menu, setMenu] = useState([]);

    const pathname = window.location.pathname;

    function build_menu() {
        return menu.map(function (item, index) {

            const has_submenu = Array.isArray(item.items) && item.items.length > 0;
            const sub_menu = has_submenu
                ? <ul className="btn-toggle-nav list-unstyled fw-normal pb-1">
                    {sub_menu_map(item.items)}
                </ul>
                : <></>;

            const active = item.link === pathname ? "active" : "";

            return <li key={`menu-${index}`} className="mb-1">
                {
                    has_submenu ? <>
                            <button className={`btn btn-toggle d-inline-flex align-items-center rounded border-0 icon-link ${active}`}
                                    data-bs-toggle="collapse" data-bs-target={`#menu-${item.label}`}>
                                <i className={`fa-duotone fa-${item.icon} fa-fw`}></i>
                                {item.label}
                            </button>
                            <div id={`menu-${item.label}`} className="submenu collapse">{sub_menu}</div>
                        </>
                        : <Link to={item.link} className={`nav-link icon-link ${active}`}>
                            <i className={`fa-duotone fa-${item.icon} fa-fw`}></i>
                            {item.label}
                        </Link>
                }
            </li>;
        });
    }

    const menu_list = build_menu();

    function sub_menu_map(submenu = []) {
        if (submenu.length > 0) {
            return submenu.map(function (item, index) {
                return <li key={`submenu-${index}`} className="nav-item">
                    <Link to={item.link}
                          className="icon-link link-body-emphasis d-inline-flex text-decoration-none rounded">
                        <i className={`fa-duotone fa-${item.icon} fa-fw`}> </i>
                        {item.label}
                    </Link>
                </li>;
            });
        }
    }

    useEffect(() => {
        api.get_user_menu()
            .then(result => {
                if (result.success === true) {
                    setMenu(result.menu);
                } else {
                    toast({
                        type: "show_toast", header_text: "Menu Error",
                        body_text: `There was an error building your navigation menu. Please contact support for assistance.`,
                        variant: "warning"
                    });
                }
            });
    }, []);

    return (
        <div className="flex-shrink-0 bg-primary-subtle p-3" style={{height: "calc(100vh - 0px)"}}>
            <Link to="/" className="navbar-brand">
                <div className="d-flex align-items-center mb-3">
                    <Brand className="me-2"></Brand>
                    Job Flow Pro
                </div>
            </Link>
            <ul className="menu list-unstyled">
                {menu_list}
            </ul>

            {/*<ul className="list-unstyled ps-0 d-none">*/}
            {/*    <li>*/}
            {/*        <Link to="/users">Users</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <Link to="/businesses">Businesses</Link>*/}
            {/*    </li>*/}
            {/*    <li className="mb-1">*/}
            {/*        <button className="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse"*/}
            {/*                data-bs-target="#home-collapse">*/}
            {/*            <span className="ps-2">Home</span>*/}
            {/*        </button>*/}
            {/*        <div className="collapse show" id="home-collapse">*/}
            {/*            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">*/}
            {/*                <li><a href="#" className="link-dark rounded">Overview</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Updates</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Reports</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </li>*/}
            {/*    <li className="mb-1">*/}
            {/*        <button className="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse"*/}
            {/*                data-bs-target="#dashboard-collapse">*/}
            {/*            <span className="ps-2">Dashboard</span>*/}
            {/*        </button>*/}
            {/*        <div className="collapse show" id="dashboard-collapse">*/}
            {/*            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">*/}
            {/*                <li><a href="#" className="link-dark rounded">Overview</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Weekly</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Monthly</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Annually</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </li>*/}
            {/*    <hr className="bg-success-subtle"/>*/}
            {/*    <li className="mb-1">*/}
            {/*        <button className="btn btn-toggle align-items-center rounded collapsed"*/}
            {/*                data-bs-toggle="collapse"*/}
            {/*                data-bs-target="#orders-collapse">*/}
            {/*            <span className="ps-2">Orders</span>*/}
            {/*        </button>*/}
            {/*        <div className="collapse" id="orders-collapse">*/}
            {/*            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">*/}
            {/*                <li><a href="#" className="link-dark rounded">New</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Processed</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Shipped</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Returned</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </li>*/}
            {/*    <hr className="bg-success-subtle"/>*/}
            {/*    <li className="mb-1">*/}
            {/*        <button className="btn btn-toggle align-items-center rounded collapsed"*/}
            {/*                data-bs-toggle="collapse"*/}
            {/*                data-bs-target="#account-collapse">*/}
            {/*            <span className="ps-2">Account</span>*/}
            {/*        </button>*/}
            {/*        <div className="collapse" id="account-collapse">*/}
            {/*            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">*/}
            {/*                <li><a href="#" className="link-dark rounded">New...</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Profile</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Settings</a></li>*/}
            {/*                <li><a href="#" className="link-dark rounded">Sign out</a></li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </li>*/}
            {/*</ul>*/}
        </div>
    );
}