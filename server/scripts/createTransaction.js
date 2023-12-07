const GAS_LIMIT = 21000;
const MAX_FEE_PER_GAS = 300;
const MAX_PRIORITY_FEE_PER_GAS = 10;

export function createTransaction(sender, recipient, amount, nonce) {
    const rawTransaction = {
        from: sender, 
        to: recipient, 
        gasLimit: GAS_LIMIT, 
        maxFeePerGas: MAX_FEE_PER_GAS, 
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        nonce: nonce,
        value: amount,
    };

    return rawTransaction;
}