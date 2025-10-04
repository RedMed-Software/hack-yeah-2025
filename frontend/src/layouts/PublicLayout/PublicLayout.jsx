import { Outlet } from 'react-router-dom'
import styles from './PublicLayout.module.scss'

export default function PublicLayout() {
    return (
        <div className={styles.wrapper}>
            <Outlet />
        </div>
    )
}