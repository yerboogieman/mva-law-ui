import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid'; 


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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Provider name is required'),
  type: Yup.string().required('Provider type is required'),
  streetAddress1: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('ZIP code is required'),
  phone: Yup.string().required('Phone number is required'),
  website: Yup.string().url('Please enter a valid URL').nullable(),
});

const MedicalProviderModal = ({ 
  show,
  onHide,
  onSave,
  initialValues = null,
  isEdit = false,
  providerTypes = [] 
}) => {

  const defaultValues = {
    name: '',
    type: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
  };

  const typesOptions = providerTypes.length > 0 ? providerTypes : [];

  const formInitialValues = initialValues ? {
    ...initialValues,
    streetAddress1: initialValues.streetAddress1 || initialValues.address || '',
    streetAddress2: initialValues.streetAddress2 || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    zipCode: initialValues.zipCode || '',
  } : defaultValues;

  const handleSaveProvider = (values, { resetForm }) => {
    //if it's a new provider, add a temporary ID 
    if (!isEdit) {
      values.id = uuidv4();
      values.isNew = true;
    }
    
    const providerData = {
      ...values,
      address: {
        streetAddress1: values.streetAddress1,
        streetAddress2: values.streetAddress2 || '',
        city: values.city,
        state: values.state,
        zipCode: values.zipCode
      }
    };
    
    // Remove individual address fields to prevent duplication
    delete providerData.streetAddress1;
    delete providerData.streetAddress2;
    delete providerData.city;
    delete providerData.state;
    delete providerData.zipCode;
    
    // Call the onSave function passed as a prop with the provider data
    onSave(providerData);
    
    // Reset the form and close the modal
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Medical Provider' : 'Add New Medical Provider'}</Modal.Title>
      </Modal.Header>
      
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSaveProvider}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Provider Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="type">
                    <Form.Label>Provider Type*</Form.Label>
                    <Form.Select
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.type && errors.type}
                    >
                      <option value="">Select Provider Type</option>
                      {typesOptions.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.type}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Address Section */}
              <div className="address-section mb-3 p-3 border rounded">
                <h5 className="mb-3">Address Information</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="streetAddress1">
                      <Form.Label>Street Address 1*</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress1"
                        value={values.streetAddress1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.streetAddress1 && errors.streetAddress1}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.streetAddress1}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="streetAddress2">
                      <Form.Label>Street Address 2</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress2"
                        value={values.streetAddress2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.streetAddress2 && errors.streetAddress2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.streetAddress2}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="city">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.city && errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="state">
                      <Form.Label>State*</Form.Label>
                      <Form.Select
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.state && errors.state}
                      >
                        <option value="">Select State...</option>
                        {usStates.map(state => (
                          <option key={state.code} value={state.code}>
                            {state.code} - {state.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="zipCode">
                      <Form.Label>ZIP Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={values.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.zipCode && errors.zipCode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zipCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone Number*</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.phone && errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="website">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      name="website"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.website && errors.website}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.website}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Provider'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default MedicalProviderModal; 