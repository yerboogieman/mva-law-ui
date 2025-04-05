import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Collapse, Modal, Placeholder as Placeholder_BS, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import * as Yup from "yup";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import api from "../../utilities/api";

import Select from "react-select";
import ClientForm from "../ClientForm/ClientForm";

export default function CaseModal({
    show,
    setShow,
    case_data = {},
    onUpdate
}) {

    const toast = useContext(MessageContextDispatch);

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [creatingCase, setCreatingCase] = useState(false);

    const [showAddClient, setShowAddClient] = useState(false);
    const [selectedClient, setSelectedClient] = useState({});

    const {clients = []} = formData;

    const client_select_data = clients.length > 0
        ? clients.map((client) => {
            return option(client);
        })
        : [];

    useEffect(getFormData, []);

    function option(client = {}) {

        if (typeof client === "object" && client.email) {
            return {
                label: name(client) + (
                    client?.organization?.name
                        ? ` (${client.organization.name})`
                        : ""
                ),
                value: client.id
            };
        }

        return {};

        function name(client) {
            return client?.name?.first + " " + client?.name?.last;
        }
    }

    function getFormData() {
        api.get_client_form_data()
            .then(function (result) {
                if (result.success === true) {
                    setFormData(result);
                }
                setLoading(false);
            });
    }

    const init_case = {
        new: true,
        name: case_data.name || "",
        description: case_data.description || "",
        due: case_data.due || "",
        assignee: case_data.assignee || "",
        clientId: selectedClient || null,
        status: case_data.status || "Active"
    };

    function updateCase(values) {
        const body = {
            name: values.name,
            description: values.description,
            clientId: values.client,
            items: values.items || []
        };

        api.update_case(body)
            .then(result => {
                if (result.success === true) {
                    setShow(false);
                    const first_name = result?.name?.first || "User";
                    toast({
                        type: "show_toast",
                        header_text: "User created",
                        body_text: `${first_name} was successfully created`,
                        variant: "success"
                    });
                }
            });
    }

    function create_case(values) {
        const body = {
            name: values.name,
            description: values.description,
            client_id: values.client,
            items: values.items || []
        };

        setCreatingCase(true);

        api.create_case(body)
            .then(result => {
                if (result.success === true) {
                    setShow(false);
                    const case_name = result?.name || "Case";

                    if (typeof onUpdate === "function") {
                        onUpdate();
                    }

                    toast({
                        type: "show_toast",
                        header_text: "Case created",
                        body_text: <>{case_name} was successfully created. Click <Link to={`/workflow-manager?id=${result.id}`}>here</Link> to create the estimate.</>,
                        variant: "success"
                    });
                    setCreatingCase(false);
                }
            });
    }

    function Placeholder() {
        const className = "placeholder w-100";
        const animation = "wave";
        return <div className="mb-3">
            <Placeholder_BS.Button
                bg="secondary-subtle" className={className}
                animation={animation}></Placeholder_BS.Button>
        </div>;
    }

    return <Modal show={show}
                  onHide={function () {
                      setShow(!show);
                  }}
                  size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title className="fs-14 fw-500 text-gray-700">
                Case Details
            </Modal.Title>
        </Modal.Header>
        <>
            <Formik validateOnChange={false}
                    initialValues={init_case}
                    validationSchema={Yup.object({
                        name: Yup.string().required()
                    })}
                    onSubmit={(values, actions) => {
                        create_case(values, actions);
                    }}>
                {(props) => (
                    <>
                        <Modal.Body className="p-0">
                            {loading
                                ? <div className="px-3 pb-3 ">
                                    <Row>
                                        <Col>
                                            <label className="form-label">Case Name</label>
                                            <Placeholder/>
                                        </Col>
                                        <Col>
                                            <label className="form-label">Last name</label>
                                            <Placeholder/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label">Mobile number</label>
                                            <Placeholder/>
                                        </Col>
                                        <Col>
                                            <label className="form-label">Email</label>
                                            <Placeholder/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label">Status</label>
                                            <Placeholder/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label" htmlFor="organization">Business</label>
                                            <Placeholder/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="mb-0">
                                            <label className="form-label">Roles</label>
                                            <Placeholder_BS
                                                className="w-25 rounded border border-primary d-block mt-1 mb-2"
                                                style={{marginBottom: ".125rem"}}
                                                bg="secondary-subtle"></Placeholder_BS>
                                            <Placeholder_BS className="w-25 rounded border border-primary d-block my-2"
                                                            style={{marginBottom: ".125rem"}}
                                                            bg="secondary-subtle"></Placeholder_BS>
                                        </Col>
                                    </Row>
                                </div>
                                : <>
                                    <Collapse in={!showAddClient}>
                                        <div className="px-3 pb-3" style={{
                                            transitionDuration: "500ms",
                                            transitionTimingFunction: "cubic-bezier(0.29, 0.9, 0.66, 0.95)"
                                        }}>
                                            <Form autoComplete="false">
                                                <Row>
                                                    <Col>
                                                        <label className="form-label mt-3">Case Name</label>
                                                        <Field type="text" name="name" className="form-control mb-3"
                                                               required disabled={creatingCase}/>
                                                        <ErrorMessage name="name" component="div"
                                                                      className="alert alert-danger"/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <label className="form-label">Description</label>
                                                        <Field type="text" name="description"
                                                               className="form-control mb-3"/>
                                                        <ErrorMessage name="description" component="div"
                                                                      className="alert alert-danger"/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>

                                                        <label className="form-label">Client</label>
                                                        <div className="d-flex">
                                                            <Field name="client" disabled={creatingCase}
                                                                   component={() =>
                                                                       <>
                                                                           <Select id="client-select" name="client"
                                                                                   inputId="client"
                                                                                   className="w-100 mb-3"
                                                                                   blurInputOnSelect={true}
                                                                                   disabled={creatingCase}
                                                                                   placeholder="Select or add client"
                                                                                   onChange={(selected, {action}) => {
                                                                                       if (action === "select-option") {
                                                                                           props.setFieldValue("client",
                                                                                               selected.value);
                                                                                           setSelectedClient(selected);
                                                                                       }
                                                                                   }}
                                                                                   defaultValue={selectedClient.label
                                                                                       ? selectedClient
                                                                                       : false}
                                                                                   options={client_select_data} required
                                                                                   noOptionsMessage={() => <div>
                                                                                       No clients yet, please <a
                                                                                       onClick={() => setShowAddClient(
                                                                                           true)}
                                                                                       className="btn-link">create
                                                                                       one</a> to
                                                                                       finish setting up this case.
                                                                                   </div>}
                                                                                   isSearchable={true}/>
                                                                       </>
                                                                   }>

                                                            </Field>
                                                            <div className="ms-2">
                                                                <Button type="button"
                                                                        disabled={creatingCase}
                                                                        variant="primary"
                                                                        onClick={() => setShowAddClient(
                                                                            true)}>New</Button>
                                                            </div>
                                                        </div>

                                                    </Col>
                                                </Row>
                                                <Button type="submit" className="w-100" disabled={false && creatingCase}>
                                                    {creatingCase
                                                        ? "Saving"
                                                        : "Save Case"}
                                                </Button>

                                            </Form>
                                        </div>
                                    </Collapse>

                                    <Collapse in={showAddClient}>
                                        <div style={{
                                            transitionDuration: "500ms",
                                            transitionTimingFunction: "cubic-bezier(0.29, 0.9, 0.66, 0.95)"
                                        }}>
                                            <div className="bg-light border rounded p-3">
                                                <div className="d-flex justify-content-between">
                                                    <h4>Add new client</h4>
                                                    <Button variant="close"
                                                            onClick={() => setShowAddClient(false)}></Button>
                                                </div>
                                                <ClientForm callback={function (data) {

                                                    if (data.success === true) {
                                                        setShowAddClient(false);
                                                        setSelectedClient(option(data));
                                                        getFormData();
                                                    }

                                                }}/>
                                            </div>
                                        </div>
                                    </Collapse>
                                </>}
                        </Modal.Body>
                    </>
                )}
            </Formik>
        </>
    </Modal>;
} 