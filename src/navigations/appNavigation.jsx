// utils/navigation.js
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function AppNavigation(Component) {
  return function Wrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
}

