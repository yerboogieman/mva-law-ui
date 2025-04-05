import React, {useContext, useEffect, useState} from "react";
import {Anchor, Button, Card} from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import DataTable from "react-data-table-component";
import Loading from "react-loading";
import {useSelector} from "react-redux";
import BusinessModal from "../../components/BusinessModal/BusinessModal";
import ClientModal from "../../components/ClientModal/ClientModal";
import UserModal from "../../components/UserModal/UserModal";
import {LanguageContext} from "../../contexts/LanguageContext";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";

import mva_utils from "../../utilities/functions.jsx";
import strings from "../Login/i18n-strings";

export default function ClientList() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || mva_utils.get_device_language());

    const allowed_roles = useSelector(state => state.currentUserHolder.roles);

    const toast = useContext(MessageContextDispatch);

    const [loading, setLoading] = useState(true);

    const [showClientModal, setShowClientModal] = useState(false);

    const [client, setClient] = useState({});
    const [clients, setClients] = useState([]);

    const customStyles = {
        rows: {
            style: {
                // minHeight: "72px", // override the row height
                // borderLeft: "1px solid #E4E7EC",
                // borderRight: "1px solid #E4E7EC"
            }
        },
        headCells: {
            style: {
                // backgroundColor: "#F9FAFB",
                // paddingLeft: "8px",
                // paddingRight: "8px",
                // fontFamily: "Inter",
                // fontStyle: "normal",
                // fontWeight: 500,
                // fontSize: "12px",
                // lineHeight: "18px",
                // color: "#344054",
                // borderTop: "1px solid #E4E7EC"
            }
        },
        cells: {
            style: {
                // paddingLeft: "8px", // override the cell padding for data cells
                // paddingRight: "8px"
            }
        }
    };

    function loadData() {
        api.get_clients()
            .then((result = {}) => {
                if (result && result.success === true) {
                    setClients(result.data);
                }
                setLoading(false);
            });
    }

    useEffect(loadData, []);

    function delete_client(event) {

        const {email} = event.target.dataset;
        api.delete_client(email)
            .then(result => {
                if (result.success === true) {
                    toast({
                        type: "show_toast",
                        header_text: "Client deleted",
                        body_text: `Client was successfully deleted`,
                        variant: "success"
                    });
                }
            });
    }

    const columns = [
        {
            name: "Username",
            selector: row => row.username,
            omit: true
        },
        {
            name: "Roles",
            selector: function (row) {
                return row.roles;
            },
            omit: true
        },
        {
            name: "Name",
            selector: row => row.name.first + "" + row.name.last,
            sortable: true,
            reorder: true,
            cell: function (row) {
                const {name} = row;
                return <span className="fs-14 text-gray-900">
                    <strong>{name.first + " " + name.last}</strong>
            </span>;
            }
        },
        {
            name: "Company",
            selector: row => row.organization.xref,
            sortable: true,
            reorder: true,
            cell: function (row) {
                return <span className="fs-14 fw-500 text-gray-900">{row.organization?.name}</span>;
            }
        },
        {
            name: "Status",

            selector: row => row.status,
            sortable: true,
            reorder: true,
            cell: row => <span className="fs-14 fw-500 text-gray-900 sc">{row.status}</span>
        },
        {
            name: "Phone",
            selector: row => row.phone,
            cell: row => <span className="fs-14 fw-500 text-gray-500">{mva_utils.format_phone(row.phone)
                || "No phone"}</span>
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
            cell: function (row) {
                const mailto_link = "mailto:" + row.email;
                return <span className="fs-14 fw-500 text-gray-900">
                    <Anchor href={mailto_link} className="link-primary">
                        {row.email}
                    </Anchor></span>;
            }
        },
        {
            name: "Actions",
            cell: function (row) {
                return <DropdownButton id="client-batch-actions-dropdown"
                                       title="Actions" className="border-radius-8"
                                       variant="dropdown-light">
                    <Dropdown.Item className="my-1"
                                   data-email={row.email}
                                   onClick={delete_client}>Delete User</Dropdown.Item>
                </DropdownButton>;

            }
        }
    ];

    const rowClicked = (row) => {
        const client_data = Object.assign({}, row); // row is frozen, so we clone it
        setClient(client_data);
        setShowClientModal(true);
    };

    return <>
        <div className="d-flex justify-content-between">
            <h1 className="mt-0 text-gray-900">All Clients</h1>
            <div>
                <Button className="ms-4" onClick={() => {
                    setClient({new: true});
                    setShowClientModal(true);
                }}>
                    Add new client
                </Button>
            </div>
        </div>
        {showClientModal
            && <ClientModal show={showClientModal}
                            onClose={() => loadData()}
                            setShow={setShowClientModal}
                            client={client}/>}
        <hr/>

        <Card className="border-radius-8 box-shadow px-0 mt-5 p-3">
            <div className="d-flex justify-content-between mx-3">
                <div>
                    <DropdownButton id="client-batch-actions-dropdown" title="Batch actions"
                                    className="border-radius-8"
                                    variant="dropdown-light">
                        <Dropdown.Item className="my-1">Mark inactive</Dropdown.Item>
                        <Dropdown.Item className="my-1">Send reminder</Dropdown.Item>
                    </DropdownButton>
                </div>
                <div>
                    <Button type={"button"} variant={"light"}>
                        Filter
                    </Button>
                </div>
            </div>
            <div className="card-body px-0">
                <DataTable
                    className="overflow-visible"
                    pagination
                    columns={columns}
                    data={clients}
                    defaultSortFieldId={1}
                    selectableRows
                    progressPending={loading}
                    progressComponent={<div><Loading type="cylon" color="orange" className="m-auto"/></div>}
                    fixedHeader
                    fixedHeaderScrollHeight={"450px"}
                    customStyles={customStyles}
                    highlightOnHover
                    selectableRowsHighlight
                    onRowClicked={rowClicked}
                    style={{overflow: "visible"}}
                />
            </div>
        </Card>
    </>;
};