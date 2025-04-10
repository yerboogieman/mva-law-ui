import React, { useContext, useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import api from '../../../../utilities/api';
import { MessageContextDispatch } from '../../../../contexts/MessagesContext';
import MedicalProviderModal from './MedicalProviderModal';
import { API_BASE_URL } from '../../../../Constants'; 

const GatherInfoForm = ({ caseId, setSelectedStep }) => {
  const toast = useContext(MessageContextDispatch);
  const [loading, setLoading] = useState(true);
  const [medicalProviders, setMedicalProviders] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  

  const [currentPassenger, setCurrentPassenger] = useState({ name: '', phone: '' });
  const [isEditingPassenger, setIsEditingPassenger] = useState(false);
  

  const [hasPoliceReportCopy, setHasPoliceReportCopy] = useState(false);

  useEffect(() => {
    fetchProviderTypes();
  }, []);


  const fetchProviderTypes = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem('token');
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/types/organizations/healthcare_provider`;
      


      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });



      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
             type: 'fetch-error', title: response.statusText, status: response.status, 
             detail: 'Failed to parse error response', instance: '/types/organizations'
            }));

         const errorResponse = { success: false, ...errorData, message: errorData.detail || `HTTP error! status: ${response.status}` };
        throw errorResponse; 
      }

      const data = await response.json();


      if (Array.isArray(data)) {
        const medicalTypes = data.map(item => ({
          value: item.xref || item.id,
          label: item.name || item.description || item.xref
        }));
        setProviderTypes(medicalTypes);

      } else if (data && data.success && Array.isArray(data.data)) { 
        const medicalTypes = data.data.map(item => ({
          value: item.xref || item.id,
          label: item.name || item.description || item.xref
        }));
        setProviderTypes(medicalTypes);

      } else {
         const errorData = { type: 'api-error', title: 'Invalid API Response Format', status: 200, 
                           detail: 'API response format is neither a direct array nor {success, data: [...]}.', instance: '/types/organizations', data: data };
         const errorResponse = { success: false, ...errorData, message: errorData.detail };
         showToastError(errorResponse.message);
      }
    } catch (error) {
        const errorMessage = error.message || 'Error loading provider types (Fetch)';
        showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const showToastError = (message) => {
    toast({
      type: 'show_toast',
      header_text: 'Error',
      body_text: message,
      variant: 'danger'
    });
  };

  const initialValues = {
    policeReportNumber: '',
    agency: '',
    additionalPassengers: [],
    hasPoliceReportCopy: false
  };

  const validationSchema = Yup.object().shape({
    policeReportNumber: Yup.string(),
    agency: Yup.string(),
    additionalPassengers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phone: Yup.string().required('Phone is required')
      })
    )
  });

  const handlePassengerChange = (e) => {
    const { name, value } = e.target;
    setCurrentPassenger({
      ...currentPassenger,
      [name]: value
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    
    try {
      const policeReportData = {
        reportNumber: values.policeReportNumber,
        agency: values.agency
      };
      
      const newProviders = medicalProviders.filter(provider => provider.isNew);
      const existingProviders = medicalProviders.filter(provider => !provider.isNew);
      
      let medicalProviderIds = [...existingProviders.map(p => p.id)];
      
      if (newProviders.length > 0) {
        for (const provider of newProviders) {
          try {
            const xrefValue = provider.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '')
              .trim();
            
            const providerData = {
              name: provider.name,
              xref: xrefValue,
              address: provider.address ? {
                streetAddress1: provider.address.streetAddress1,
                streetAddress2: provider.address.streetAddress2 || '',
                city: provider.address.city,
                state: provider.address.state,
                zipCode: provider.address.zipCode
              } : null,
              phone: provider.phone || null,
              website: provider.website || null,
              types: ['medical_provider', typeof provider.type === 'object' ? provider.type.value : provider.type]
            };
            
            const result = await api.create_organization(providerData);
            if (result.success && result.data && result.data.id) {
              medicalProviderIds.push(result.data.id);
            } else {
              throw new Error(`Failed to create provider ${provider.name}`);
            }
          } catch (error) {
            toast({
              type: "show_toast",
              header_text: "Error",
              body_text: `Failed to create provider ${provider.name}`,
              variant: "danger"
            });
            throw error;
          }
        }
      }
      
      const dataToSend = {
        id: caseId,
        policeReport: policeReportData,
        additionalPassengers: values.additionalPassengers,
        medicalProviders: medicalProviderIds
      };

      const updateResult = await api.update_whole_case(dataToSend);
      
      if (updateResult && updateResult.success) {
        toast({
          type: "show_toast",
          header_text: "Success",
          body_text: "Information saved successfully",
          variant: "success"
        });
        if (setSelectedStep) {
          setSelectedStep("createEstimate");
        }
      } else {
        const errorMsg = updateResult?.message || "Failed to save information";
        toast({
          type: "show_toast",
          header_text: "Error",
          body_text: errorMsg,
          variant: "danger"
        });
        return;
      }
    } catch (error) {
      toast({
        type: "show_toast",
        header_text: "Error",
        body_text: "Failed to save information",
        variant: "danger"
      });
    } finally {
    setSubmitting(false);
    }
  };

  const handleAddProvider = () => {
    setEditingProvider(null);
    setShowProviderModal(true);
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setShowProviderModal(true);
  };

  const handleSaveProvider = (provider) => {
    if (editingProvider) {
      // Edit existing provider
      setMedicalProviders(medicalProviders.map(p => 
        p.id === provider.id ? provider : p
      ));
    } else {
      // Add new provider
      setMedicalProviders([...medicalProviders, provider]);
    }
  };

  const handleRemoveProvider = (providerId) => {
    setMedicalProviders(medicalProviders.filter(p => p.id !== providerId));
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            {/* Police Report Information Section */}
            <Card className="mb-4">
              <Card.Header>Police Report Information</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label htmlFor="hasPoliceReportCopy" className="mb-0">
                    I have a copy of police report
                  </Form.Label>
                  <Form.Check
                    type="switch"
                    id="hasPoliceReportCopy"
                    checked={hasPoliceReportCopy}
                    onChange={(e) => {
                      setHasPoliceReportCopy(e.target.checked);
                      setFieldValue('hasPoliceReportCopy', e.target.checked);
                    }}
                  />
                </div>
                <Row>
              <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Police Report Number</Form.Label>
                      <Form.Control
                  type="text"
                  name="policeReportNumber"
                        value={values.policeReportNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.policeReportNumber && errors.policeReportNumber}
                      />
                      <ErrorMessage
                        name="policeReportNumber"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
              </Col>
              <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Agency</Form.Label>
                      <Form.Control
                  type="text"
                  name="agency"
                        value={values.agency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.agency && errors.agency}
                      />
                      <ErrorMessage
                        name="agency"
                        component="div"
                        className="text-danger"
                      />
                    </Form.Group>
              </Col>
            </Row>
              </Card.Body>
            </Card>

            {/* Additional Passengers Section */}
            <Card className="mb-4">
              <Card.Header>Additional Passengers</Card.Header>
              <Card.Body>
                <FieldArray name="additionalPassengers">
                  {({ push, remove }) => (
                    <>
                      {values.additionalPassengers && values.additionalPassengers.length > 0 ? (
                        <ListGroup className="mb-3">
                          {values.additionalPassengers.map((passenger, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{passenger.name}</strong> 
                                {passenger.phone && <span className="ms-2">({passenger.phone})</span>}
                              </div>
                              <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => remove(index)}
                              >
                                <FaTrash />
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p>No additional passengers added.</p>
                      )}
                      
                      {!isEditingPassenger ? (
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            setCurrentPassenger({ name: '', phone: '' });
                            setIsEditingPassenger(true);
                          }}
                        >
                          <FaPlus /> Add Passenger
                        </Button>
                      ) : (
                        <div className="mt-3 border p-3 rounded bg-light">
                          <h6>New Passenger</h6>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Name*</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={currentPassenger.name}
                                  onChange={handlePassengerChange}
                                  isInvalid={!currentPassenger.name && touched.name}
                                />
                                {!currentPassenger.name && touched.name && (
                                  <Form.Control.Feedback type="invalid">
                                    Name is required
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone*</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="phone"
                                  value={currentPassenger.phone}
                                  onChange={handlePassengerChange}
                                  isInvalid={!currentPassenger.phone && touched.phone}
                                />
                                {!currentPassenger.phone && touched.phone && (
                                  <Form.Control.Feedback type="invalid">
                                    Phone is required
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => {
                                if (currentPassenger.name && currentPassenger.phone) {
                                  push(currentPassenger);
                                  setCurrentPassenger({ name: '', phone: '' });
                                  setIsEditingPassenger(false);
                                }
                              }}
                              disabled={!currentPassenger.name || !currentPassenger.phone}
                            >
                              Save Passenger
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                setCurrentPassenger({ name: '', phone: '' });
                                setIsEditingPassenger(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </Card.Body>
            </Card>

            {/* Medical Providers Section */}
            <Card className="mb-4">
              <Card.Header>Medical Providers</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <h6>Added Medical Providers</h6>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddProvider}
                  >
                    <FaPlus /> Add Medical Provider
                  </Button>
            </div>

                {medicalProviders.length > 0 ? (
                  <ListGroup className="mb-3">
                    {medicalProviders.map((provider) => (
                      <ListGroup.Item key={provider.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{provider.name}</strong> 
                          {provider.type && <span className="ms-2 badge bg-info">{provider.type}</span>}
                          {provider.isNew && <span className="ms-2 badge bg-warning">New</span>}
                          <div className="small text-muted">
                            {provider.phone && <span>{provider.phone}</span>}
                            {provider.address && (
                              <span className="ms-2">
                                {typeof provider.address === 'string' 
                                  ? provider.address 
                                  : `${provider.address.streetAddress1 || ''}${
                                      provider.address.city ? ', ' + provider.address.city : ''
                                    }${
                                      provider.address.state ? ', ' + provider.address.state : ''
                                    }${
                                      provider.address.zipCode ? ' ' + provider.address.zipCode : ''
                                    }`
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEditProvider(provider)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleRemoveProvider(provider.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No medical providers added yet.</p>
                )}
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Save and Continue'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Medical Provider Modal */}
      <MedicalProviderModal
        show={showProviderModal}
        onHide={() => setShowProviderModal(false)}
        onSave={handleSaveProvider}
        initialValues={editingProvider}
        isEdit={!!editingProvider}
        providerTypes={providerTypes}
      />
    </Container>
  );
};

export default GatherInfoForm;