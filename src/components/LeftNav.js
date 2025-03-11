import React from "react";
import "./LeftNav.css";
import {Link} from "react-router-dom";
import Brand from "./Brand/Brand";

const LeftNav = () => {

    return (
        <div className="bg-primary-subtle p-3" style={{height: "calc(100vh - 0px)"}}>
            <Link to="/" className="navbar-brand">
                <div className="d-flex align-items-center mb-3">
                    <Brand className="me-2"></Brand>
                    Job Flow Pro
                </div>
            </Link>
            <ul className="list-unstyled ps-0">
                <li>
                    <Link to="/users">Users</Link>
                </li>
                <li>
                    <Link to="/businesses">Businesses</Link>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse"
                            data-bs-target="#home-collapse">
                        <span className="ps-2">Home</span>
                    </button>
                    <div className="collapse show" id="home-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Overview</a></li>
                            <li><a href="#" className="link-dark rounded">Updates</a></li>
                            <li><a href="#" className="link-dark rounded">Reports</a></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse"
                            data-bs-target="#dashboard-collapse">
                        <span className="ps-2">Dashboard</span>
                    </button>
                    <div className="collapse show" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Overview</a></li>
                            <li><a href="#" className="link-dark rounded">Weekly</a></li>
                            <li><a href="#" className="link-dark rounded">Monthly</a></li>
                            <li><a href="#" className="link-dark rounded">Annually</a></li>
                        </ul>
                    </div>
                </li>
                <hr className="bg-success-subtle"/>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                            data-bs-target="#orders-collapse">
                        <span className="ps-2">Orders</span>
                    </button>
                    <div className="collapse" id="orders-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">New</a></li>
                            <li><a href="#" className="link-dark rounded">Processed</a></li>
                            <li><a href="#" className="link-dark rounded">Shipped</a></li>
                            <li><a href="#" className="link-dark rounded">Returned</a></li>
                        </ul>
                    </div>
                </li>
                <hr className="bg-success-subtle"/>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                            data-bs-target="#account-collapse">
                        <span className="ps-2">Account</span>
                    </button>
                    <div className="collapse" id="account-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">New...</a></li>
                            <li><a href="#" className="link-dark rounded">Profile</a></li>
                            <li><a href="#" className="link-dark rounded">Settings</a></li>
                            <li><a href="#" className="link-dark rounded">Sign out</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default LeftNav