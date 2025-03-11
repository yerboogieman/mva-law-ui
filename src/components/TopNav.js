import React from "react";

export default function TopNav() {

    return <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid justify-content-between">
                <div className="rounded-circle bg-primary p-2 text-white text-center" style={{
                    height: 40,
                    width: 40
                }}>
                    <div style={{marginTop: 2}}>
                        <i className="fa-solid fa-j" style={{transform: "translateX(2px)"}}></i>
                        <i className="fa-solid fa-f" style={{transform: "translateY(-3px)"}}></i>
                    </div>
                    Job Flow Pro
                </div>
                <div>
                    <button className="navbar-toggler pe-5" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <button type="button" className="btn btn-link position-relative">
                            <i className="fa-duotone fa-user fa-2x"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>;
}