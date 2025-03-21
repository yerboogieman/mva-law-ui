import React, {useContext, useEffect, useState} from "react";
import {Anchor, Button, Card} from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import DataTable from "react-data-table-component";
import Loading from "react-loading";
import {useSelector} from "react-redux";
import UserModal from "../../components/UserModal/UserModal";
import {LanguageContext} from "../../contexts/LanguageContext";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";

import jb_utils from "../../utilities/functions.jsx";
import strings from "../Login/i18n-strings";

export default function UsersList() {

    const language = useContext(LanguageContext);
    strings.setLanguage(language || jb_utils.get_device_language());

    const allowed_roles = useSelector(state => state.currentUserHolder.roles);

    const toast = useContext(MessageContextDispatch);

    const [loading, setLoading] = useState(true);

    const [showUserModal, setShowUserModal] = useState(false);
    const [user, setUser] = useState({});

    const [users, setUsers] = useState([]);

    const customStyles = {
        rows: {
            style: {
                // minHeight: "72px", // override the row height
                // borderLeft: "1px solid #E4E7EC",
                // borderRight: "1px solid #E4E7EC"
            }
        }, headCells: {
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
        }, cells: {
            style: {
                // paddingLeft: "8px", // override the cell padding for data cells
                // paddingRight: "8px"
            }
        }
    };

    function loadData() {
        api.get_users()
            .then((result = {}) => {
                if (result && result.success === true) {
                    setUsers(result.data);
                }
                setLoading(false);
            });
    }

    useEffect(loadData, []);

    function updateProfile(values, actions) {
        values.action = "update_user";
        if (values.new === true) {
            values.status = "Active";
        }
    }

    function delete_user(event) {
        const {username} = event.target.dataset;
        api.delete_user(username)
            .then(result => {
                if (result.success === true) {
                    const first_name = result?.name?.first || "User";
                    toast({
                        type: "show_toast", header_text: "User deleted",
                        body_text: `${first_name} was successfully deleted`, variant: "success"
                    });
                }
            });
    }

    const columns = [
        {
            name: "Username", selector: row => row.username, omit: true
        }, {
            name: "Roles", selector: function (row) {
                return row.roles;
            }, omit: true
        }, {
            name: "Name", selector: row => row.name.first + "" + row.name.last, sortable: true, reorder: true,
            cell: function (row) {
                const {name} = row;
                return <span className="fs-14 text-gray-900">
                    <strong>{name.first + " " + name.last}</strong>
            </span>;
            }
        }, {
            name: "Company", selector: row => row.organization.xref, sortable: true, reorder: true,
            cell: function (row) {
                return <span className="fs-14 fw-500 text-gray-900">{row.organization?.name}</span>;
            }
        }, {
            name: "Status", selector: row => row.status, sortable: true, reorder: true,
            cell: row => <span className="fs-14 fw-500 text-gray-900">{row.status}</span>
        }, {
            name: "Phone", selector: row => row.phone,
            cell: row => <span className="fs-14 fw-500 text-gray-500">{jb_utils.format_phone(row.phone)
                || "No phone"}</span>
        }, {
            name: "Email", selector: row => row.email, sortable: true, cell: function (row) {
                const mailto_link = "mailto:" + row.email;
                return <span className="fs-14 fw-500 text-gray-900">
                    <Anchor href={mailto_link} className="link-primary">
                        {row.email}
                    </Anchor></span>;
            }
        }, {
            name: "Actions", cell: function (row) {
                return <DropdownButton id="client-batch-actions-dropdown"
                                       title="Actions" className="border-radius-8"
                                       variant="dropdown-light">
                    <Dropdown.Item className="my-1"
                                   data-username={row.username} onClick={delete_user}>Delete User</Dropdown.Item>
                </DropdownButton>;

            }
        }
    ];

    const rowClicked = (row) => {
        const user_data = Object.assign({}, row); // row is frozen, so we clone it
        setUser(user_data);
        setShowUserModal(true);
    };

    return <>
        <div className="d-flex justify-content-between">
            <h1 className="mt-0 text-gray-900">All Users</h1>

            <div>
                <Button className="ms-4" onClick={() => {
                    setUser({});
                    setShowUserModal(true);
                }}>
                    Add new user
                </Button>
            </div>
        </div>
        {showUserModal && <UserModal show={showUserModal} setShow={setShowUserModal} user={user}/>}
        <hr/>

        <Card className="border-radius-8 box-shadow px-0 mt-5 p-3">
            <div className="d-flex justify-content-between mx-3">
                <div>
                    <DropdownButton id="client-batch-actions-dropdown" title="Batch actions"
                                    className="border-radius-8"
                                    variant="dropdown-light">
                        <Dropdown.Item className="my-1">Mark inactive</Dropdown.Item>
                        <Dropdown.Item className="my-1">Send reminder</Dropdown.Item>
                        <Dropdown.Item className="my-1">Send invitation</Dropdown.Item>
                        <Dropdown.Item className="my-1">Lock card</Dropdown.Item>
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
                    data={users}
                    defaultSortFieldId={1}
                    selectableRows
                    progressPending={loading}
                    progressComponent={<div><Loading type="cylon" color="orange" className="m-auto"/></div>}
                    fixedHeader
                    fixedHeaderScrollHeight={"450px"}
                    // customStyles={customStyles}
                    highlightOnHover
                    selectableRowsHighlight
                    onRowClicked={rowClicked}
                    style={{overflow: "visible"}}
                />
            </div>
        </Card>
    </>;

    function request_password_reset(email) {

        // api.request_password_reset(email)
        //     .then(result => {
        //
        //         if (result) {
        //             // setPasswordEmailSent(true);
        //
        //             setTimeout(function () {
        //                 // setPasswordEmailSent(false);
        //             }, 2400);
        //         }
        //     });

    }
};