import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Mousetrap from 'mousetrap'

import {
  actions as variantActions,
  selectedVariantDataset,
  variantDeNovoFilter,
  variantFilter,
} from '@broad/redux-variants'

import { currentGene, geneData, exonPadding } from '@broad/redux-genes'
import { Search } from '@broad/ui/src/search/simpleSearch'

import {
  MaterialButtonRaised,
  SettingsContainer,
  MenusContainer,
  SearchContainer,
  DataSelectionGroup,
} from '@broad/ui'

let findInput

Mousetrap.bind(['command+f', 'meta+s'], function(e) {  // eslint-disable-line
  e.preventDefault()
  findInput.focus()
})

const GeneSettings = ({
  searchVariants,
  setVariantFilter,
  toggleVariantDeNovoFilter,
  variantDeNovoFilter,
  variantFilter,
  // searchVariants
}) => {
  const VariantCategoryButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
  `

  const VariantCatagoryButton = MaterialButtonRaised.extend`
    background-color: ${({ isActive }) => (
    isActive ? 'rgba(10, 121, 191, 0.3)' : 'rgba(10, 121, 191, 0.1)'
  )};

    margin-right: 10px;
    &:hover {
      background-color: rgba(10, 121, 191, 0.3);
    }
    &:active {
      background-color: rgba(10, 121, 191, 0.5);
    }
  `

  const MaterialVariantCategoryButtonGroup = () => (
    <VariantCategoryButtonGroup>
      <VariantCatagoryButton
        onClick={() => setVariantFilter('all')}
        isActive={variantFilter === 'all'}
      >
        All<
        /VariantCatagoryButton>
      <VariantCatagoryButton
        onClick={() => setVariantFilter('missenseOrLoF')}
        isActive={variantFilter === 'missenseOrLoF'}
      >
        Missense + LoF
      </VariantCatagoryButton>
      <VariantCatagoryButton
        onClick={() => setVariantFilter('lof')}
        isActive={variantFilter === 'lof'}
      >
        LoF
      </VariantCatagoryButton>
      <VariantCatagoryButton
        onClick={toggleVariantDeNovoFilter}
        isActive={variantDeNovoFilter}
      >
        De novo
      </VariantCatagoryButton>
    </VariantCategoryButtonGroup>
  )

  return (
    <SettingsContainer>
      <MenusContainer>
        <DataSelectionGroup>
          <MaterialVariantCategoryButtonGroup />
        </DataSelectionGroup>
        <DataSelectionGroup>
          <SearchContainer>
            <Search
              listName={'search table'}
              options={['Variant ID', 'RSID', 'HGVSp']}
              placeholder={'Search variant table'}
              reference={findInput}
              onChange={searchVariants}
            />
          </SearchContainer>
        </DataSelectionGroup>
      </MenusContainer>
    </SettingsContainer>
  )
}

GeneSettings.propTypes = {
  searchVariants: PropTypes.func.isRequired,
  setVariantFilter: PropTypes.func.isRequired,
  toggleVariantDeNovoFilter: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    currentGene: currentGene(state),
    exonPadding: exonPadding(state),
    selectedVariantDataset: selectedVariantDataset(state),
    geneData: geneData(state),
    variantDeNovoFilter: variantDeNovoFilter(state),
    variantFilter: variantFilter(state),
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setVariantFilter: filter => dispatch(variantActions.setVariantFilter(filter)),
    searchVariants: searchText => dispatch(variantActions.searchVariants(searchText)),
    toggleVariantDeNovoFilter: () => dispatch(variantActions.toggleVariantDeNovoFilter()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneSettings)
