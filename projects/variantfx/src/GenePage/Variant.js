import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { singleVariantData } from '@broad/redux-variants'

import {
  Table,
  VerticalTextLabels,
  TableVerticalLabel,
  VerticalLabelText,
  TableRows,
  TableRow,
  TableHeader,
  TableCell,
  TableTitleColumn,
} from '@broad/ui'

import { currentDisease } from '../redux'

import {
  processCardioVariant,
  POPULATIONS,
  COHORTS,
} from '../utilities'

const VariantContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  margin-top: 50px;
`

const VariantTitle = styled.h1`

`

const VariantDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 1050px;
`

const VariantAttributes = styled.div`
  display: flex;
  font-size: 16px;
  flex-direction: column;
  align-items: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
`

const VariantAttribute = styled.div`
  margin-bottom: 2px;
`

const TableRowTotal = TableRow.extend`
  border-top: 1px solid #000;
`

const Variant = ({ variant, currentDisease }) => {
  const cohorts = Object.keys(COHORTS).reduce((a, e) => ({[e]: {populations: POPULATIONS}, ...a}), {})
  const processedVariant = variant ? processCardioVariant(variant) : {diseases: {[currentDisease]: {cohorts}, HVO: {cohorts}}}
  const VARIANT_TABLE_COHORT_WIDTH = '120px'
  const VARIANT_TABLE_COLUMN_WIDTH = '60px'
  return (
    <VariantContainer>
      <VariantTitle>{processedVariant.variant_id}</VariantTitle>
      <VariantDetails>
        <VariantAttributes>
          <VariantAttribute>
            <strong>Filter:</strong> {processedVariant.filter}
          </VariantAttribute>
          <VariantAttribute>
            <strong>RSID:</strong> {processedVariant.rsid}
          </VariantAttribute>
          <VariantAttribute>
            <strong>HGVSc:</strong> {processedVariant.HGVSc}
          </VariantAttribute>
          <VariantAttribute>
            <strong>Consequence:</strong> {processedVariant.Consequence}
          </VariantAttribute>
        </VariantAttributes>
      </VariantDetails>
      <Table>
        <VerticalTextLabels>
          <TableVerticalLabel height={32}>
            <VerticalLabelText>
              {' '}
            </VerticalLabelText>
          </TableVerticalLabel>
          <TableVerticalLabel height={125}>
            <VerticalLabelText>
              HCM cases
            </VerticalLabelText>
          </TableVerticalLabel>
          <TableVerticalLabel height={85}>
            <VerticalLabelText>
              Controls
            </VerticalLabelText>
          </TableVerticalLabel>
        </VerticalTextLabels>
        <TableRows>
          <TableHeader>
            <TableTitleColumn width={VARIANT_TABLE_COHORT_WIDTH}>Cohort</TableTitleColumn>
            {Object.keys(POPULATIONS).map(pop => (
              <TableCell width={VARIANT_TABLE_COLUMN_WIDTH}>{POPULATIONS[pop]}</TableCell>
            ))}
          </TableHeader>
          {Object.keys(COHORTS).map(cohort => (
            <TableRow>
              <TableTitleColumn width={VARIANT_TABLE_COHORT_WIDTH}><strong>{COHORTS[cohort]}</strong></TableTitleColumn>
              {Object.keys(POPULATIONS).map((pop) => {
                const popCounts = processedVariant
                  .diseases[currentDisease]
                  .cohorts[cohort]
                  .populations[pop]
                if (Object.keys(popCounts).length !== 0) {
                  if (popCounts.pop_freq !== undefined) {
                    return (
                      <TableCell width={VARIANT_TABLE_COLUMN_WIDTH}>
                        {`${popCounts.pop_ac} (${popCounts.pop_freq.toPrecision(3)})`}
                      </TableCell>
                    )
                  }
                }
                return (
                  <TableCell width={VARIANT_TABLE_COLUMN_WIDTH}>
                    ...
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
          <TableRowTotal>
            <TableTitleColumn width={VARIANT_TABLE_COHORT_WIDTH}><strong>HVO (Healthy)</strong></TableTitleColumn>
            {Object.keys(POPULATIONS).map((pop) => {
              const popCounts = processedVariant
                .diseases.HVO
                .cohorts.RBH
                .populations[pop]
              if (Object.keys(popCounts).length !== 0) {
                if (popCounts.pop_freq !== undefined) {
                  return (
                    <TableCell width={VARIANT_TABLE_COLUMN_WIDTH}>
                      {`${popCounts.pop_ac} (${popCounts.pop_freq.toPrecision(3)})`}
                    </TableCell>
                  )
                }
              }
              return (
                <TableCell width={VARIANT_TABLE_COLUMN_WIDTH}>
                  ...
                </TableCell>
              )
            })}
          </TableRowTotal>
          {/* <TableRow>
            <TableTitleColumn><strong>Gnomad</strong></TableTitleColumn>
            {Object.keys(POPULATIONS).map((pop) => {
              const popCounts = processedVariant
                .diseases['HVO']
                .cohorts['RBH']
                .populations[pop]
              if (Object.keys(popCounts).length !== 0) {
                if (popCounts.pop_freq !== undefined) {
                  return (
                    <TableCell>
                      {`${popCounts.pop_ac} (${popCounts.pop_freq.toPrecision(3)})`}
                    </TableCell>
                  )
                }
              }
              return (
                <TableCell>
                  ...
                </TableCell>
              )
            })}
          </TableRow> */}
        </TableRows>
      </Table>
    </VariantContainer>
  )
}
Variant.propTypes = {
  variant: PropTypes.object,
  currentDisease: PropTypes.string.isRequired,
}

export default connect(
  state => ({
    variant: singleVariantData(state),
    currentDisease: currentDisease(state),
  })
)(Variant)
