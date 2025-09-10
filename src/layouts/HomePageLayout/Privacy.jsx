import React from 'react'
import { MdClose } from 'react-icons/md'

const Privacy = ({ handleClose }) => {
    return (
        <div className='bg-[#fff] w-[600px] h-[500px] flex flex-col gap-4 overflow-y-scroll  mt-[100px] rounded-lg p-4'>
            <div className='flex items-center justify-between'>
                <p className='font-medium font-jost  text-[24px] text-[#000]'>Privacy Policy for ArabyProphet</p>
                <button className="flex justify-center items-center" onClick={handleClose}>
                    <MdClose className='w-5 h-5 ' />
                </button>
            </div>
            <div className='mt-[15px]'>
                <p className='font-jost text-[#000] text-base'>
                    September 10, 2025
                    <span className='block'>
                        1. Introduction
                        Arabyprophet (“we,” “us,” or “our”) is committed to protecting your privacy and complying 
                        with the Nigeria Data Protection Act 2023 (NDPA). This Privacy Policy explains how we collect, 
                        process, store, and share your personal data when you visit our website, arabyprophet.com, 
                        and use our services. By using our services, you agree to the collection and use of 
                        information in accordance with this policy.
                    </span>
                    <span className='block'>
                        2. Data Controller & Contact Information
                        We are the data controller for the purposes of the NDPA. If you have any questions about this Privacy Policy or wish to exercise your rights under the NDPA, please contact our Data Protection Officer (DPO):
                        • Entity: ArabyProphet
                        • Email Address: privacy@arabyprophet.com
                        • Mailing Address: 2 Eso Cl, off Oduduwa Crescent, Ikeja GRA, Ikeja 100001, Lagos
                        • Phone ​Number: +234 904 017 7777
                    </span>
                    <span className='block'>
                        3. Personal Data We Collect
                        We collect information that is necessary to provide and improve our services. This data includes:
                        • Directly Provided Data: When you create an account or interact with us, you may provide your name, email address, phone number, job function, organization, and login credentials.
                        • Automatically Collected Data: When you use our platform, we automatically collect technical information such as your device identifiers, IP address, browser type and version, operating system, and usage patterns (e.g., pages visited, time spent). We collect some of this data using cookies (see our Cookie Policy).
                        • Optional Data: You may choose to provide additional information through feedback forms, survey responses, or customer support interactions.
                    </span>
                    <span className='block'>
                        4. Purpose and Legal Basis for Processing
                        We process your personal data based on lawful grounds as defined by the NDPA:
                        • To Provide Our Services: We process your data to create and manage your account, deliver services, and process transactions. The lawful basis for this is contractual necessity or your consent.
                        • To Improve Our Platform: We analyze usage data to understand user needs, troubleshoot issues, and enhance the functionality of our services. The lawful basis is our legitimate interest in improving our business.
                        • For Communication: We may use your contact information to send you service updates, newsletters, or marketing materials (where you have consented). The lawful basis is consent or legitimate interest.
                        • For Legal and Security Purposes: We process data to comply with legal requirements, prevent fraud, and protect the security of our platform and users. The lawful basis is compliance with a legal obligation.
                    </span>
                    <span className='block'>
                        5. Data Minimization and Retention
                        We are committed to data minimization. 
                        We only collect personal data that is strictly necessary for the purposes outlined above. 
                        We retain your personal data only for as long as needed to fulfill these purposes. 
                        After your account is deactivated, your personal data will be retained for a period 
                        of [e.g., 1 year] for legal or administrative purposes, unless a longer retention 
                        period is required or permitted by law.
                    </span>
                    <span className='block'>
                        6. Data Subject Rights
                        Under the NDPA, you have the right to:
                        • Access: Request a copy of the personal data we hold about you.
                        • Rectification: Request the correction of inaccurate or incomplete data.
                        • Erasure: Request the deletion of your personal data, subject to certain conditions.
                        • Withdraw Consent: Withdraw your consent at any time, as easily as it was given. This will not affect the lawfulness of processing based on consent before its withdrawal.
                        • Object: Object to the processing of your data for profiling or automated decision-making.
                        • Data Portability: Request that we transfer your data to another organization or directly to you, where technically feasible.
                        To exercise these rights, please contact our DPO using the details in Section 2.
                    </span>
                    <span className='block'>
                        7. Data Sharing and Processors
                        We may share your personal data with trusted third-party service providers 
                        (e.g., cloud hosting, analytics, payment processors) who perform services on our behalf. 
                        We ensure these processors are bound by NDPA-compliant contracts that protect your data. 
                        We will not sell your personal data to third parties.
                    </span>
                    <span className='block'>
                        8. Data Transfers Outside Nigeria
                        If we transfer your personal data outside of Nigeria, 
                        we will ensure it is done only under conditions of adequate protection as prescribed by the NDPA. 
                        This may include transferring to countries approved by the Nigeria Data Protection Commission (NDPC), 
                        using binding contractual clauses, or obtaining your explicit consent for the transfer.
                    </span>
                    <span className='block'>
                        9. Data Security
                        We implement appropriate technical and organizational measures to protect your 
                        personal data against accidental or unlawful destruction, loss, alteration, 
                        unauthorized disclosure, or access. These measures include encryption, pseudonymization, 
                        secure backups, regular security audits, and strict access controls.
                    </span>
                    <span className='block'>
                        10. Data Breach Notification
                        In the event of a personal data breach that is likely to result in a risk to your rights 
                        and freedoms, we will notify the NDPC within 72 hours of becoming aware of it.
                        We will also notify affected users without undue delay, in accordance with NDPA requirements.
                    </span>
                    <span className='block'>
                        11. Cookies and Tracking Technologies
                        We use cookies and similar technologies to enhance your experience. 
                        Please refer to our Cookie Policy for detailed information on the 
                        types of cookies we use and how you can manage them.
                    </span>
                    <span className='block'>
                        12. Changes to This Policy
                        We may update this Privacy Policy from time to time. 
                        Any changes will be posted on this page with a revised "Last Updated" date. 
                        We encourage you to review this policy periodically.
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Privacy



