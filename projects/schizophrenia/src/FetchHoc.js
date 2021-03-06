/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import {
  currentGene,
  geneData,
  isFetching,
  actions as geneActions,
} from '@broad/redux-genes'

const PageContainer = ComposedComponent => class GenePage extends Component {
  static propTypes = {
    currentGene: PropTypes.string.isRequired,
    gene: PropTypes.object,
    isFetching: PropTypes.bool.isRequired,
    fetchGeneIfNeeded: PropTypes.func.isRequired,
  }

  static defaultProps = {
    gene: null,
  }

  componentDidMount() {
    const { currentGene, match, fetchGeneIfNeeded } = this.props
    fetchGeneIfNeeded(currentGene, match, history)
  }

  componentWillReceiveProps(nextProps) {
    const { fetchGeneIfNeeded, currentGene, history } = this.props
    if (currentGene !== nextProps.currentGene) {
      history.push(`/gene/${nextProps.currentGene}`)
      fetchGeneIfNeeded(nextProps.currentGene)
      this.props.resetFilter()
    }
  }

  render() {
    return <ComposedComponent {...this.props} />
  }
}

const mapStateToProps = state => ({
  isFetching: isFetching(state),
  gene: geneData(state),
  currentGene: currentGene(state),
})

const mapDispatchToProps = geneFetchFunction => (dispatch) => {
  return {
    fetchGeneIfNeeded: (currentGene, match) => dispatch(
      geneActions.fetchGeneIfNeeded(currentGene, match, geneFetchFunction)
    ),
  }
}

const GenePageHOC = (
  ComposedComponent,
  geneFetchFunction,
) => connect(
  mapStateToProps,
  mapDispatchToProps(geneFetchFunction)
)(PageContainer(ComposedComponent))

export default GenePageHOC
