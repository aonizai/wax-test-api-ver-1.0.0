import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

// Import EOSJS
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
    };
  }

  async executeRequest() {
    this.setState({
      result: 'Executing request. Please wait...',
    });
    try {
      const { accountName } = this.state;
      const signatureProvider = new JsSignatureProvider([
        '5KACw94NKuWTrRyQ6waHqeox9BtiWQwpZb9j9gd7jXt5gbR8eGi',
      ]);
      const rpc = new JsonRpc('https://testnet.waxsweden.org', { fetch });

      const api = new Api({
        rpc,
        signatureProvider,
        chainId:
          'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
      });

      const { last_irreversible_block_id } = await api.rpc.get_info();
      const { id, ref_block_prefix, block_num, timestamp } =
        await api.rpc.get_block(last_irreversible_block_id);

      const transaction = {
        actions: [
          {
            account: 'atomicassets',
            name: 'mintasset',
            data: {
              authorized_minter: 'tintestwax11',
              collection_name: 'brahmaphrom1',
              schema_name: 'brahmaweapon',
              template_id: '347892',
              new_asset_owner: 'tintestwax11',
              immutable_data: '',
              mutable_data: '',
              tokens_to_back: '',
            },
            authorization: [
              {
                actor: 'tintestwax11',
                permission: 'active',
              },
            ],
          },
        ],
      };

      const result = await api.transact(transaction, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      const resultAsString = JSON.stringify(result);
      this.setState({
        result: resultAsString,
      });
      console.log(resultAsString);
    } catch (error) {
      this.setState({
        result: `Transaction failed. ${error}`,
      });
    }
  }

  setAccountName(accountName) {
    this.setState({
      accountName: accountName,
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.executeRequest.bind(this)}>
          Click to mintasset
        </button>
        <div>
          <span>{this.state.result}</span>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
