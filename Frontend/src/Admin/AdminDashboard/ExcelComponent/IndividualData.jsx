import React from 'react'

export const IndividualData = ({individualExcelData}) => {
    return(
        <>
            <th>{individualExcelData.company_name}</th>
            <th>{individualExcelData.job_role}</th>
            <th>{individualExcelData.year}</th>
            <th>{individualExcelData.ktu_id}</th>
            <th>{individualExcelData.round_number}</th>
            <th>{individualExcelData.round_status}</th>
        </>
    )
}
