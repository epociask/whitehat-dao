import React, {ChangeEvent, ReactElement, useState} from 'react'
import Dotdotdot from 'react-dotdotdot'
import removeMarkdown from 'remove-markdown'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './index.module.css'
import {useWeb3} from "@context/Web3";
import {auditorDaoAbi} from '../../../../app.config'
import {LoggerInstance} from "@oceanprotocol/lib";
import Alert from "@shared/atoms/Alert";

export declare type AssetTeaserProps = {
    title: string,
    description: string,
    addressOfCompany: string,
    id: number,
}

export default function AssetTeaser({title, id, description, addressOfCompany}: AssetTeaserProps): ReactElement {
    const accessType = 'access'
    const [isAuditDaoOpen, setIsAuditDaoOpen] = useState(false);
    const {accountId, web3, web3Loading} = useWeb3()
    const [modalAlert, setModalAlert] = useState({});

    return (
        <article className={`${styles.teaser} ${styles['dataset']}`}>
            <a className={styles.link}>
                {/*<aside className={styles.detailLine}>*/}
                {/*    <AssetType*/}
                {/*        className={styles.typeLabel}*/}
                {/*        type={'dataset'}*/}
                {/*        accessType={accessType}*/}
                {/*    />*/}
                {/*    <NetworkName*/}
                {/*        networkId={80001}*/}
                {/*        className={styles.typeLabel}*/}
                {/*    />*/}
                {/*</aside>*/}
                <header className={styles.header}>
                    <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
                        {title.slice(0, 200)}
                    </Dotdotdot>
                </header>
                {<div className={styles.content}>
                    <Dotdotdot tagName="p" clamp={3}>
                        {removeMarkdown(description?.substring(0, 300) || '')}
                    </Dotdotdot>
                </div>}
            </a>
            {/*</Link>*/}
        </article>
    )
}
