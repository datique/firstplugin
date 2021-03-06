import React from 'react';
import Tabs from "./Tabs";
import ASF from "./safetyAttribute.jsx"

class Covid extends React.Component {


    constructor({ props, storeHelper, selectorsHelper, diHelper, uiHelper, coreHelper, hostConnectionsHelper }) {
        super(props);
        this.state = {
            showLoading: false,
            error: null,
            isLoaded: false,
            isLoadedDetails: false,
            hasData: false,
            details: {},
            regions: [],
            data: [],
            regionId: 'test',
            firstLoad: true,
            hasPnr: false,
            pnrOpened: false,
            windowOpened: false,
            airlineSafetyData: [],
            airSegments: [],
        };


        var pnr = diHelper.get('PNR');
        console.log("PNR:" + pnr)


        const { POSComponent } = uiHelper;

        this._uiHelper = uiHelper;

        this._storeHelper = storeHelper;
        this._selectorsHelper = selectorsHelper;
        this._diHelper = diHelper;
        this._coreHelper = coreHelper;
        this._hostConnectionsHelper = hostConnectionsHelper;

        console.log("storeHelper:" + storeHelper);

        const hasPnrOpened = selectorsHelper.make('pnrOpened');
        console.log("PNR Opened:" + hasPnrOpened()); // 5

        const state = storeHelper.getState();
        const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;

        selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);

        const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');

        const currentTerminalId = getCurrentTerminalId(state);

