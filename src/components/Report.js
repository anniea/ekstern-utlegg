import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {personaliaFormPropTypes} from './Personalia'
import {rowsFormPropTypes, rowFieldPropTypes} from './Rows'
import DocumentTitle from 'react-document-title'
import moment from 'moment'

class ReportRow extends React.Component {
    render() {
        const row = this.props.row

        return <tr>
            <td>{row.date}</td>
            <td>
                {row.supplier}
                &nbsp;-&nbsp;
                {row.description}
            </td>
            <td>{row.cost.toFixed(2)} NOK</td>
            <td className="locked">{this.props.dept}</td>
        </tr>
    }
}

ReportRow.propTypes = {
    row: rowFieldPropTypes,
    dept: PropTypes.string.isRequired
}

class DisplayReport extends React.Component {
    displayValue(value, field) {
        if (value.value) {
            if (!value.valid) {
                return <span className="incomplete">
                    Ugyldig {field} - {value.value}
                    <Link className="btn btn-xs btn-warning pull-right noprint" to={`${BASE_PATH}start`}>Fix</Link>
                </span>
            }

            return value.value
        } else {
            return <span className="incomplete">
                Manglende {field}
                <Link className="btn btn-xs btn-warning pull-right noprint" to={`${BASE_PATH}start`}>Fix</Link>
            </span>
        }
    }

    getValidRows(rows) {
        return rows.filter((row) => row.valid)
    }

    displayRows(dept) {
        const rows = this.getValidRows(this.props.rows.rows)

        if (!rows.length > 0) {
            return <tr>
                <td colSpan="4">
                    <span className="incomplete">
                        Manglende utlegg
                        <Link className="btn btn-xs btn-warning pull-right noprint" to={`${BASE_PATH}rows`}>Fix</Link>
                    </span>
                </td>
            </tr>
        } else {
            return rows.map(row =>
                <ReportRow key={`report_row_${row.id}`} row={row} dept={dept}/>
            )
        }
    }

    render() {
        const personalia = this.props.personalia

        let name = ''

        if (personalia.name && personalia.name.valid) {
            name = ` - ${personalia.name.value} `
        }

        const title = `${moment().format('YYYY-MM-DD')}${name} - extern utlegg`

        let dept = ''

        if (this.props.personalia.dept) {
            dept = this.props.personalia.dept.value
        }

        return <DocumentTitle title={title}>
            <div className="container">
                <div className="row noprint">
                    <div className="jumbotron">
                        <h2>
                            Når man skriver ut denne siden så husk å krysse av i print dialog for bakgrunnsfarger ellers
                            vil ikke fargene på tabellen dukke opp.
                        </h2>
                        <p className="text-primary">
                            <strong>
                                Husk at du må sende resultat som PDF til din kontakt hos Itera via e-post.
                            </strong>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <img className="logo" src="img/Itera_logo_red_large.png"/>

                    <h1>UTLEGG FOR EKSTERNE</h1>

                    <h2>Refusjon av flere utlegg</h2>

                    <table className="table table-bordered table-condensed table-hover output">
                        <thead>
                        <tr>
                            <th>Navn:</th>
                            <td colSpan="3">{this.displayValue(personalia.name, 'navn')}</td>
                        </tr>
                        <tr>
                            <th>Adresse:</th>
                            <td colSpan="3">
                                {this.displayValue(personalia.address, 'adresse')},
                                &nbsp;
                                {this.displayValue(personalia.postcode, 'postnummer')}
                                &nbsp;
                                {this.displayValue(personalia.town, 'poststed')}
                            </td>
                        </tr>
                        <tr>
                            <th>Tlf/Mob:</th>
                            <td colSpan="3">{this.displayValue(personalia.telephone, 'tlf/mob')}</td>
                        </tr>
                        <tr>
                            <th>E-post:</th>
                            <td colSpan="3">{this.displayValue(personalia.email, 'e-post')}</td>
                        </tr>
                        <tr>
                            <th>Kontonummer:</th>
                            <td colSpan="3">{this.displayValue(personalia.account, 'kontonummer')}</td>
                        </tr>
                        <tr>
                            <th>Formål for utlegg:</th>
                            <td colSpan="3">{this.displayValue(personalia.event, 'formål/arrangement')}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">&nbsp;</td>
                        </tr>
                        <tr>
                            <th>Dato</th>
                            <th>Anskaffet - brukt til hva?</th>
                            <th>Beløp inkl. mva</th>
                            <th>Avdeling</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.displayRows(dept)}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className="locked" colSpan="2">Sum utlegg:</td>
                            <td className="locked">{this.props.rows.total.toFixed(2)} NOK</td>
                            <td className="locked"/>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </DocumentTitle>
    }
}

DisplayReport.propTypes = {
    personalia: personaliaFormPropTypes,
    rows: rowsFormPropTypes
}

const mapStateToProps = (state) => ({
    personalia: state.personalia,
    rows: state.rows
})

export const Report = connect(mapStateToProps)(DisplayReport)
