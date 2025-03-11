import React from "react";
// import MobileLayout from './MobileLayout';
import Media from "react-media";
import DesktopLayout from "./DesktopLayout";

export default function LayoutRouter({children, ...props}) {

    return (
        <>
            {/*<Media query="(max-width: 799px)" render={() =>*/}
            {/*    (*/}
            {/*        <MobileLayout screen="mobile" {...props}>{children}</MobileLayout>*/}
            {/*    )}*/}
            {/*/>*/}
            <Media query="(min-width: 800px)"
                   render={() => <DesktopLayout screen="desktop" {...props}>{children}</DesktopLayout>}
            />
        </>
    );
}