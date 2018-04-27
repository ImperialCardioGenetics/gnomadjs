/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-case-declarations */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import R from 'ramda'//

import { RegionViewer, markerExacClassic } from '@broad/region'

import VariantTrack from '@broad/track-variant'
import { NavigatorTrackConnected } from '@broad/track-navigator'
import { TranscriptTrackConnected } from '@broad/track-transcript'

import { screenSize, Loading } from '@broad/ui'

import {
  geneData,
  exonPadding,
  transcriptFanOut,
  actions as geneActions
} from '@broad/redux-genes'

import {
  finalFilteredVariants,
} from '@broad/redux-variants'

import {
  currentGeneDiseaseData,
} from '../redux'

const paddingColor = '#5A5E5C'
const masterExonThickness = '20px'
const masterPaddingThickness = '3px'

const attributeConfig = {
  CDS: {
    color: '#424242',
    thickness: masterExonThickness,
  },
  start_pad: {
    color: paddingColor,
    thickness: masterPaddingThickness,
  },
  end_pad: {
    color: paddingColor,
    thickness: masterPaddingThickness,
  },
  intron: {
    color: paddingColor,
    thickness: masterPaddingThickness,
  },
  default: {
    color: 'grey',
    thickness: masterPaddingThickness,
  },
}

class GeneRegion extends PureComponent {
  render() {
    const {
      gene,
      visibleVariants,
      exonPadding,
      screenSize,
      transcriptFanOut,
      toggleTranscriptFanOut,
      currentGeneDiseaseData,
    } = this.props

    const smallScreen = screenSize.width < 900
    const regionViewerWidth = smallScreen ? screenSize.width - 150 : screenSize.width - 330

    const geneJS = gene.toJS()
    const canonicalExons = geneJS.transcript.exons
    const { transcript } = geneJS//
    const variantsReversed = visibleVariants.reverse()

    console.log('variantsReversed', variantsReversed.toJS())
    if (variantsReversed.isEmpty()) {
      return <Loading />
    }

    const disease = currentGeneDiseaseData.get('Disease')
    const cases = variantsReversed
      .filter(v => v[`${disease}_AC`] > 0)
      .map(v => v.set('allele_freq', v[`${disease}_AC`] / v[`${disease}_AN`]))

    const controls = variantsReversed
      .filter(v => v.CTL_AC > 0)
      .map(v => v.set('allele_freq', v.CTL_AC / v.CTL_AN))

    // const casesCount = cases.reduce((acc, v) => acc + v.ac_case, 0)
    // const controlsCount = controls.reduce((acc, v) => acc + v.ac_ctrl, 0)

    return (
      <div>
        <RegionViewer
          width={regionViewerWidth}
          padding={exonPadding}
          regions={canonicalExons}
          regionAttributes={attributeConfig}
          leftPanelWidth={100}
        >
          <TranscriptTrackConnected
            height={12}
            showRightPanel={!smallScreen}
            transcriptFanOut={transcriptFanOut}
            transcriptButtonOnClick={toggleTranscriptFanOut}
          />
          <VariantTrack
            key={'cases'}
            height={60}
            markerConfig={{ ...markerExacClassic }}
            variants={cases}
            title={`Cases|(${cases.size})`}
          />
          <VariantTrack
            key={'controls'}
            height={60}
            markerConfig={{ ...markerExacClassic }}
            variants={controls}
            title={`Controls|(${controls.size})`}
          />
          <NavigatorTrackConnected title={'Viewing in table'} />
        </RegionViewer>
      </div>
    )
  }
}
GeneRegion.propTypes = {
  gene: PropTypes.object.isRequired,
  visibleVariants: PropTypes.any.isRequired,
  exonPadding: PropTypes.number.isRequired,
  screenSize: PropTypes.object.isRequired,
  transcriptFanOut: PropTypes.bool.isRequired,
  toggleTranscriptFanOut: PropTypes.func.isRequired,
  currentGeneDiseaseData: PropTypes.any.isRequired,
}
export default connect(
  state => ({
    gene: geneData(state),
    exonPadding: exonPadding(state),
    visibleVariants: finalFilteredVariants(state),
    screenSize: screenSize(state),
    transcriptFanOut: transcriptFanOut(state),
    currentGeneDiseaseData: currentGeneDiseaseData(state),
  }),
  dispatch => ({
    toggleTranscriptFanOut: () => dispatch(geneActions.toggleTranscriptFanOut()),

  })
)(GeneRegion)
