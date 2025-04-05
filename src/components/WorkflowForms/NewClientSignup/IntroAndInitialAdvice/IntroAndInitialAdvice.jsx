import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LanguageContext } from '../../../../contexts/LanguageContext';
import mva_utils from '../../../../utilities/functions.jsx';
import strings from './i18n-strings';
import api from '../../../../utilities/api';

function IntroAndInitialAdvice({ caseId }) {
  const language = useContext(LanguageContext);
  strings.setLanguage(language || mva_utils.get_device_language());
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      await api.complete_workflow_step({
        workflow_business_key: caseId,
        task_definition_key: "introAndInitialAdvice"
      });
    } catch (error) {
    }
    setIsLoading(false);
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

