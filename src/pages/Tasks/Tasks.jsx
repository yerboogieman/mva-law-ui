import React, {useContext, useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import DataTable from "react-data-table-component";
import Loading from "react-loading";
import {useNavigate} from "react-router-dom";
import CaseModal from "../../components/CaseModal/CaseModal";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";

import {useSelector} from "react-redux";

export default function Tasks() {

    const user = useSelector(state => state.currentUserHolder);

    const toast = useContext(MessageContextDispatch);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [deletingCase, setDeletingCase] = useState(false);

    const [showCaseModal, setShowCaseModal] = useState(false);
    const [case_data, setCase] = useState({});

    const [cases, setCases] = useState([]);

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

        document.title = "Case List";   // TODO: internationalize (replace English title with key "case.list")

        api.get_cases()
            .then((result = {}) => {
                if (result && result.success === true) {
                    if (Array.isArray(result.data) && result.data.length > 0) {
                        setCases(result.data);
                    } else {
                        cases.length > 0 && setCases([]);
                    }
                }
                setLoading(false);
            });
    }

    useEffect(loadData, []);

    function updateCase(values, actions) {
        values.action = "update_case";
        if (values.new === true) {
            values.status = "Active";   // TODO: Internationalize
        }
    }

    function delete_case(event) {
        const {case_id} = event.target.dataset;

        setDeletingCase(true);

        api.delete_case(case_id)
            .then(result => {
                if (result.success === true) {
                    loadData();
                    toast({
                        type: "show_toast",
                        header_text: "Case deleted",
                        body_text: `Case was successfully deleted`,
                        variant: "success"
                    });
                } else {
                    toast({
                        type: "show_toast",
                        header_text: "Error",
                        body_text: `Could not delete case.`,
                        variant: "danger"
                    });
                }
                setDeletingCase(false);
            });
    }

    const columns = [
        {
            name: "id",
            selector: row => row.id,
            omit: true
        },
        {
            name: "Case Name",
            selector: row => row.name,
            sortable: true,
            reorder: true,
            cell: function (row) {
                const {name} = row;
                return <span className="fs-14 text-gray-900 pe-none">
                    <strong>{name}</strong>
            </span>;
            }
        },
        {
            name: "Client",
            selector: row => row.client?.name,
            sortable: true,
            reorder: true,
            cell: function (row) {
                if (row.client && row.client.name) {
                    const {
                        first,
                        last
                    } = row.client.name;

                    return <span className="fs-14 fw-500 text-gray-900 pe-none">{
                        first + " " + last || "No client"
                    }</span>;
                }
            }
        },
        {
            name: "Status",
            selector: row => row.status,
            sortable: true,
            reorder: true,
            cell: row => <span className="fs-14 fw-500 text-gray-900 pe-none">{row.status}</span>
        },
        {
            name: "Actions",
            cell: function (row) {
                return deletingCase
                    ? <div><Button variant="outline-secondary" disabled={true}>
                        Actions<Loading color="black" height="15px" width="15px" type="bars" className="d-inline-block ms-1"/>
                </Button></div>

                    : <DropdownButton id="client-batch-actions-dropdown"
                                      title="Actions" className="border-radius-8"
                                      variant="dropdown-light">
                        <Dropdown.Item className="my-1"
                                       data-case_id={row.id} onClick={delete_case}>Delete Case</Dropdown.Item>
                    </DropdownButton>;
            }
        }
    ];

    function rowClicked(row) {
        const case_data = Object.assign({}, row); // row is frozen, so we clone it
        const {id} = case_data;
        navigate(`/workflow-manager?id=${id}`, {state: {case: case_data}});
    }

    return <div className="ps-2">
        <div className="d-flex justify-content-between">
            <h1 className="mt-0 text-gray-900">Cases</h1>

            <div>
                <Button className="ms-4" onClick={() => {
                    setCase({});
                    setShowCaseModal(true);
                }}>
                    Add new case
                </Button>
            </div>
        </div>
        {showCaseModal && <CaseModal show={showCaseModal} setShow={setShowCaseModal} case_data={case_data} onUpdate={loadData}/>}
        <hr/>

        <Card className="">
            <div className="card-body p-0">
                <DataTable
                    className="overflow-visible"
                    pagination
                    columns={columns}
                    data={cases}
                    defaultSortFieldId={1}
                    progressPending={loading}
                    noDataComponent={noData()}
                    progressComponent={<div><Loading type="cylon" color="orange" className="m-auto"/></div>}
                    fixedHeader
                    fixedHeaderScrollHeight={"450px"}
                    customStyles={customStyles}
                    highlightOnHover
                    onRowClicked={rowClicked}
                    // style={{overflow: "visible"}}
                />
            </div>
        </Card>
    </div>;
    
    function noData() {
        return <span className="my-4">No cases found.
            <button className="btn btn-link" type="button" onClick={newClientModal}>Add a case</button>
        </span>;
    }

    function newClientModal() {
        setShowCaseModal(true);
    }
}

