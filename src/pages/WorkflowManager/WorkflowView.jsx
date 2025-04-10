import {useEffect, useState} from "react";
import Loading from "react-loading";
import api from "../../utilities/api";
import WorkflowViewItem from "./WorkflowViewItem";

export default function WorkflowView({
    listItem = {},
    selectedStep,
    setSelectedStep
}) {

    const [workflowView, setWorkflowView] = useState([]);
    const [loading, setLoading] = useState(true);

    const id = listItem.id || "";

    useEffect(function () {
        // when selectedStep is changed by one of the steps,
        // we need to reload the workflow view to pick up any changes
        if (typeof selectedStep === "string" && selectedStep.length > 0) {
            api.get_workflow_view(id)
                .then(response => {
                    if (response.success) {
                        setWorkflowView(response.data);
                    }
                });
        }
    }, [selectedStep, id]);

    useEffect(function () {
        if (id === "") { // this should never happen
            setLoading(false);
        } else {
            get_workflow_view(id);
        }
    }, [listItem]);

    function get_workflow_view(process_instance_business_key) {
        setLoading(true);
        api.get_workflow_view(process_instance_business_key)
            .then(response => {
                if (response.success) {
                    const {data} = response;
                    setWorkflowView(data);
                }
                setLoading(false);
            });
    }

    return <>
        {
            !loading
            ? <div className="accordion mt-3">
                {workflowView.map(function (item, index) {
                    const is_last_item = workflowView.length === index + 1;
                    return <WorkflowViewItem key={item.id + "wvi"}
                                             selectedStep={selectedStep}
                                             reload={get_workflow_view}
                                             setSelectedStep={(step) => setSelectedStep(step)}
                                             item={item} subItem={false} isLastItem={is_last_item}/>;
                })}</div>
            : <div className="d-flex h-100 w-100">
                <div className="m-auto">
                    <Loading type="cylon" color="orange"/>
                </div>
            </div>}
    </>;

}