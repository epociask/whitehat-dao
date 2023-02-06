import React, {ReactElement, useEffect, useState} from 'react'
import {generateBaseQuery} from '@utils/aquarius'
import {useUserPreferences} from '@context/UserPreferences'
import {SortTermOptions} from '../../@types/aquarius/SearchQuery'
import styles from './index.module.css'
import {useWeb3} from '@context/Web3'
import AssetTeaser from "@shared/AssetTeaser";
import Loader from "@shared/atoms/Loader";
import CompanyTeaser from '@shared/CompanyTeaser'
import AuditorDaoTeaser from '@shared/AuditorDaoTeaser'

import {auditorDAOAddresses, bountyFactoryAddress, companyFactoryDaoAddress} from "../../../app.config";
import { auditorDaoABI, bountyABI, companyDaoABI, companyFactoryDaoABI} from '@utils/abi';


export default function HomePage(): ReactElement {

    const {chainIds} = useUserPreferences();

    const [queryLatest, setQueryLatest] = useState<SearchQuery>();
    const [queryMostSales, setQueryMostSales] = useState<SearchQuery>();
    const [queryMostAllocation, setQueryMostAllocation] = useState<SearchQuery>();
    const {accountId, web3, web3Loading} = useWeb3();

    const [activeBounties, setActiveBounties] = useState([]);
    const [activeCompanies, setActiveCompanies] = useState([]);
    const [loadingAuditorInfo, setLoadingAuditorInfo] = useState(true);
    const [auditorInfo, setAuditorInfo] = useState([]);
    const [loadingCompanyData, setLoadingCompanyData] = useState(true);


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

        if (!web3Loading){
            fetchAuditorDaoData(auditorDAOAddresses);
            loadCompanyData();
        }
    }, [chainIds, web3Loading]);

    async function loadCompanyData(){

        let _activeCompanies = [];
        let _activeBounties = [];
        
        let i=0;

        console.log("Loading company data");
        let companyFactoryContract = new web3.eth.Contract(companyFactoryDaoABI, companyFactoryDaoAddress, {
            from: accountId
        });
        let companyDaoAddresses = await companyFactoryContract.methods.getCompanyDaos().call();
        
        console.log("Company DAO Addresses", companyDaoAddresses);
        console.log(companyDaoAddresses.length);

        for (const address in companyDaoAddresses){
                let companyContract = new web3.eth.Contract(companyDaoABI, companyDaoAddresses[address], {
                    from: accountId
                });
                let title = await companyContract.methods.title().call();
                let description = await companyContract.methods.description().call();
                let addressOfCompany = await companyContract.methods.addressOfCompany().call();
                let _activeBounties_ = await companyContract.methods.getBounties().call();


                _activeCompanies.push({
                    id: address,
                    title: title,
                    description: description,
                    addressOfCompany: addressOfCompany
                });

                if (_activeBounties_.length > 0){
                    for (const bounty in _activeBounties_){

                        let bountyContract = new web3.eth.Contract(await bountyABI, _activeBounties_[bounty], {
                            from: accountId
                        });

                        _activeBounties.push({
                            companyTitle: title,
                            title: await bountyContract.methods.title().call(),
                            description: await bountyContract.methods.description().call(),
                            address: _activeBounties_[bounty],
                        });

                    }
                }
                i+=1;
        }

        console.log("Setting active companies and bounties");
        setActiveCompanies(_activeCompanies);
        setActiveBounties(_activeBounties);
        setLoadingCompanyData(false);
    }
    async function fetchAuditorDaoData(auditorDAOAddresses: string[]){
        let tempHolder = []
        await new Promise(r => setTimeout(r, 2000));
        for (const index in auditorDAOAddresses) {
            const contract = new web3.eth.Contract(await auditorDaoABI, auditorDAOAddresses[index], {
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
        setAuditorInfo(tempHolder);
    }

    return (
        <>
            <section className={styles.section}>
                <h2>Companies with Active Bounties</h2>
                {web3Loading || loadingAuditorInfo ? <div className={styles.loaderWrap}>
                    <Loader />
                </div> : activeCompanies.map((eachAuditorDao) => (
                    <CompanyTeaser
                        title={eachAuditorDao.title}
                        id={eachAuditorDao.id}
                        description={eachAuditorDao.description}
                        addressOfCompany={eachAuditorDao.addressOfCompany}
                    />
                ))}
            </section>

            <section className={styles.section}>
                <h2>Active Bug Bounties</h2>
                {web3Loading || loadingCompanyData ? <div className={styles.loaderWrap}>
                    <Loader />
                </div> : activeBounties.map((bounty) => (
                    <AssetTeaser
                        name={bounty.title}
                        bountyTitle={bounty.title}
                        description={bounty.description}
                        bountyOwner={bounty.bountyHost}
                        bountyAddress={bounty.address}
                        id={0}
                        chainId={80001}
                        type={"access"}
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
