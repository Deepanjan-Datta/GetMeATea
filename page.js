import React from 'react'
import PaymentPage from '@/Components/Paymentpage'
const Username = ({ params }) => {
    return (
        <>
            <PaymentPage username={params.username}/>
        </>
    )
}

export default Username
