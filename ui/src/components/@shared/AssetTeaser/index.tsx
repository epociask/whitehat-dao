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
  asset: AssetExtended
  noPublisher?: boolean
  noDescription?: boolean
  noPrice?: boolean
}

export default function AssetTeaser({
  asset,
  noPublisher,
  noDescription,
  noPrice
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = asset.metadata
  const accessType = 'access'
  const { owner } = asset.nft

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${asset.id}`}>
        <a className={styles.link}>
          <aside className={styles.detailLine}>
            <AssetType
              className={styles.typeLabel}
              type={type}
              accessType={accessType}
            />
            <NetworkName
              networkId={asset.chainId}
              className={styles.typeLabel}
            />
          </aside>
          <header className={styles.header}>
            <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
              {name.slice(0, 200)}
            </Dotdotdot>
            {!noPublisher && <Publisher account={owner} minimal />}
          </header>
          {!noDescription && (
            <div className={styles.content}>
              <Dotdotdot tagName="p" clamp={3}>
                {removeMarkdown(description?.substring(0, 300) || '')}
              </Dotdotdot>
            </div>
          )}
          <footer className={styles.footer}>
            {asset.views && asset.views > 0 ? (
              <span className={styles.typeLabel}>
                {asset.views < 0 ? (
                  'N/A'
                ) : (
                  <>
                    <strong>{asset.views}</strong>{' '}
                    {asset.views === 1 ? 'view' : 'views'}
                  </>
                )}
              </span>
            ) : null}

            <span className={styles.typeLabel}>
              <Link href={`/publish/1?id=${asset.id}`}>
                        <a className={styles.teaser}>Submit Vuln</a>
              </Link>
                    </span>
            <span className={styles.typeLabel} />

          </footer>
        </a>
      </Link>
    </article>
  )
}
