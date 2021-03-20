import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "./ethereum/campaign";
import web3 from "./ethereum/web3";
import Layout from "./components/Layout";

class RequestNew extends Component {
    state = {
        value: "",
        description: "",
        recipient: "",
        loading: false,
        errorMessage: "",
        address: this.props.match.params.id
    };

    async componentDidMount() {
        const campaign = this.props.match.params.id;
        this.setState({ address: campaign });
    }

    onSubmit = async event => {
        event.preventDefault();

        const campaign = Campaign(this.state.address);
        const { description, value, recipient } = this.state;

        this.setState({ loading: true, errorMessage: "" });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({ from: accounts[0] });


            this.props.history.push(`/campaigns/${this.state.address}/requests`)


        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Link
                    to={`/campaigns/${this.state.address}/requests`}
                >
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event =>
                                this.setState({ description: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event =>
                                this.setState({ recipient: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;
