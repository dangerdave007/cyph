import {IKeyPair} from '../ikey-pair';


/**
 * Represents the local user in a Castle session.
 */
export interface ILocalUser {
	/** Potassium.Box key pair. */
	getKeyPair () : Promise<IKeyPair>;

	/** Encrypted secret from remote user. */
	getRemoteSecret () : Promise<Uint8Array>;
}
