import React from 'react'
import PropTypes from 'prop-types'

export default function Section({ children, ...rest }) {
  return <section {...rest} data-markdown data-separator="^\n\n\n" data-separator-vertical="^\n\n" data-separator-notes="^Note:">{children}</section>
}

Section.propTypes = {
  children: PropTypes.any
}

Section.defaultProps = {
  children: null
}
