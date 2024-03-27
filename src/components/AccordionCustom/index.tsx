import { ReactElement, useState } from "react"
import { ChevronDown } from 'mdi-material-ui'
import classNames from "classnames/bind";
import styles from "./AccordionCustom.module.scss"
type IProps = {
    header: any,
    children: ReactElement,
    inititalToggle?: boolean,
    size: "xl" | "xxl" | "xxxl"
}

const cx = classNames.bind(styles);

function AccordionCustom({ header, children,size,inititalToggle = false }: IProps) {
    const [active, setActive] = useState(inititalToggle);

    const handleToggleContent = () => {
        setActive(!active)
    }

    return (<div className="relative shadow-md-light rounded-md">
            <div className="absolute rounded-xl top-0 p-4 overlay w-full h-full  bg-[#fff] z-0 opacity-90" />

        <div className="relative accordion_header flex items-center justify-between rounded-md cursor-pointer ps-5 px-4 py-3 z-50" onClick={handleToggleContent}>
            <span className="text-primary-blue font-bold text-xl">{header}</span>

            <div className={cx("accordion_icon", "inline-block", {
                active
            })}>
                <ChevronDown style={
                    {
                        fontSize: "2rem",
                    }
                } />
            </div>
        </div>
        <div className={cx(`accordion_body`, `overflow-y-scroll text-xl font-medium relative`, {
            [size]: active,
        })}>
            {children}
        </div>
    </div >);
}

export default AccordionCustom;