import React from "react";

export default function Brand({
    ...props
}) {

    let height = 40;
    let width = 40;

    return <>
        <div className={props.className}>
            <div className="rounded-circle bg-primary p-2 text-white text-center" style={{
                height: height,
                width: width
            }}>
                <div style={{marginTop: 2}}>
                    <i className="fa-solid fa-j" style={{transform: "translateX(2px)"}}></i>
                    <i className="fa-solid fa-f" style={{transform: "translateY(-3px)"}}></i>
                </div>
            </div>
        </div>
    </>;

}