interface SnarkJs {
  groth16: {
    fullProve<T> (input: T, wasmFile: string, zkeyFile: string): Promise<{ proof: string; publicSignals: string }>
  }
}

declare const snarkjs: SnarkJs
