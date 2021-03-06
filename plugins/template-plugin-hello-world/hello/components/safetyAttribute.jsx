class ASF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }
    render() {
        return (


            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '10px' }}>
                <table style={{ width: '100%', backgroundColor: '#f7e4cb', borderCollapse: 'collapse' }}>

                    <tr>
                        <th style={{ border: '1px solid #0b1119', padding: '0.769em 1em' }}>
                            Airline
                                                        </th>
                        <th style={{ border: '1px solid #0b1119', padding: '0.769em 1em' }}>Attributes</th>
                    </tr>
                    {this.props.data.map(d => (
                        <tr>
                            <td style={{ border: '1px solid #0b1119', width: '25%', padding: '0.769em 1em' }}>
                                <a href={d.moreInfoLink} target='_blank' style={{ color: 'black', textDecoration: 'underline', fontWeight: 'bold' }}>
                                    {d.carrierName} ({d.carrierCode})
                                </a>
                            </td>
                            <td style={{ border: '1px solid #0b1119', padding: '0.769em 1em' }}>
                                <img height='40px' style={{ margin: '3px', display: d.mandatoryMask ? '' : 'none' }} title='Mask or face covering mandatory for passengers and crew' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-face-masks.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.tempChecks ? '' : 'none' }} title='The airline or airport may carry out temperature checks' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-temperature-checks.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.healthCert ? '' : 'none' }} title='The airline requires a health certificate or self declaration to allow travel' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-health-cert.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.hepaFilters ? '' : 'none' }} title='HEPA air filters or external air used in flight' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-hepa-filters.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.extraCleaning ? '' : 'none' }} title='Increased aircraft cleaning or disinfection' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-extra-cleaning.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.reducedMeals ? '' : 'none' }} title='Reduced onboard food and beverage services' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-food-beverage.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.amenityKit ? '' : 'none' }} title='Amenity kit for use onboard' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-amenity-kit.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.updatedBoarding ? '' : 'none' }} title='Updated boarding process' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-updated-boarding.svg' />
                                <img height='40px' style={{ margin: '3px', display: d.cabinBagsRestricted ? '' : 'none' }} title='Restricted cabin baggage' src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-cabin-bags-restricted.svg' />

                            </td>
                        </tr>

                    ))}
                </table>
            </div >

        )
    }
}

export default ASF;