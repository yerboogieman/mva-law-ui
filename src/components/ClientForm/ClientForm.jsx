import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Placeholder as PlaceholderBootstrap, Row} from "react-bootstrap";
import * as Yup from "yup";
import strings from "../../pages/SignUp/i18n-strings";
import api from "../../utilities/api";

export default function ClientForm({
                                      client = {new: true},
                                      callback
                                   }) {

   const [loading, setLoading] = useState(false);
   const [statuses, setStatuses] = useState([]);

   const init_client = {
      id: client.id || null,
      firstName: client.name?.first || "",
      lastName: client.name?.last || "",
      phone: client.phone || "",
      email: client.email || "",
      status: client.status || "active"
   };

   function submitForm(values) {

      const body = {
         id: values.id,
         name: {
            first: values.firstName,
            last: values.lastName
         },
         phone: values.phone,
         email: values.email,
         username: values.email,
         status: values.status,
         properties: {
            businessName: values.business_name
         }
      };

      api.create_client(body)
         .then(result => {
            if (result.success === true) {
               callback(result);
            }
         });

   }

   useEffect(() => {
      api.get_all_statuses()
         .then(result => {
            if (Array.isArray(result) && result.length > 0) {
               setStatuses(result);
            }
         });
   }, []);

   function Placeholder() {
      const className = "placeholder w-100";
      const animation = "wave";
      return <div className="mb-3">
         <PlaceholderBootstrap.Button
            bg="secondary-subtle" className={className}
            animation={animation}></PlaceholderBootstrap.Button>
      </div>;
   }

   return <div>
      <Formik validateOnChange={false}
              initialValues={init_client}
              validationSchema={Yup.object({
                 firstName: Yup.string().required(
                    strings.formatString(strings.first_name, strings.yup.is_required)),
                 lastName: Yup.string().required(`${strings.last_name} ${strings.yup.is_required}`),
                 phone: Yup.number()
                    .typeError(strings.yup.integer_type_error)
                    .min(10, strings.formatString(strings.yup.min_integer, 10)),
                 email: Yup.string()
                    .email(strings.yup.email_invalid)
                    .required(`An ${strings.email} ${strings.yup.is_required}`)
                    .test("uniqueEmail", async function (value, context) {

                       const check_result = await api.check_for_duplicate({value});
                       if (typeof check_result === "object") {
                          return check_result.valid === true || context.createError(
                             {message: strings.yup.email_invalid});
                       }
                    })
              })}
              onSubmit={(values, actions) => {
                 submitForm(values, actions);
              }}>
         {() => (
            <Form autoComplete="false">
               <Modal.Body>
                  {loading
                     ? <div>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 First Name
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 Last name
                              </label>
                              <Placeholder/>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <label className="form-label">Mobile number</label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 Email
                              </label>
                              <Placeholder/>
                           </Col>
                        </Row>
                        {
                           !client.new &&
                           <Row>
                              <Col>
                                 <label className="form-label">Status</label>
                                 <Placeholder/>
                              </Col>
                           </Row>
                        }
                        <Row>
                           <Col>
                              <label className="form-label" htmlFor="organization">Employer</label>
                              <Placeholder/>
                           </Col>
                        </Row>
                     </div>
                     : <>
                        <Field type="hidden" name="id"/>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 First Name
                              </label>
                              <Field type="text" name="firstName" className="form-control mb-3"/>
                              <ErrorMessage name="firstName" component="div"
                                            className="alert alert-danger"/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 Last name
                              </label>
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
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>Email
                              </label>
                              <Field id="email" type="text" name="email"
                                     className="form-control mb-3"/>
                              <ErrorMessage id="email_error_message" name="email" component="div"
                                            className="alert alert-danger"/>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <label className="form-label">Employer</label>
                              <Field id="business_name" type="text" name="business_name"
                                     className="form-control mb-3"/>
                              <ErrorMessage id="email_error_message" name="business_name" component="div"
                                            className="alert alert-danger"/>
                           </Col>
                        </Row>
                        {
                           !client.new &&
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
                           </Row>}
                     </>}

               </Modal.Body>
               <Modal.Footer className="d-block text-center">
                  <Button type="submit" style={{width: "100%"}}>
                     {client
                        ? "Save new client"
                        : "Save client details"}
                  </Button>
               </Modal.Footer>
            </Form>
         )}
      </Formik></div>;


}