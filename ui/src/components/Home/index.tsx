import React, {ReactElement, useEffect, useState} from 'react'
import {generateBaseQuery} from '@utils/aquarius'
import {useUserPreferences} from '@context/UserPreferences'
import {SortTermOptions} from '../../@types/aquarius/SearchQuery'
import styles from './index.module.css'
import {useWeb3} from '@context/Web3'
import AssetTeaser from "@shared/AssetTeaser";
import {AbiItem} from "web3-utils/types";
import {array} from "yup";
import Loader from "@shared/atoms/Loader";
import {de} from "date-fns/locale";
import AuditorDaoTeaser from '@shared/AuditorDaoTeaser'
import { auditorDAOAddresses, auditorDaoAbi } from '../../../app.config'


export default function HomePage(): ReactElement {
    const {chainIds} = useUserPreferences()

    const [queryLatest, setQueryLatest] = useState<SearchQuery>()
    const [queryMostSales, setQueryMostSales] = useState<SearchQuery>()
    const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>()
    const {accountId, web3, web3Loading} = useWeb3()
    const [activeBounties, setActiveBounties] = useState([]);
    const [loadingAuditorInfo, setLoadingAuditorInfo] = useState(true);
    const [auditorInfo, setAuditorInfo] = useState([]);

    useEffect(() => {
        const baseParams = {
            chainIds,
            esPaginationOptions: {
                size: 6
            },
            sortOptions: {
                sortBy: SortTermOptions.Created
            } as SortOptions
        } as BaseQueryParams
        setQueryLatest(generateBaseQuery(baseParams))

        const baseParamsSales = {
            chainIds,
            esPaginationOptions: {
                size: 6
            },
            sortOptions: {
                sortBy: SortTermOptions.Orders
            } as SortOptions
        } as BaseQueryParams
        setQueryMostSales(generateBaseQuery(baseParamsSales))
        const baseParamsAllocation = {
            chainIds,
            esPaginationOptions: {
                size: 6
            },
            sortOptions: {
                sortBy: SortTermOptions.Allocated
            } as SortOptions
        } as BaseQueryParams
        setQueryMostAllocation(generateBaseQuery(baseParamsAllocation))


        setActiveBounties([{
            "id": "did:op:284c6ab84b78aeec77b5a348b3e476f065109cc29ada8b2642ca81970e4b038d",
            "chainId": 137,
            "metadata": {
                "additionalInformation": {
                    "termsAndConditions": true
                },
                "author": "Poupou",
                "created": "2023-01-22T17:25:43Z",
                "description": "This file contains the transactions of all the contributors to Gitcoin GR15, Fantom and Unicef Round as well as some alpha round contributions",
                "license": "https://market.oceanprotocol.com/terms",
                "links": [
                    "https://huggingface.co/datasets/Poupou/Gitcoin-Grant-DataBuilder/blob/main/transactions.zip"
                ],
                "name": "Gitcoin Grant Contributor transactions",
                "tags": [
                    "sybils",
                    "gitcoin",
                    "grant-contributor-transactions"
                ],
                "type": "dataset",
                "updated": "2023-01-22T17:25:43Z"
            },
            "nft": {
                "owner": "0x85c1bBDC1B6A199e0964cb849deb59aEF3045eDd",
            },
        }])

        if (!web3Loading){
            fetchAuditorDaoData(auditorDAOAddresses, auditorDaoAbi);
        }

    }, [chainIds, web3Loading])
    async function fetchAuditorDaoData(auditorDAOAddresses: string[], AuditorDaoABI: AbiItem[]){
        let tempHolder = []
        await new Promise(r => setTimeout(r, 2000));
        for (const index in auditorDAOAddresses) {
            const contract = new web3.eth.Contract(AuditorDaoABI, auditorDAOAddresses[index], {
                from: accountId
            });
            const titleDao = await contract.methods.title().call();
            const descriptionDao = await contract.methods.description().call();
            const membersCount = await contract.methods.numberOfMembers().call();

            tempHolder.push({
                title: titleDao,
                description: descriptionDao,
                membersCount: membersCount,
                address: auditorDAOAddresses[index],
                id: index
            })
            setLoadingAuditorInfo(false);
        }

        setAuditorInfo(tempHolder)
    }


    return (
        <>
            <section className={styles.section}>
                <h2>Active Bug Bounties</h2>
                {activeBounties.map((assetWithPrice) => (
                    <AssetTeaser
                        asset={assetWithPrice}
                        key={assetWithPrice.id}
                        noPublisher={true}
                        noDescription={false}
                        noPrice={true}
                    />
                ))}
            </section>

            <section className={styles.section}>
                <h2>Auditor DAOs</h2>
                {web3Loading || loadingAuditorInfo ? <div className={styles.loaderWrap}>
                    <Loader />
                </div> : auditorInfo.map((eachAuditorDao) => (
                    <AuditorDaoTeaser
                        title={eachAuditorDao.title}
                        id={eachAuditorDao.id}
                        description={eachAuditorDao.description}
                        views={eachAuditorDao.membersCount}
                        auditorDAOAddresses={eachAuditorDao.address}
                    />
                ))}
            </section>

        </>
    )
}
