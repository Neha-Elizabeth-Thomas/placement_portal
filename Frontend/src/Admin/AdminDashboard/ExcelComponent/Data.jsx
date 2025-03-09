import React from 'react'
import { IndividualData } from './IndividualData'

export const Data = ({excelData}) => {
    return excelData.map((individualExcelData) => (
        <tr key={individualExcelData}>
            <IndividualData individualExcelData={individualExcelData}/>
        </tr>
    ))
}
