import React, {useEffect} from "react";
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./workflow.css";
import RadioButtonChecked from "../../RadioButtonChecked/RadioButtonChecked";
import RadioButtonLocked from "../../RadioButtonLocked/RadioButtonLocked";
import RadioButtonSelected from "../../RadioButtonSelected/RadioButtonSelected";

export default function WorkflowViewItem({
    isLastItem,
    item,
    selectedStep,
    setSelectedStep,
    subItem
}) {

    const {
        completed,
        id,
        label,
        started,
        steps = [],
        taskDefinitionKey: task_definition_key
    } = item;

    const in_progress = started && typeof completed === "undefined";

    const isStarted = started !== undefined;
    const isCompleted = completed !== undefined;

    useEffect(function () {
        subItem && in_progress && setSelectedStep(id);
    }, []);

    const completion_percent = isCompleted
        ? 100
        : (
            () => {

                let completion_percent = 0;
                let increment = (
                    100 / steps.length
                );

                steps.forEach(function (step) {
                    step.completed && (
                        completion_percent += increment
                    );
                });

                return Math.floor(completion_percent);
            }
        )();

    const borderClass = "position-absolute border-start border-2 h-100 top-0";
    const borderStyle = {
        marginLeft: 7,
        transform: "translateY(-30px)"
    };

    if (subItem) {
        let active = selectedStep === id
            ? " fw-bold"
            : "";

        return isCompleted
            ? <div className={"py-3 ps-4 text-secondary position-relative"}>
                <div className="d-flex align-items-center">
                    <RadioButtonChecked/>
                    <div className={"ms-2 pointer user-select-none" + active}
                         onClick={() => setSelectedStep(id)}>{label}</div>
                </div>
                <div className={borderClass + " border-success"} style={borderStyle}></div>
            </div>
            : in_progress
                ? <div className={"py-3 ps-4 text-primary position-relative"}>
                    <div className="d-flex align-items-center">
                        <RadioButtonSelected/>
                        <div className={"ms-2 pointer user-select-none" + active}
                             onClick={() => setSelectedStep(id)}>{label}</div>
                    </div>
                    <div className={borderClass + " border-success"} style={borderStyle}></div>
                </div>
                : <div className={"py-3 ps-4 text-secondary position-relative"}>
                    <div className="d-flex align-items-center">
                        <RadioButtonLocked/>
                        <div className={"ms-2 pointer user-select-none" + active}
                             onClick={() => setSelectedStep(id)}>{label}</div>
                    </div>
                    <div className={borderClass} style={borderStyle}></div>
                </div>;
    }

    return <>
        {steps.length === 0
            ? <>
                <div className="accordion-item" data-no_children key={"workflow-view-list-item-" + id}>
                    <h2 className="accordion-header position-relative z-1">
                        <div className="accordion-button shadow-none pointer" onClick={function () {
                            return setSelectedStep(id);
                        }}>
                            <div className="me-3" style={{width: 24}}>
                                <CircularProgressbar strokeWidth="12" styles={{
                                    path: {
                                        stroke: "#1890FF",
                                        strokeLinecap: "butt",
                                        transition: "stroke-dashoffset 0.5s ease 0s"
                                    },
                                    trail: {
                                        stroke: "#D9D9D9"
                                    }
                                }} value={completion_percent}/>
                            </div>
                            {label}
                        </div>
                    </h2>
                </div>
                {!isLastItem && <div className="d-flex">
                    <div style={{width: 51}}></div>
                    <div className="border-start border-2" style={{
                        height: 20,
                        borderWidth: 2
                    }}></div>
                </div>}
            </>
            : <>
                <div className="accordion-item" key={"workflow-view-list-item-" + id}>
                    <h2 className={"accordion-header position-relative z-1"}>
                        <div className="accordion-button shadow-none pointer" data-bs-toggle="collapse"
                             data-bs-target={`#workflow-view-list-${id}`}>
                            <div className="me-3" style={{width: 24}}>
                                <CircularProgressbar strokeWidth="12" styles={{
                                    path: {
                                        stroke: "#1890FF",
                                        strokeLinecap: "butt",
                                        transition: "stroke-dashoffset 0.5s ease 0s"
                                    },
                                    trail: {
                                        stroke: "#D9D9D9"
                                    }
                                }} value={completion_percent}/>
                            </div>
                            {label}
                        </div>
                    </h2>
                    <div id={`workflow-view-list-${id}`}
                         className={"accordion-collapse collapse " + `${isStarted
                             ? "show"
                             : "text-secondary"}`}>
                        <div className="accordion-body position-relative py-0">
                            {steps.map(function (sub_item, index) {
                                const is_last_item = steps.length === index + 1;
                                return <WorkflowViewItem key={sub_item.id + "wvik"}
                                                         item={sub_item} subItem={true}
                                                         selectedStep={selectedStep}
                                                         setSelectedStep={(step) => setSelectedStep(step)}
                                                         isLastItem={is_last_item}/>;
                            })}
                        </div>
                    </div>
                </div>
                {!isLastItem && <div className="d-flex"
                                     style={{
                                         transform: "translateY(-25px)",
                                         marginBottom: -25
                                     }}>
                    <div style={{width: 51}}></div>
                    <div className="border-start border-2" style={{height: 45}}></div>
                </div>}
            </>}
    </>;


}