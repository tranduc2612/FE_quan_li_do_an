import { ReactElement, useState } from "react"
import { ChevronDown } from 'mdi-material-ui'
import classNames from "classnames/bind";
import styles from "./AccordionCustom.module.scss"
type IProps = {
    header: string,
    children: ReactElement
}

const cx = classNames.bind(styles);

function AccordionCustom({ header, children }: IProps) {
    const [active, setActive] = useState(false);

    const handleToggleContent = () => {
        setActive(!active)
    }

    return (<div className="shadow-md-light rounded-md">
        <div className="accordion_header flex items-center justify-between rounded-md cursor-pointer ps-5 px-4 py-3 z-50" onClick={handleToggleContent}>
            <span className="text-[#333] font-bold text-2xl">{header}</span>

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
        <div className={cx(`accordion_body`, `overflow-hidden text-xl font-medium`, {
            active: active
        })}>
            {children}
        </div>
    </div >);
}

export default AccordionCustom;