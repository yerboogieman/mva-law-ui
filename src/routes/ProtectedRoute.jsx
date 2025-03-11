import React, {useEffect, useState} from "react";
import Loading from "react-loading";
import {useDispatch} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {setRoles} from "../redux/currentUserHolder";
import api from "../utilities/api";

export default function ProtectedRoute({allowedRoles, children}) {

    const dispatch = useDispatch();

    const [validating, setValidating] = useState(true);
    const [authorized, setAuthorized]= useState(false);

    useEffect(() => {
        api.validate()
            .then(result => {
                if (result && result.success === true) {
                    const roles = result.data;
                    dispatch(setRoles(roles));
                    const authorized = allowedRoles.some(role => roles.includes(role));
                    setAuthorized(authorized);
                }

                setValidating(false);
            })
    }, []);

    return <div>
        {
            validating
                ? <>
                    <div className="d-flex" style={{height: "100vh", opacity: .5}}>
                        {
                            <Loading type="bars" color="#FCBA04" className="m-auto"/>
                        }
                    </div>
                </>
                : authorized
                    ? children || <Outlet/>
                    : <Navigate to="/login" replace/>
        }</div>
}