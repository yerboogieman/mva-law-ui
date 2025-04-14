export default function WorkflowTask(props) {

    /**
     * {function} onClick
     */
    const {
        active,
        description,
        id,
        name,
        onClick
    } = props;

    const className = "nav-item py-2 px-3 border-bottom border-primary-subtle" +
        (active ? " text-bg-primary" : " pointer");

    return <li onClick={function () {
        if (typeof onClick === "function") {
            onClick(id);
        }
    }}
               className={className}
               key={"workflow-list-item-" + id}>
        {/* <div className="text-">{id}</div> */}
        <strong>{name}</strong>
        <div>{description}</div>
    </li>;
}