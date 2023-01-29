import React, {ChangeEvent, ReactElement, useState} from 'react'
import Link from 'next/link'
import loadable from '@loadable/component'
import Logo from '@shared/atoms/Logo'
import UserPreferences from './UserPreferences'
import styles from './Menu.module.css'
import {useRouter} from 'next/router'
import {useMarketMetadata} from '@context/MarketMetadata'
import Button from "@shared/atoms/Button";
import Modal from "@shared/atoms/Modal";
import Input from "@shared/FormInput";
import Loader from "@shared/atoms/Loader";
import {useWeb3} from "@context/Web3";
import {AbiItem} from "web3-utils/types";
import {companyFactoryDao, companyFactoryDaoAbi, bountyFactory, bountyFactoryAbi} from "../../../app.config";
import Alert from "@shared/atoms/Alert";

const Wallet = loadable(() => import('./Wallet'))

declare type MenuItem = {
    name: string
    link: string
}

const erc721 = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as AbiItem[]

function MenuLink({item}: { item: MenuItem }) {
    const router = useRouter()

    const classes =
        router?.pathname === item.link
            ? `${styles.link} ${styles.active}`
            : styles.link

    return (
        <Link key={item.name} href={item.link}>
            <a className={classes}>{item.name}</a>
        </Link>
    )
}


export default function Menu(): ReactElement {
    const {siteContent} = useMarketMetadata()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDialogLoaded, setIsDialogLoaded] = useState(false)
    const [companyDaoAddresses, setCompanyDaoAddresses] = useState([])
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [isSignupOpenLoading, setIsSignupOpenLoading] = useState(true)
    const [bugBountyTitle, setBugBountyTitle] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [bugBountyDescription, setBugBountyDescription] = useState("")
    const [isAlert, setIsAlert] = useState({})
    const { accountId, web3 } = useWeb3()


    async function holdsToken(contractAddress: string) {
        const currentWallet = web3.utils.toChecksumAddress(accountId)
        const contract = new web3.eth.Contract(erc721, contractAddress, {
            from: accountId
        })

        const result = await contract.methods.balanceOf(currentWallet).call()
        return parseInt(result) && parseInt(result) > 0
    }

    async function submitDetails(e) {
        e.preventDefault();
        setIsDialogLoaded(false);
        const contract = new web3.eth.Contract(bountyFactoryAbi, bountyFactory, {
            from: accountId
        });

        try{
            const resCreate = await contract.methods.addNewBounty(selectedCompany, selectedCompany, Math.floor(Date.now()),
                "testtttttttesttttttttesttttttt", 1223, bugBountyTitle, bugBountyDescription).send({from: accountId});

            console.log(resCreate);
            setIsAlert({
                text: "Bug Bounty Created",
                type: "success"
            });
        }
        catch (e) {
            console.log(e);
            setIsAlert({
                text: "Couldn't create BugBounty",
                type: "error"
            });
        }
        setIsDialogLoaded(true);
    }

    async function getContractAddress(){
        setIsDialogOpen(true);
        let companyFactoryContract = new web3.eth.Contract(companyFactoryDaoAbi, companyFactoryDao, {
            from: accountId
        });

        let companyDaoAddresses_ = await companyFactoryContract.methods.getCompanyDaos().call();
        setCompanyDaoAddresses(companyDaoAddresses_.concat(["select"]));
        setIsDialogLoaded(true);

    }

    return (
        <nav className={styles.menu}>
            <Link href="/">
                <a className={styles.logo}>
                    <Logo noWordmark/>
                    <h1 className={styles.title}>{siteContent?.siteTitle}</h1>
                </a>
            </Link>

            <ul className={styles.navigation}>
                {siteContent?.menu.map((item: MenuItem) => (
                    <li key={item.name}>
                        <MenuLink item={item}/>
                    </li>
                ))}

                <li key="123">
                    <a className={styles.link} onClick={() => getContractAddress()}>
                        Create Bug Bounty
                    </a>
                    <Modal
                        title={"New Bug Bounty"}
                        isOpen={isDialogOpen}
                        onToggleModal={() => setIsDialogOpen(false)}
                    >
                        <div className={styles.meta}>

                            {isAlert.text ? <Alert text={isAlert.text} state={isAlert.type} /> : ""}
                            <br/><br/>
                            {!isDialogLoaded ? <Loader /> : <form>
                                    <Input
                                        name="company"
                                        label="CompanyDao"
                                        help="The Company DAO you want to create the bounty under"
                                        type="select"
                                        value={selectedCompany}
                                        options={companyDaoAddresses}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            setSelectedCompany(e.target.value)
                                        }
                                        size="small"
                                    />

                                    <Input
                                        name="title"
                                        label="Bug Bounty program"
                                        help="The title of the Bug Bounty Program"
                                        type="text"
                                        value={bugBountyTitle}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            setBugBountyTitle(e.target.value)
                                        }
                                        size="small"
                                    />
                                    <Input
                                        name="description"
                                        label="Bug Bounty program description"
                                        help="The Description of the Bug Bounty Program"
                                        type="textarea"
                                        value={bugBountyDescription}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            setBugBountyDescription(e.target.value)
                                        }
                                        size="small"
                                    />

                                    <Button style="text" size="small" onClick={(e) => submitDetails(e)}>
                                        Submit New Program
                                    </Button>
                                </form>
                            }
                        </div>
                    </Modal>
                </li>
                <li key="124">
                    <a className={styles.link} onClick={() => setIsSignupOpen(true)}>
                        Signup!
                    </a>
                    <Modal
                        title={"Signup For Submission"}
                        isOpen={isSignupOpen}
                        onToggleModal={() => setIsSignupOpen(false)}
                    >
                        <div className={styles.meta}>
                            {isSignupOpenLoading ? <div className={styles.loaderWrap}>
                                <Loader />
                            </div> : <form>
                                <Input
                                    name="title"
                                    label="Bug Bounty program"
                                    help="The title of the Bug Bounty Program"
                                    type="text"
                                    value={bugBountyTitle}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setBugBountyTitle(e.target.value)
                                    }
                                    size="small"
                                />
                                <Input
                                    name="description"
                                    label="Bug Bounty program description"
                                    help="The Description of the Bug Bounty Program"
                                    type="textarea"
                                    value={bugBountyDescription}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setBugBountyDescription(e.target.value)
                                    }
                                    size="small"
                                />

                                <Button style="text" size="small" onClick={() => submitDetails()}>
                                    Submit New Program
                                </Button>
                            </form>}

                        </div>
                    </Modal>
                </li>
            </ul>

            <div className={styles.actions}>
                {/*<SearchBar />*/}
                {/*<Networks />*/}
                <Wallet/>
                <UserPreferences/>
            </div>
        </nav>
    )
}
