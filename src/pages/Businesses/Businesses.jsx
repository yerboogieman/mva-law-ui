import React, {useContext, useEffect, useState} from "react";
import {Anchor, Button, Card} from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import DataTable from "react-data-table-component";
import Loading from "react-loading";
import {useSelector} from "react-redux";
import BusinessModal from "../../components/BusinessModal/BusinessModal";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";

import jb_utils from "../../utilities/functions.jsx";

export default function Businesses() {

    const allowed_roles = useSelector(state => state.currentUserHolder.roles);

    const toast = useContext(MessageContextDispatch);

    const [loading, setLoading] = useState(true);

    const [showBusinessMOdal, setShowBusinessModal] = useState(false);
    const [business, setBusiness] = useState({});
    const [businesses, setBusinesses] = useState([]);

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
        api.get_businesses()
            .then((result = {}) => {
                if (result && result.success === true) {
                    setBusinesses(result.data);
                }
                setLoading(false);
            });
    }

    useEffect(loadData, []);

    function delete_business(event) {
        const {id} = event.target.dataset;
        api.delete_user(id)
            .then(result => {
                if (result.success === true) {
                    const name = result?.name || "Businesses";
                    toast({
                        type: "show_toast",
                        header_text: "Business deleted",
                        body_text: `${name} was successfully deleted`,
                        variant: "success"
                    });
                }
            });
    }

    const columns = [
        {
            name: "xref",
            selector: row => row.xref,
            omit: true
        },
        {
            name: "Company",
            selector: row => row.name,
            sortable: true,
            reorder: true,
            cell: function (row) {
                const {name} = row;
                return <span className="fs-14 text-gray-900">
                    <strong>{name}</strong>
            </span>;
            }
        },
        {
            name: "Phone",
            selector: row => row.phone,
            cell: row => <span className="fs-14 fw-500 text-gray-500">
                {jb_utils.format_phone(row.phone) || "No phone"}</span>
        },
        {
            name: "Location",
            selector: row => row.location,
            cell: row => row.location || "MISTY MOUNTAINS"
        },
        {
            name: "Actions",
            cell: function (row) {
                return <DropdownButton id="client-batch-actions-dropdown"
                                       title="Actions" className="border-radius-8"
                                       variant="dropdown-light">
                    <Dropdown.Item className="my-1" data-username={row.xref} onClick={delete_business}>
                        Delete Company
                    </Dropdown.Item>
                </DropdownButton>;

            }
        }
    ];

    const rowClicked = (row) => {
        const business_data = Object.assign({}, row); // row is frozen, so we clone it
        setBusiness(business_data);
        setShowBusinessModal(true);
    };

    function create_fake_job() {

        api.create_case()
            .then(function (response) {


            });
    }

    function delete_case() {

        api.delete_case("66301bdfbd480434b6338a23")
            .then(function (response) {

            });
    }

    function modify_job() {

        api.modify_job({
            name: "Blagart",
            description: "This newnewnewnew boss",
            id: "6632f5f5437edb51a14a9ec5"
        })
            .then(function (response) {

            });

    }

    return <>
        <div className="d-flex justify-content-between">
            <h1 className="mt-0 text-gray-900">All Companies</h1>
            <button onClick={create_fake_job}>
                Create Fake Job
            </button>
            <button onClick={modify_job}>
                Modify Fake Job
            </button>
            <button onClick={delete_case}>
                Delete Fake Job
            </button>
            <div>
                <Button className="ms-4" onClick={() => {
                    setBusiness({});
                    setShowBusinessModal(true);
                }}>
                    Add new business
                </Button>
            </div>
        </div>
        {showBusinessMOdal && <BusinessModal show={showBusinessMOdal} setShow={setShowBusinessModal}
                                             business={business}/>}
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
                    data={businesses}
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
};