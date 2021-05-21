class ASF extends React.Component {

    constructor(props, data) {
        console.log('Data:' + data);
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: null
        };

    }

    componentDidMount() {


    }

    render() {



        return
        (



            <div style={{ height: '400px', overflowY: 'scroll', padding: '10px' }}>
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
                                {d.carrierName} ({d.carrierCode})
                                                             </td>
                            <td style={{ border: '1px solid #0b1119', padding: '0.769em 1em' }}>
                                <img height='55px' style={{ display: d.mandatoryMask ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-face-masks.svg' />
                                <img height='55px' style={{ display: d.tempChecks ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-temperature-checks.svg' />
                                <img height='55px' style={{ display: d.healthCert ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-health-cert.svg' />
                                <img height='55px' style={{ display: d.hepaFilters ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-hepa-filters.svg' />
                                <img height='55px' style={{ display: d.extraCleaning ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-extra-cleaning.svg' />
                                <img height='55px' style={{ display: d.reducedMeals ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-food-beverage.svg' />
                                <img height='55px' style={{ display: d.amenityKit ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-amenity-kit.svg' />
                                <img height='55px' style={{ display: d.updatedBoarding ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-updated-boarding.svg' />
                                <img height='55px' style={{ display: d.cabinBagsRestricted ? '' : 'none' }} src='https://343aebb6912120aa54f4.b-cdn.net/wp-content/uploads/2021/02/covid-cabin-bags-restricted.svg' />

                            </td>
                        </tr>

                    ))}
                </table>
            </div>

        );
    }
}

//export default ASF;


