class Covid extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: null,
        };
    }

    componentDidMount() {

        const requestOptions = {
            method: 'POST',
            Headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: '{"name": "morpheus","job": "leader"}'
        }

        fetch("https://reqres.in/api/users", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <h1>{items.id}</h1>

            );
        }

    }
}

export default Covid;