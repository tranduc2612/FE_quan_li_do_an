import style from "./loading.module.scss"

function LoadingData() {
    return (
        <div className={style.spinner}>
            <svg viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20" fill="none" className={style.path}></circle>
            </svg>
        </div>
        );
}

export default LoadingData;