import React from 'react'
import { EditDonatePackage } from './EditDonatePackage'

export default function page({ params }) {
    return (
        <div className="w-full h-full bg-slate-100 p-6">
            <EditDonatePackage id={params.id} />
        </div>
    )
}