import React from "react";
import WorkflowLayout from "./layouts/WorkflowLayout";

export default function WorkflowContainer({children}) {

    const show_breakpoints = true;

    return <div className="container-fluid px-0">
        <WorkflowLayout>
            {children}
        </WorkflowLayout>
        {
            show_breakpoints && <div className="rounded position-fixed bottom-0 end-0 px-2 bg-dark bg-opacity-75 text-light" style={
                {zIndex: 10000}
            }>
                <div className="d-inline">XXS:&nbsp;</div>
                <div className="d-none d-sm-inline">SM:&nbsp;</div>
                <div className="d-none d-md-inline">MD:&nbsp;</div>
                <div className="d-none d-lg-inline">LG:&nbsp;</div>
                <div className="d-none d-xl-inline">XL:&nbsp;</div>
                <div className="d-none d-xxl-inline">XXL:&nbsp;</div>
            </div>}
    </div>;
}