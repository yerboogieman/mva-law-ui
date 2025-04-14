import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LanguageContext } from '../../../../contexts/LanguageContext';
import mva_utils from '../../../../utilities/functions.jsx';
import strings from './i18n-strings';
import api from '../../../../utilities/api';

function IntroAndInitialAdvice({ caseId, setSelectedStep }) {
  const language = useContext(LanguageContext);
  strings.setLanguage(language || mva_utils.get_device_language());
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const response = await api.complete_workflow_step({
        workflow_business_key: caseId,
        task_definition_key: "introAndInitialAdvice"
      });
      
      if (response && response.success) {
        // After successful completion, update the view by fetching the latest workflow data
        const workflowResponse = await api.get_workflow_view(caseId);
        
        if (workflowResponse && workflowResponse.success) {
          // Set the next step (gatherInformation) as selected
          setSelectedStep("gatherInformation");
        }
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{strings.title}</h2>
      <ul>
        {strings.advicePoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : strings.buttonNext}
        </Button>
      </div>
    </div>
  );
}

export default IntroAndInitialAdvice;

