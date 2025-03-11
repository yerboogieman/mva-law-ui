import {Link, useNavigate} from "react-router-dom";
import LayoutRouter from "../../components/layouts/LayoutRouter";

export default function NotAuthorized() {

    return (
        <LayoutRouter>
            <div className="d-flex h-100 w-100">
                <div className="ms-5 mt-5">
                    <h3 className="mb-4">
                        <i className="fa-duotone fa-shield-keyhole me-2 danger-icon"></i>
                        Sorry, unable to view this page.
                    </h3>
                    <Link to="/login" className="btn btn-warning">Back</Link>
                </div>
            </div>
        </LayoutRouter>
    );
}