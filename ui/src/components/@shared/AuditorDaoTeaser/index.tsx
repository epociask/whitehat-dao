import React, {ChangeEvent, ReactElement, useState} from 'react'
import Dotdotdot from 'react-dotdotdot'
import removeMarkdown from 'remove-markdown'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './index.module.css'
import Loader from "@shared/atoms/Loader";
import Input from "@shared/FormInput";
import Button from "@shared/atoms/Button";
import Modal from "@shared/atoms/Modal";
import {useWeb3} from "@context/Web3";
import {auditorDaoAbi} from '../../../../app.config'
import {LoggerInstance} from "@oceanprotocol/lib";
import Alert from "@shared/atoms/Alert";

export declare type AssetTeaserProps = {
    asset: AssetExtended
    noPublisher?: boolean
    noDescription?: boolean
    noPrice?: boolean
}

export default function AssetTeaser({title, id, description, views, auditorDAOAddresses}): ReactElement {
    const accessType = 'access'
    const [isAuditDaoOpen, setIsAuditDaoOpen] = useState(false);
    const [addMember, setAddMember] = useState("");
    const [deleteMember, setDeleteMember] = useState("");
    const {accountId, web3, web3Loading} = useWeb3()
    const [modalAlert, setModalAlert] = useState({});

    async function submitDetails(e) {
        e.preventDefault();

        const contract = new web3.eth.Contract(auditorDaoAbi, auditorDAOAddresses, {
            from: accountId
        });

        if (addMember) {
            try {
                const result = await contract.methods.addMemberOfDao(addMember).send({from: accountId});
                setModalAlert({text: "Added member successfully", type: "success"})
            } catch (e) {
                LoggerInstance.error(`ERROR: Failed to add member: ${e.message}`)
                setModalAlert({text: "Couldn't add member, check logs for details.", type: "error"})

            }

        }

        if (deleteMember) {

            try {
                const result = await contract.methods.removeMemberOfDao(deleteMember).send({from: accountId});
                setModalAlert({text: "Removed member successfully", type: "success"})
            } catch (e) {
                LoggerInstance.error(`ERROR: Failed to remove member: ${e.message}`)
                setModalAlert({text: "Couldn't delete member, check logs for details.", type: "error"})
            }
        }
    }

    function closeModal() {
        setModalAlert({});
        setDeleteMember("");
        setAddMember("");
    }

    return (
        <article className={`${styles.teaser} ${styles['dataset']}`}>
            {/*<Link href={`/asset/${id}`}>*/}
            <a className={styles.link}>
                <aside className={styles.detailLine}>
                    <AssetType
                        className={styles.typeLabel}
                        type={'dataset'}
                        accessType={accessType}
                    />
                    <NetworkName
                        networkId={80001}
                        className={styles.typeLabel}
                    />
                </aside>
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
                <footer className={styles.footer}>
                    {views && views > 0 ? (
                        <span className={styles.typeLabel}>
                {views < 0 ? (
                    'N/A'
                ) : (
                    <>
                        <strong>{views}</strong>{' '}
                        {views === 1 ? 'member' : 'members'}
                    </>
                )}
              </span>
                    ) : null}

                    <span className={styles.typeLabel}>
                        <a href="#" onClick={() => setIsAuditDaoOpen(true)}>Manage</a>
                    </span>
                    <span className={styles.typeLabel} />
                </footer>
                <Modal
                    title={"Manage Members of DAO"}
                    isOpen={isAuditDaoOpen}
                    onToggleModal={() => setIsAuditDaoOpen(false)}
                    onAfterClose={() => closeModal()}
                >
                    <div className={styles.meta}>
                        {web3Loading ? <div className={styles.loaderWrap}>
                            <Loader/>
                        </div> : <form>
                            {modalAlert.text ? <Alert text={modalAlert.text} state={modalAlert.type}/> : ""} <br/>
                            <Input
                                name="addMember"
                                label="New Member Address"
                                help="The public address of the new member"
                                type="text"
                                value={addMember}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setAddMember(e.target.value)
                                }
                                size="small"
                            />

                            <Input
                                name="deleteMember"
                                label="Delete Member From Dao"
                                help="The public address of the member"
                                type="text"
                                value={deleteMember}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setDeleteMember(e.target.value)
                                }
                                size="small"
                            />

                            <Button style="text" size="small" onClick={(e) => submitDetails(e)}>
                                Submit
                            </Button>
                        </form>}

                    </div>
                </Modal>
            </a>
            {/*</Link>*/}
        </article>
    )
}
