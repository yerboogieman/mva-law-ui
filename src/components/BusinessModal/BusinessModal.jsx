import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Modal, Placeholder as Placeholder_BS, Row} from "react-bootstrap";
import * as Yup from "yup";
import {MessageContextDispatch} from "../../contexts/MessagesContext";
import strings from "../../pages/SignUp/i18n-strings";
import api from "../../utilities/api";

export default function BusinessModal({
    show,
    setShow,
    user = {}
}) {

    const toast = useContext(MessageContextDispatch);

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    const businesses = formData.businesses || [];
    const roles = formData.roles || [];
    const statuses = formData.statuses || [];

    useEffect(function getFormData() {
        api.get_user_form_data()
            .then(function (result) {
                if (result.success === true) {
                    setFormData(result);
                }
                setLoading(false);
            });
    }, []);

    const init_user = {
        username: user.username || "",
        firstName: user.name?.first || "",
        lastName: user.name?.last || "",
        phone: user.phone || "",
        organizationId: user.organization?.xref || "",
        email: user.email || "",
        roles: user.roles || ["ROLE_USER"],
        status: user.status || "active"
    };

    function updateProfile(values) {

        const body = {
            username: values.username,
            name: {
                first: values.firstName,
                last: values.lastName
            },
            phone: values.phone,
            email: values.email,
            organizationId: values.organizationId,
            roles: values.roles,
            status: values.status
        };

        api.update_user(body)
            .then(result => {
                if (result.success === true) {
                    setShow(false);
                    const first_name = result?.name?.first || "User";
                    toast({
                        type: "show_toast",
                        header_text: "User created",
                        body_text: `${first_name} was successfully created`,
                        variant: "success",
                        onClose: () => console.log("we doing done did do")
                    });
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

    function test_toast() {

    }

    return <Modal show={show}
                  onHide={function () {
                      setShow(!show);
                  }}
                  size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title className="fs-14 fw-500 text-gray-700">
                {user.new
                    ? "New user"
                    : "User details"}
                <button onClick={test_toast}>Toast</button>
            </Modal.Title>
        </Modal.Header>
        <>
            <Formik validateOnChange={false}
                    initialValues={init_user}
                    validationSchema={Yup.object({
                        firstName: Yup.string().required(
                            strings.formatString(strings.first_name, strings.yup.is_required)),
                        lastName: Yup.string().required(`${strings.last_name} ${strings.yup.is_required}`),
                        phone: Yup.number()
                            .typeError(strings.yup.integer_type_error)
                            .min(10, strings.formatString(strings.yup.min_integer, 10)) // email: Yup.string()
                        //     .test("uniqueEmail", async function (value, context) {
                        //         const check_result = await jb_utils.check_email_for_duplicate(value, context);
                        //         return check_result === true || context.createError(
                        //             {message: strings.yup.email_invalid});
                        //     })
                    })}
                    onSubmit={(values, actions) => {
                        updateProfile(values, actions);
                    }}>
                {() => (
                    <Form autoComplete="false">
                        <Modal.Body>
                            {loading
                                ? <div>
                                    {/*<Loading type="bars" color="orange" className="m-auto"/>*/}
                                    <Row>
                                        <Col>
                                            <label className="form-label">First Name</label>
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
                                    <Field type="hidden" name="username"/>
                                    <Row>
                                        <Col>
                                            <label className="form-label">First Name</label>
                                            <Field type="text" name="firstName" className="form-control mb-3"/>
                                            <ErrorMessage name="firstName" component="div"
                                                          className="alert alert-danger"/>
                                        </Col>
                                        <Col>
                                            <label className="form-label">Last name</label>
                                            <Field type="text" name="lastName" className="form-control mb-3"/>
                                            <ErrorMessage name="lastName" component="div"
                                                          className="alert alert-danger"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label">Mobile number</label>
                                            <Field type="text" name="phone" className="form-control mb-3"/>
                                            <ErrorMessage name="phone" component="div" className="alert alert-danger"/>
                                        </Col>
                                        <Col>
                                            <label className="form-label">Email</label>
                                            <Field id="email" type="text" name="email"
                                                   className="form-control mb-3"/>
                                            <ErrorMessage id="email_error_message" name="email" component="div"
                                                          className="alert alert-danger"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label">Status</label>
                                            <Field as="select" className="form-select mb-3" name="status">
                                                <option value="">Not set</option>
                                                {statuses.map(function (status, index) {
                                                    return <option value={status.id} key={"status-" + index}>
                                                        {status.name}
                                                    </option>;
                                                })}
                                            </Field>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label" htmlFor="organizationId">Business</label>
                                            <Field as="select" className="form-select mb-3" name="organizationId">
                                                <option value="" disabled hidden>Select an employer</option>
                                                {// show business in alphabetical order, not "id" order
                                                    [...businesses].sort(function (a, b) {
                                                        const A = a.name.toUpperCase();
                                                        const B = b.name.toUpperCase();

                                                        if (A < B) {
                                                            return -1;
                                                        } else if (A > B) {
                                                            return 1;
                                                        } else {
                                                            return 0;
                                                        }
                                                    }).map(business => (
                                                        <option key={"business-" + business.xref}
                                                                value={business.xref}>{business.name}</option>
                                                    ))}
                                            </Field>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <label className="form-label">Roles</label>
                                            {roles.map(function (role, index) {
                                                return <div className="me-2" key={"role-check-" + index}>
                                                    <label className="form-check-label tc">
                                                        <Field type="checkbox" name="roles"
                                                               value={role.id}
                                                               component={Switch}
                                                        />
                                                    </label>
                                                </div>;

                                                function Switch({
                                                    field,
                                                    form,
                                                    ...props
                                                }) {
                                                    return <>
                                                        <div className="form-check form-switch">
                                                            <input {...field} {...props}
                                                                   id={"role-switch-" + role.id} name="roles"
                                                                   className="form-check-input" type="checkbox"
                                                                   value={role.id}/>
                                                            <label className="form-check-label"
                                                                   htmlFor={"role-switch-" + role.id}>
                                                                {role.name}
                                                            </label>
                                                        </div>
                                                    </>;
                                                }
                                            })}
                                        </Col>
                                    </Row>
                                </>}

                        </Modal.Body>
                        <Modal.Footer className="d-block text-center">
                            <Button type="submit" style={{width: "100%"}}>
                                {user && user.username !== ""
                                    ? "Save new user"
                                    : "Save user details"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </>
    </Modal>;
}