import { Account, Chain, Tx, types } from 'https://deno.land/x/clarinet@v1.0.3/index.ts';
export class Accounts extends Map<string, Account> {}

export class Context {
  readonly chain: Chain;
  readonly accounts: Accounts;
  readonly contracts: Map<string, any>;

  constructor(_preSetupTx?: Array<Tx>) {
    const result = JSON.parse(
      (Deno as any).core.opSync('api/v1/new_session', {
        name: 'test',
        loadDeployment: true,
        deploymentPath: null,
      })
    );
    this.chain = new Chain(result['session_id']);
    this.accounts = new Map();
    for (const account of result['accounts']) {
      this.accounts.set(account.name, account);
    }

    this.contracts = new Map();
    for (const contract of result['contracts']) {
      this.contracts.set(contract.contract_id, contract);
    }
  }

  terminate() {
    JSON.parse(
      (Deno as any).core.opSync('api/v1/terminate_session', {
        sessionId: this.chain.sessionId,
      })
    );
  }
}
