import React from 'react'
import { EditQuestion } from './EditQuestion'

export default function page({ params }) {
    return (
        <div className='p-6'><EditQuestion questionId={params.id} /></div>
    )
}