        console.debug("currentTerminalId:" + currentTerminalId)
    }




    async componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: {
            }
        }

        this.setState({ showLoading: true });

        fetch("http://localhost:8081/allregions")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
                    this.setState({
                        isLoaded: true,
                        regions: result,
                        showLoading: false,

                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        showLoading: false,
                        error,


                    });
                }
            )


    }

    getAirlineSafetyData(carriers) {

        //this.setState({ isLoadedDetails: false, firstLoad: false });

        fetch("http://localhost:8081/asa/" + carriers)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        airlineSafetyData: result,
                        showLoading: false,

                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        showLoading: false,
                        error,
                    });
                }
            )

    }

    getRegion(regionId) {
        this.setState({ isLoadedDetails: false, firstLoad: false });

        fetch("http://localhost:8081/region/" + regionId)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        isLoadedDetails: true,
                        details: result,
                        showLoading: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoadedDetails: true,
                        error,
                        showLoading: false
                    });
                }
            )
    }

    getRegions(regionIds) {


        fetch("http://localhost:8081/regions/" + regionIds)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        hasData: true,
                        data: result,
                        isLoadedDetails: true
                    });
                },
                (error) => {
                    this.setState({
                        hasData: false,
                        error,
                        isLoadedDetails: true
                    });
                }
            )
    }

    onRegionChangeHandler = (event) => {
        var regionId = event.target.value;
        this.setState({ regionId: regionId, isLoadedDetails: false });

        console.log(regionId);

        this.getRegion(regionId);


    }

    onCloseWindowHandler = (event) => {
        this.setState({ windowOpened: false, isLoadedDetails: true });

    }

    onAddRemarks = async (event) => {

        const { storeHelper, selectorsHelper, coreHelper, hostConnectionsHelper } = this.props;
        const { airlineSafetyData, airSegments } = this.state;

        var remarks = [];

        for (var key in airSegments) {
            if (airSegments.hasOwnProperty(key)) {
                var segment = airSegments[key];

                var remark = [];
                for (var i = 0; i < airlineSafetyData.length; i++) {
                    var asf = airlineSafetyData[i];

                    if (asf.carrierCode == segment.carrierCode) {

                        if (asf.mandatoryMask)
                            remark.push("MASKS");

                        if (asf.tempChecks)
                            remark.push("TEMP CHECKS");

                        if (asf.healthCert)
                            remark.push("HEALTH CERT");

                        if (asf.extraCleaning)
                            remark.push("EXTRA CLEANING");

                        if (asf.updatedBoarding)
                            remark.push("UPDATED BOARDING");

                        if (asf.cabinBagsRestricted)
                            remark.push("REDUCED BAGS");

                    }

                }

                remarks.push(segment.segmentNumber + '*' + remark.join('/'));

            }
        }

        var ri = [];

        for (var i = 0; i < remarks.length; i++) {
            ri.push('RI.S' + remarks[i]);
        }



        const state = storeHelper.getState();
        const getDefaultHostConnectionId = selectorsHelper.make('getDefaultHostConnectionId');
        const defaultHostConnectionId = getDefaultHostConnectionId(state);
        var command = ri.join('+');

        console.log('remarks:' + command);

        const sendHostConnectionEntry = () =>
            coreHelper.invoke('sendHostConnectionEntry', defaultHostConnectionId, command);
        const result = await hostConnectionsHelper.withHostConnectionQueueing({
            hostConnectionId: defaultHostConnectionId,
        })(sendHostConnectionEntry);

        console.log('Host Response:' + result);
        //setOutput(result);

    }

    onClickHandler = (event) => {
        //alert('onClickHandler');

        const { storeHelper, selectorsHelper } = this.props;



        const state = storeHelper.getState();
        const getCurrentTerminalIdFactory = () => (state) => state.terminals.current.currentTerminalId;

        selectorsHelper.registerFactory('getCurrentTerminalId', getCurrentTerminalIdFactory);

        const getCurrentTerminalId = selectorsHelper.make('getCurrentTerminalId');

        const currentTerminalId = getCurrentTerminalId(state);

        console.debug("currentTerminalId:" + currentTerminalId)


        const getDefaultHostConnectionId = selectorsHelper.make('getDefaultHostConnectionId');
        const getTerminalHostConnectionId = selectorsHelper.make('getTerminalHostConnectionId');

        const hostConnectionId = getTerminalHostConnectionId(state, { currentTerminalId, }) || getDefaultHostConnectionId(state);



        const { activePNR } = state.plugins.pnrRetrieve || {};

        const currentPnr = activePNR[hostConnectionId];

        //this.setState({ isLoadedDetails: false });

        if (currentPnr) {
            const airSegments = currentPnr.airSegments;

            this.setState({ isLoadedDetails: false });

            this.getSegmentData(airSegments);
            this.setState({ hasPnr: true, windowOpened: true, airSegments: airSegments });
        }
        else {
            this.getAirlineSafetyData('');
            this.setState({ hasPnr: false, windowOpened: true });
        }


    }

    getSegmentData(airSegments) {
        var countryCodes = [];
        var carrierCodes = [];

        for (var key in airSegments) {
            if (airSegments.hasOwnProperty(key)) {
                var segment = airSegments[key];
                var code = segment.originZone.countryCode;

                if (!countryCodes.includes(code))
                    countryCodes.push(code);

                code = segment.destinationZone.countryCode;

                if (!countryCodes.includes(code))
                    countryCodes.push(code);

                if (!carrierCodes.includes(segment.carrierCode))
                    carrierCodes.push(segment.carrierCode);


                console.log(key + " -> " + segment);
            }
        }

        console.log(countryCodes.join());

        if (countryCodes && countryCodes.length > 0) {
            this.getRegions(countryCodes.join());
            this.getAirlineSafetyData(carrierCodes.join());

            this.setState({ hasPnr: true });
        }


    }





    render() {

        const { POSComponent } = this._uiHelper;
        const { windowOpened, pnrLoaded, hasPnr, firstLoad, showLoading, error, isLoaded, isLoadedDetails, details, regions, regionId, hasData, data, airlineSafetyData } = this.state;

        //const test = this._diHelper.get('PNR');

        //console.log("tst:" + test);
        //console.log('windowOpened:' + windowOpened)

        //const s = this._storeHelper.getState();

        //const pnrState = s.plugins.pnrState || {};



        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (showLoading) {
            return <div>Loading...</div>;
        } else {
            return (

                <div>

                    <div style={{ width: '965px' }}>
                        {!windowOpened &&
                            <input type='image' height='35px' onClick={this.onClickHandler} src='https://cdn.travelport.com/mp3de74868bfa647c9b5a04aeb642948fc/MP3de74868-bfa6-47c9-b5a0-4aeb642948fc_general_thumbnail_192988.jpg' />
                        }
                        {windowOpened &&
                            <div>
                                <svg height='10' width='10' fill="#000000" viewBox="0 0 12 12" role='button' style={{ float: 'right', cursor: 'pointer' }} onClick={this.onCloseWindowHandler}>
                                    <rect width="2" height="13.9975" rx="1" transform="matrix(0.707107 0.707107 -0.70711 0.707104 10.252 0.355682)"></rect>
                                    <path d="M1.05257 2.46076C0.661638 2.07065 0.661309 1.43781 1.05183 1.04729V1.04729C1.44236 0.656763 2.07585 0.656433 2.46678 1.04655L10.9612 9.5233C11.3521 9.91342 11.3525 10.5463 10.962 10.9368V10.9368C10.5714 11.3273 9.93793 11.3276 9.547 10.9375L1.05257 2.46076Z">
                                    </path>
                                </svg>
                            </div>
                        }
                    </div>



                    {
                        windowOpened && !hasPnr &&
                        <div>


                            <select onChange={this.onRegionChangeHandler} >
                                <option key='a-0' selected='selected' value={''}>Select a Region</option>
                                {regions.map(item => (
                                    <option key={item.regionid} value={item.regionid}>
                                        {item.region}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }


                    {
                        (!firstLoad && !isLoadedDetails) &&

                        <div style={{ display: isLoadedDetails ? "none" : "block" }}>
                            <h3>Loading details..</h3>
                        </div>
                    }

                    {
                        windowOpened && !hasPnr && isLoadedDetails &&




                        <div style={{ padding: '10px', border: '1px olive solid', borderRadius: '3px', display: 'inline-block', width: '965px', marginTop: '13px', background: 'white' }}>

                            <POSComponent componentName="Tabs">
                                <POSComponent componentName="Tabs.Tab" id={details.regionid} label={details.regionid} >
                                    <POSComponent componentName="Tabs.TabPanel">
                                        <h1>{details.regionid} ({details.trend.value}%)</h1>
                                        <div dangerouslySetInnerHTML={{ __html: details.trend.description }} />
                                        <br />

                                        <div style={{ height: '200px', overflowY: 'scroll', borderColor: 'olive', borderStyle: 'solid', padding: '10px' }}>
                                            {details.data.map(data => (
                                                <div>
                                                    <h1>{data.title.toUpperCase()}</h1>
                                                    <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                                    <br />

                                                </div>
                                            ))}
                                        </div>
                                    </POSComponent>
                                </POSComponent>

                                <POSComponent componentName="Tabs.Tab" id='asa' label='Airline Safety' >
                                    <POSComponent componentName="Tabs.TabPanel">
                                        <ASF data={airlineSafetyData} />
                                    </POSComponent>
                                </POSComponent>

                            </POSComponent>
                        </div>



                    }

                    {
                        hasData && windowOpened &&

                        <div style={{ display: !hasData ? "none" : "block" }}>



                            <div>

                                <div style={{ height: '300px', overflow: 'auto', padding: '10px', border: '1px olive solid', borderRadius: '3px', display: 'inline-block', width: '965px', marginTop: '13px', background: 'white' }}>

                                    {
                                        <POSComponent componentName="Tabs">
                                            {data.map((region) => (
                                                <POSComponent componentName="Tabs.Tab" id={region.regionid} label={region.regionid} >
                                                    <POSComponent componentName="Tabs.TabPanel">
                                                        <h1>{region.regionid} ({region.trend.value}%)</h1>
                                                        <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />

                                                        {region.data.map(d => (
                                                            <div>
                                                                <h2>{d.title}</h2>
                                                                <div dangerouslySetInnerHTML={{ __html: d.description }} />
                                                            </div>

                                                        ))}
                                                    </POSComponent>
                                                </POSComponent>
                                            ))}

                                            <POSComponent componentName="Tabs.Tab" id='asa' label='Airline Safety' >
                                                <POSComponent componentName="Tabs.TabPanel">
                                                    <ASF data={airlineSafetyData} />

                                                </POSComponent>
                                                <div style={{ float: 'right', marginTop: '3px', marginLeft: '8px' }}>
                                                    <input type='image' width='36px' height='36px' onClick={this.onAddRemarks} src='https://support.travelport.com/webhelp/Smartpoint1G1V/Content/Resources/Images/C19/AddRemarksIcon.png' />

                                                </div>

                                            </POSComponent>
                                        </POSComponent>



                                    }
                                </div>

                                {/*        
                                <Tabs>
                                    {data.map(region => (
                                        <div label={region.regionid}>
                                            <h1>{region.regionid} ({region.trend.value}%)</h1>
                                            <div dangerouslySetInnerHTML={{ __html: region.trend.description }} />

                                            {region.data.map(d => (
                                                <div>
                                                    <h2>{d.title}</h2>
                                                    <div dangerouslySetInnerHTML={{ __html: d.description }} />
                                                </div>

                                            ))}
                                        </div>
                                    ))}

                                </Tabs>
                                */
                                }

                            </div>


                        </div>





                    }
                </div >
            );
        }

    }
}

export default Covid;