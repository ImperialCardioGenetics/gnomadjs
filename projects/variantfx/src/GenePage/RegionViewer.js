/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-case-declarations */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { RegionViewer } from '@broad/region-viewer'

import { NavigatorTrackConnected } from '@broad/track-navigator'
import { TranscriptTrackConnected } from '@broad/track-transcript'
import { VariantPositionTrack } from '@broad/track-variant'

import { screenSize } from '@broad/ui'

import {
  geneData,
  exonPadding,
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

const GeneRegion = ({
  gene,
  visibleVariants,
  exonPadding,
  screenSize,
  currentGeneDiseaseData,
}) => {
  const smallScreen = screenSize.width < 900
  const regionViewerWidth = smallScreen ? screenSize.width - 150 : screenSize.width - 330

  const geneJS = gene.toJS()
  const canonicalExons = geneJS.transcript.exons
  const variantsReversed = visibleVariants.reverse()

  const disease = currentGeneDiseaseData.get('Disease')
  const cases = variantsReversed
    .filter(v => v[`${disease}_AC`] > 0)
    .map(v => v.set('allele_freq', v[`${disease}_AC`] / v[`${disease}_AN`]))

  const controls = variantsReversed
    .filter(v => v.CTL_AC > 0)
    .map(v => v.set('allele_freq', v.CTL_AC / v.CTL_AN))

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
        />
        <VariantPositionTrack
          variantColor={'#757575'}
          variants={cases.toJS()}
          title={`Cases (${cases.size})`}
        />
        <VariantPositionTrack
          variantColor={'#757575'}
          variants={controls.toJS()}
          title={`Controls (${controls.size})`}
        />
        <NavigatorTrackConnected noVariants />
      </RegionViewer>
    </div>
  )
}
GeneRegion.propTypes = {
  gene: PropTypes.object.isRequired,
  visibleVariants: PropTypes.any.isRequired,
  exonPadding: PropTypes.number.isRequired,
  screenSize: PropTypes.object.isRequired,
  currentGeneDiseaseData: PropTypes.any.isRequired,
}
export default connect(
  state => ({
    gene: geneData(state),
    exonPadding: exonPadding(state),
    visibleVariants: finalFilteredVariants(state),
    screenSize: screenSize(state),
    currentGeneDiseaseData: currentGeneDiseaseData(state),
  })
)(GeneRegion)
