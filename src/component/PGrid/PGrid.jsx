import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const PGrid = ({
    container,
    item,
    xs,
    sm,
    md,
    lg,
    xl,
    className = "",
    children,
    ...props
}) => {

    // If container → act as Bootstrap row
    if (container) {
        return (
            <div className={`row ${className}`} {...props}>
                {children}
            </div>
        );
    }

    // If item → act as Bootstrap column
    if (item) {
        let colClasses = "col-12";

        if (xs) colClasses += ` col-${xs}`;
        if (sm) colClasses += ` col-sm-${sm}`;
        if (md) colClasses += ` col-md-${md}`;
        if (lg) colClasses += ` col-lg-${lg}`;
        if (xl) colClasses += ` col-xl-${xl}`;

        return (
            <div className={`${colClasses} ${className}`} {...props}>
                {children}
            </div>
        );
    }

    // Default fallback
    return <div className={className}>{children}</div>;
};

export default PGrid;