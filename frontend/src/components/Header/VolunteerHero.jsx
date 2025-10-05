import React from 'react'
import styles from './VolunteerHero.module.scss'

function isUnderage(volunteer) {
    return volunteer?.age < 18
}

function getInitials(volunteer) {
    if (volunteer?.firstName && volunteer?.lastName) {
        return `${volunteer.firstName[0]}${volunteer.lastName[0]}`
    }
    return '??'
}

export default function VolunteerHero({ currentUser }) {
    const volunteer = currentUser?.volunteer

    return (
        <header className={styles.hero}>
            <div className={styles.identity}>
                <div className={styles.avatar} aria-hidden="true">
                    {getInitials(volunteer)}
                </div>
                <div className={styles.identityDetails}>
                    <span className={styles.role}>Wolontariusz</span>
                    <h1>
                        {volunteer?.firstName ?? ''} {volunteer?.lastName ?? ''}
                    </h1>
                    <p>{volunteer?.description}</p>
                </div>
                {isUnderage(volunteer) && (
                    <p className={styles.notAdult}>
                        <span className={styles.notAdult}>Niepełnoletni</span>
                    </p>
                )}
            </div>
        </header>
    )
}