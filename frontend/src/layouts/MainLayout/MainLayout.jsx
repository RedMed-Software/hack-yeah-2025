import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header.jsx'
import styles from './MainLayout.module.scss'

export default function MainLayout() {
    return (
        <div className={styles.app}>
            <Header />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    )
}