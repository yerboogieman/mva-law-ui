import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import JobModal from "../../components/JobModal/JobModal";
import api from "../../utilities/api";
import WorkflowPanel from "./WorkflowPanel";
import WorkflowTask from "./WorkflowTask";
import WorkflowView from "./WorkflowView";
import "./workflow.css";

export default function WorkflowManager() {

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const selected_job_from_nav = check_history(searchParams, location);

    const [workListItems, setWorkListItems] = useState([]);
    const [selectedWorkListItem, setSelectedWorkListItem] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);

    const listItem = workListItems.find(a => a.id === selectedWorkListItem);

    useEffect(() => {

        const query_params_id = searchParams.get("id");

        if (query_params_id !== selectedWorkListItem) {

            const id = selectedWorkListItem || "";
            setSearchParams({id: selectedWorkListItem});

            const url = new URL(window.location);
            url.searchParams.set("id", id);
        }

        document.title = listItem?.name || "Worklist";
    }, [selectedWorkListItem]);

    useEffect(function () {

        window.addEventListener("popstate", function onPop() {
            navigate("/job-list"); // just go back to the job list
        });

        // get them workflows
        api.get_jobs()
            .then(response => {
                if (response.success) {
                    setWorkListItems(response.data);
                    if (selected_job_from_nav) {
                        setSelectedWorkListItem(selected_job_from_nav);
                    } else if (Array.isArray(response.data) && response.data.length > 0) {
                        const id = response.data[0].id;
                        setSelectedWorkListItem(id);
                    }
                }
            });
    }, []);


    return <>
        <div className="row pt-3">
            {showJobModal && <JobModal show={showJobModal} setShow={setShowJobModal} job={{}}/>}
            <div className="col-sm-3">
                <ul className="nav flex-column task-list">
                    <h3 className="text-center">Task list</h3>
                    {
                        workListItems.length > 0
                        ? workListItems.map(function (listItem) {
                            const active = selectedWorkListItem === listItem.id;
                            return <WorkflowTask name={listItem.name} key={listItem.id + "wli"}
                                                 id={listItem.id} active={active}
                                                 onClick={function (workflow_id) {
                                                     if (!active) {
                                                         setSelectedStep(null);
                                                         setSelectedWorkListItem(workflow_id);
                                                     }
                                                 }}
                                                 description={listItem.description}/>;
                        })
                        : <span className="text-center my-4">No jobs found.
                                <button className="btn btn-link" type="button"
                                        onClick={() => setShowJobModal(true)}>Add a job</button>
                        </span>
                    }
                </ul>
            </div>
            <div className="col-sm-3 px-0">
                <h3 className="text-center">Workflow View</h3>
                {selectedWorkListItem && <WorkflowView listItem={listItem}
                                                       selectedStep={selectedStep}
                                                       setSelectedStep={function (step) {
                                                           return setSelectedStep(step);
                                                       }}/>}
            </div>
            <div className="col pe-3">
                <h3 className="text-center">Workflow Panel</h3>
                {selectedWorkListItem
                    && <WorkflowPanel setSelectedStep={function (step) {
                        return setSelectedStep(step);
                    }}
                                      selectedWorkListItem={selectedWorkListItem}
                                      listItem={listItem} selectedStep={selectedStep}></WorkflowPanel>}
            </div>
        </div>
    </>;
}

function check_history(searchParams, location) {

    const state = location.state || {};

    const id_from_search = "get" in searchParams && searchParams.get("id");

    if (id_from_search) {
        return id_from_search;
    }

    if (state && state.job) {
        return state.job.id;
    }

    return null;

}