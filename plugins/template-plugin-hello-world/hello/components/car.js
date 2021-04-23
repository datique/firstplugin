class Car extends React.Component {
    honk() {
        alert("Honk Honk!");
    }
    constructor(props) {
        super(props);
        this.state = {
            brand: "Ford",
            model: "Mustang",
            colour: "Red",
            year: 1964
        };

    }
    render() {
        return (
            <div>
                <h2>I am a Car. My brand is {this.props.brand}!</h2>

                <div>
                    <h1>I also own a {this.state.brand}</h1>
                    <p>
                        It is a {this.state.colour}
                        {this.state.model}
                        from {this.state.year}

                        <button onClick={this.honk}>Honk!</button>
                    </p>
                </div>
            </div>
        )
    }
}

export default Car;