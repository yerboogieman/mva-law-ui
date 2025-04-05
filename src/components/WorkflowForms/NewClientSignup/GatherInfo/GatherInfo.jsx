import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import api from '../../../../utilities/api'; // Import the api utility


const GatherInfoForm = () => {

  const [organizations, setOrganizations] = useState([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);

  useEffect(() => {
    api.get_businesses()
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setOrganizations(response.data);
        }
        setIsLoadingOrganizations(false);
      })
      .catch(error => {
        console.error("Error fetching organizations:", error);
        setIsLoadingOrganizations(false);
        // Optionally show an error message to the user
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  const initialValues = {
    policeReportNumber: '',
    agency: '',
    medicalProviderId: '', // Add medicalProviderId
    otherNames: [''] // Initialize with one empty string for the first input
  };

  const validationSchema = Yup.object({
    policeReportNumber: Yup.string(), // Adjust validation as needed
    agency: Yup.string(), // Adjust validation as needed
    medicalProviderId: Yup.string(), // Add validation if required, e.g. .required()
    otherNames: Yup.array().of(Yup.string()) // Validate as an array of strings
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form Data:', values);
    // TODO: Implement API call to save the data
    alert('Form Submitted (check console for data). Integration pending.'); // Temporary alert
    setSubmitting(false);
  };

  return (
    <div>
      <h3>Gather Information</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Police Information</h5>
              </div>
              <div className="card-body">
                <Row className="mb-3">
                  <Col md={6}>
                    <label htmlFor="policeReportNumber" className="form-label">Police Report Number</label>
                    <Field
                      type="text"
                      name="policeReportNumber"
                      id="policeReportNumber"
                      className="form-control"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="policeReportNumber" component="div" className="text-danger mt-1" />
                  </Col>
                  <Col md={6}>
                    <label htmlFor="agency" className="form-label">Agency (if no report #)</label>
                    <Field
                      type="text"
                      name="agency"
                      id="agency"
                      className="form-control"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="agency" component="div" className="text-danger mt-1" />
                  </Col>
                </Row>
              </div>
            </div>

            {/* Placeholder for Medical Providers - To be implemented */}
            
            <div className="mb-3 p-3 border rounded bg-light">
              <label htmlFor="medicalProviderId" className="form-label">Medical Provider</label>
              <Field
                as="select"
                name="medicalProviderId"
                id="medicalProviderId"
                className="form-select"
                disabled={isLoadingOrganizations || isSubmitting} // Disable while loading or submitting
              >
                <option value="">{isLoadingOrganizations ? 'Loading...' : 'Select a provider...'}</option>
                {!isLoadingOrganizations && organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} {/* Adjust if the name field is different */}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="medicalProviderId" component="div" className="text-danger mt-1" />
              {/* TODO: Implement Medical Providers list */}
            </div>
            

            {/* Other Names Implementation */}
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="mb-0">Additional Passengers</h5>
              </div>
              <div className="card-body">
                <label className="form-label d-block">Names of anyone else who was in the car</label>
                <FieldArray name="otherNames">
                  {({ insert, remove, push, form }) => (
                    <div>
                      {form.values.otherNames.length > 0 &&
                        form.values.otherNames.map((name, index) => (
                          <Row key={index} className="mb-2 align-items-center">
                            <Col>
                              <Field
                                name={`otherNames.${index}`}
                                placeholder="Enter name"
                                type="text"
                                className="form-control"
                                disabled={form.isSubmitting}
                              />
                              <ErrorMessage
                                name={`otherNames.${index}`}
                                component="div"
                                className="text-danger mt-1"
                              />
                            </Col>
                            <Col xs="auto">
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={form.isSubmitting}
                              >
                                <FaTrash />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => push('')}
                        disabled={form.isSubmitting}
                      >
                        Add Another Name
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/*
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Information'}
            </Button>
            */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GatherInfoForm;