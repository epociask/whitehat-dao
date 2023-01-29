import React, { ReactElement } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './index.module.css'
import { getServiceByName } from '@utils/ddo'
import { useUserPreferences } from '@context/UserPreferences'
import { formatNumber } from '@utils/numbers'

export declare type AssetTeaserProps = {
  name: string,
  type: string,
  description: string,
  owner: string,
  bountyAddress: string,
  companyTitle: string,
  chainId: number,
  id: number,
}

export default function AssetTeaser({id, chainId, name, type, description, owner, bountyAddress, companyTitle}: AssetTeaserProps): ReactElement {

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      {/*<Link href={`/asset/${id}`}>*/}
        <a className={styles.link}>
          <aside className={styles.detailLine}>
            <NetworkName
              networkId={chainId}
              className={styles.typeLabel}
            />
            <div className={styles.typeLabel}>
              {companyTitle}
            </div>
          </aside>
          <header className={styles.header}>
            <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
              {name.slice(0, 200)}
            </Dotdotdot>
          </header>
          <footer className={styles.footer}>
            <span className={styles.typeLabel}>
              <Link href={`/publish/1?address=${bountyAddress}`}>
                <a className={styles.teaser}>Submit Vuln</a>
              </Link>
            </span>
            <span className={styles.typeLabel} />
          </footer>
        </a>
      {/*</Link>*/}
    </article>
  )
}
