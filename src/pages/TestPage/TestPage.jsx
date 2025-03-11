import React from "react";
import {useSelector} from "react-redux";
import LayoutRouter from "../../components/layouts/LayoutRouter";

export default function TestPage() {

    const userDetails = useSelector(state => state.currentUserHolder.currentUser);

    return <LayoutRouter>
        <div className="d-flex justify-content-between">
            <h1 className="mt-0 text-gray-900">All Users</h1>
            <div>

            </div>
        </div>
    </LayoutRouter>;
};