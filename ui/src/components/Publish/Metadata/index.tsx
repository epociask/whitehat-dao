import {BoxSelectionOption} from '@shared/FormInput/InputElement/BoxSelection'
import Input from '@shared/FormInput'
import {Field, FormikContextType, useField, useFormikContext} from 'formik'
import React, {FormEvent, ReactElement, useEffect, useState} from 'react'
import content from '../../../../content/publish/form.json'
import {getFieldContent} from '@utils/form'
import Loader from "@shared/atoms/Loader";
import Button from "@shared/atoms/Button";
import lighthouse from "@lighthouse-web3/sdk";
import {companyDaoAbi, bountyAbi, bountyAddress} from "../../../../app.config";
import {useWeb3} from "@context/Web3";
import {ethers} from "ethers";
import {sleep} from "@utils/index";
import {FormPublishData} from "../_types";

export default function MetadataFields(): ReactElement {
    const {accountId, web3, web3Loading, web3Provider} = useWeb3()

    const [isSubmitting, setIsSubmitting] = useState<boolean>()
    const {values}: FormikContextType<FormPublishData> = useFormikContext()

    async function handleSubmit(e: FormEvent){
        e.preventDefault()
        setIsSubmitting(true);
    }

    const signAuthMessage = async() =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const publicKey = (await signer.getAddress()).toLowerCase();
        const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message;
        const signedMessage = await signer.signMessage(
            messageRequested
        );
        return({publicKey: publicKey, signedMessage: signedMessage});
    }

    const deploy = async(e) =>{

        await sleep(2000);

        let contract = new web3.eth.Contract(companyDaoAbi, "0x540627043EDaD520DbACE3FaF982ec553097275E", {
            from: accountId
        });

        const result = await contract.methods.addressOfCompany().call();
        const {publicKey: publicKey1, signedMessage: signedMessage1} = await signAuthMessage();

        // // Push file to lighthouse node
        const output = await lighthouse.uploadEncrypted(e, publicKey1,"372a16df-8fce-4b74-9a08-74689c2a50b0", signedMessage1);
        console.log("Company A", result);

        const {publicKey, signedMessage} = await signAuthMessage();
        const publicKeyUserB = [result];
        const res = await lighthouse.shareFile(
            publicKey,
            publicKeyUserB,
            output.data.Hash,
            signedMessage
        );

        contract = new web3.eth.Contract(bountyAbi, bountyAddress[0], {
            from: accountId
        });

        let submitRes = await contract.methods.submitVulnerability(accountId, output.data.Hash, 123).send();
        console.log(submitRes, values)
    }

    return (
        <>
            <div className="FormInput_field__crPEL"><label className="Label_label__AiTEy">Please select the PDF with Vuln Report
            </label><input type="file" onChange={e=>deploy(e)} className="InputElement_input__5roKb"/>
            </div>

            <br/>

            <Button
                style="primary"
                disabled={isSubmitting}
                onClick={(e)=>{handleSubmit(e)}}
            >
                {isSubmitting ? (
                    <Loader white />
                ) : 'Submit'}
            </Button>
        </>
    )
}
