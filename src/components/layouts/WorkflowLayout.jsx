import React from "react";
import {Container, Row} from "react-bootstrap";

import MessageProvider from "../../contexts/MessagesContext";
import SideNav from "../SideNav/SideNav.jsx";

export default function WorkflowLayout({children, ...props}) {
    return <>
        <MessageProvider>
            <Container fluid className="ps-0">
                <Row>
                    <div className="col-sm-3 col-xl-2 z-2 pe-0">
                        <SideNav/>
                    </div>
                    <div className="col-sm-9 col-xl-10 ps-0" style={{zIndex: 1}} {...props}>
                        {children}
                    </div>
                </Row>
            </Container>
        </MessageProvider>
    </>;
}