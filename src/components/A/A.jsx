import React from "react";

/**
 * Creates an anchor tag that opens in a new tab.
 * @param {Object} props
 * @param {string} props.href - the url to open
 * @param {string} props.classes - CSS classes list, space delimited
 * @param {string} props.text - Optional display text. If not included, it will show the href
 * @returns {JSX.Element} - An anchor tag
 */
export default function A(props) {
    return <a href={props.href} target="_blank" className={"link-primary " + props.classes}>{props.text || props.href}</a>
}