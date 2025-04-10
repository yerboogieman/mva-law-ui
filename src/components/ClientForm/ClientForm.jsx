import {ErrorMessage, Field, Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Placeholder as PlaceholderBootstrap, Row} from "react-bootstrap";
import * as Yup from "yup";
import strings from "../../pages/SignUp/i18n-strings";
import api from "../../utilities/api";

// Define US States for the dropdown
const usStates = [
    { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'District Of Columbia', code: 'DC' },
    { name: 'Florida', code: 'FL' }, { name: 'Georgia', code: 'GA' }, { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' }, { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' }, { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' }, { name: 'Maine', code: 'ME' }, { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' }, { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' }, { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' }, { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' }, { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' }, { name: 'North Dakota', code: 'ND' }, { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' }, { name: 'Oregon', code: 'OR' }, { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' }, { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' }, { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' }, { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' }, { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
];

export default function ClientForm({
                                      client = {new: true},
                                      callback
                                   }) {

   const [loading, setLoading] = useState(false);
   const [statuses, setStatuses] = useState([]);

   const init_client = {
      id: client.id || null,
      firstName: client.name?.first || "",
      middleName: client.name?.middle || "",
      lastName: client.name?.last || "",
      phone: client.phone || "",
      email: client.email || "",
      status: client.status || "active",
      streetAddress1: client.address?.streetAddress1 || "",
      streetAddress2: client.address?.streetAddress2 || "",
      city: client.address?.city || "",
      state: client.address?.state || "",
      zipCode: client.address?.zipCode || ""
   };

   function submitForm(values) {

      const body = {
         id: values.id,
         name: {
            first: values.firstName,
            middle: values.middleName || "",
            last: values.lastName
         },
         address: {
            streetAddress1: values.streetAddress1,
            streetAddress2: values.streetAddress2 || "",
            city: values.city,
            state: values.state,
            zipCode: values.zipCode
         },
         phone: values.phone,
         email: values.email,
         username: values.email,
         status: values.status
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
                    `${strings.first_name} ${strings.yup.is_required}`),
                 lastName: Yup.string().required(`${strings.last_name} ${strings.yup.is_required}`),
                 phone: Yup.number()
                    .typeError(strings.yup.integer_type_error)
                    .min(10, strings.formatString(strings.yup.min_integer, 10))
                    .required(`${strings.mobile_phone} ${strings.yup.is_required}`),
                 email: Yup.string()
                    .email(strings.yup.email_invalid)
                    .required(`${strings.email} ${strings.yup.is_required}`)
                    .test("uniqueEmail", async function (value, context) {
                       const check_result = await api.check_for_duplicate({value});
                       if (typeof check_result === "object") {
                          return check_result.valid === true || context.createError(
                             {message: strings.yup.email_invalid});
                       }
                    }),
                 streetAddress1: Yup.string().required(
                    `${strings.street_address1} ${strings.yup.is_required}`),
                 city: Yup.string().required(
                    `${strings.city} ${strings.yup.is_required}`),
                 state: Yup.string().required(
                    `${strings.state} ${strings.yup.is_required}`),
                 zipCode: Yup.string().required(
                    `${strings.zip_code} ${strings.yup.is_required}`)
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
                                 {strings.first_name}
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">{strings.middle_name}</label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.last_name}
                              </label>
                              <Placeholder/>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.mobile_phone}
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.email}
                              </label>
                              <Placeholder/>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.street_address1}
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">{strings.street_address2}</label>
                              <Placeholder/>
                           </Col>
                        </Row>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.city}
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.state}
                              </label>
                              <Placeholder/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.zip_code}
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
                     </div>
                     : <>
                        <Field type="hidden" name="id"/>
                        {/* Name Section */}
                        <div className="name-section mb-3 p-3 border rounded">
                           <h5 className="mb-3">{strings.section_title_name}</h5>
                           <Row>
                              <Col md={4}>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.first_name}
                                 </label>
                                 <Field type="text" name="firstName" className="form-control mb-3"/>
                                 <ErrorMessage name="firstName" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                              <Col md={4}>
                                 <label className="form-label">{strings.middle_name}</label>
                                 <Field type="text" name="middleName" className="form-control mb-3"/>
                              </Col>
                              <Col md={4}>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.last_name}
                                 </label>
                                 <Field type="text" name="lastName" className="form-control mb-3"/>
                                 <ErrorMessage name="lastName" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                           </Row>
                        </div>
                        <Row>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.mobile_phone}
                              </label>
                              <Field type="text" name="phone" className="form-control mb-3"/>
                              <ErrorMessage name="phone" component="div" className="alert alert-danger p-1"/>
                           </Col>
                           <Col>
                              <label className="form-label">
                                 <sup className="text-danger me-2">*</sup>
                                 {strings.email}
                              </label>
                              <Field id="email" type="text" name="email"
                                     className="form-control mb-3"/>
                              <ErrorMessage id="email_error_message" name="email" component="div"
                                            className="alert alert-danger p-1"/>
                           </Col>
                        </Row>
                        {/* Address Section */}
                        <div className="address-section mb-3 p-3 border rounded">
                           <h5 className="mb-3">{strings.section_title_address}</h5>
                           <Row>
                              <Col>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.street_address1}
                                 </label>
                                 <Field type="text" name="streetAddress1" className="form-control mb-3"/>
                                 <ErrorMessage name="streetAddress1" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                              <Col>
                                 <label className="form-label">{strings.street_address2}</label>
                                 <Field type="text" name="streetAddress2" className="form-control mb-3"/>
                              </Col>
                           </Row>
                           <Row>
                              <Col md={4}>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.city}
                                 </label>
                                 <Field type="text" name="city" className="form-control mb-3"/>
                                 <ErrorMessage name="city" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                              <Col md={4}>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.state}
                                 </label>
                                 <Field as="select" name="state" className="form-select mb-3">
                                    <option value="">Select State...</option>
                                    {usStates.map(state => (
                                       <option key={state.code} value={state.code}>
                                          {state.code} - {state.name}
                                       </option>
                                    ))}
                                 </Field>
                                 <ErrorMessage name="state" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                              <Col md={4}>
                                 <label className="form-label">
                                    <sup className="text-danger me-2">*</sup>
                                    {strings.zip_code}
                                 </label>
                                 <Field type="text" name="zipCode" className="form-control mb-3"/>
                                 <ErrorMessage name="zipCode" component="div"
                                               className="alert alert-danger p-1"/>
                              </Col>
                           </Row>
                        </div>
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