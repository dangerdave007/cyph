/**
 * Represents an asymmetric key pair.
 */
export interface IKeyPair {
	/** Optional description of key type. */
	keyType?: string;

	/** Private key. */
	privateKey: Uint8Array;

	/** Public key. */
	publicKey: Uint8Array;
}
