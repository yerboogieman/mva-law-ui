import {useState} from "react";
import {Fade} from "react-bootstrap";
import Loading from "react-loading";
import ClientReviewsEstimate from "../../components/WorkflowForms/ClientReviewsEstimate/ClientReviewsEstimate";
import CreateEstimate from "../../components/WorkflowForms/CreateEstimate/CreateEstimate";
import RedoEstimate from "../../components/WorkflowForms/RedoEstimate/RedoEstimate";
import IntroAndInitialAdvice from "../../components/WorkflowForms/NewClientSignup/IntroAndInitialAdvice/IntroAndInitialAdvice";
import GatherInfoForm from "../../components/WorkflowForms/NewClientSignup/GatherInfo/GatherInfo.jsx";

export default function WorkflowPanel({
    listItem,
    selectedWorkListItem = "",
    selectedStep,
    setSelectedStep
}) {

    const [loading, setLoading] = useState(null);

    return <>
        <div className="border-secondary rounded mt-3">
            {
                selectedStep
                ? loading
                  ? <><Loading type="spin" color="orange"/> </>
                  : <Fade in={true} className="">
                      <div>{selectedStep
                            ? <Panel caseId={selectedWorkListItem}
                                     step={selectedStep}/>
                            : <ErrorPanel/>}
                      </div>
                  </Fade>
                : <NullPanel/>
            }
        </div>
    </>;

    function Panel({
        step,
        caseId
    }) {

        switch (step) {
            case "introAndInitialAdvice": {
                return <IntroAndInitialAdvice caseId={caseId} setSelectedStep={function (value) {
                    setSelectedStep(value);
                }}/>;
            }
            case "gatherInformation": {
                return <GatherInfoForm caseId={caseId} setSelectedStep={setSelectedStep}/>;
            }
            case "createEstimate": {
                return <CreateEstimate caseId={caseId} setSelectedStep={
                    function (value) {
                        setSelectedStep(value);
                    }
                }/>;
            }

            case "clientReviewsEstimate": {
                return <ClientReviewsEstimate caseId={caseId} setSelectedStep={function (value) {
                    setSelectedStep(value);
                }}/>;
            }

            case "contractorReDoesEstimate": {
                return <RedoEstimate caseId={caseId} setSelectedStep={function (value) {
                    setSelectedStep(value);
                }}/>;
            }


            default: {
                return <ErrorPanel step={step}/>;
            }
        }
    }

}


function NullPanel() {
    return <div></div>;
}

function ErrorPanel({step}) {
    return <div>
        <h3>Error</h3>
        <div>There was an error retrieving the information for the <strong>{step}</strong> step. Please contact support.
        </div>

        <div className="mt-4" style={{color: "#008DDE"}}>
            <div>DEVELOPER TODO</div>

            <div>
                <code  style={{color: "#008DDE"}}>
                    This is probably because the <strong style={{fontStyle: "italic"}}>{step}</strong> component has not been built yet.
                </code>
            </div>
            <div>
                <code  style={{color: "#008DDE"}}>
                    Create the <strong style={{fontStyle: "italic"}}>{step}.jsx</strong> file in src/components/WorkflowForms/{step}/{step}.jsx
                </code>
            </div>
        </div>
    </div>;
}