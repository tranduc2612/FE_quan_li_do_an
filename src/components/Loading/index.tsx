import style from "./loading.module.scss"

function Loading() {
    return (<div className={style.wrapper}>
        <div className={style.spinner}>
            <svg viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20" fill="none" className={style.path}></circle>
            </svg>
        </div>
    </div>);
}

export default Loading;