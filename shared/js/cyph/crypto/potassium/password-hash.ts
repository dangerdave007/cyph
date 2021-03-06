import {sodium} from 'libsodium';
import {IPasswordHash} from './ipassword-hash';
import * as NativeCrypto from './native-crypto';
import {potassiumUtil} from './potassium-util';
import {SecretBox} from './secret-box';


/** @inheritDoc */
export class PasswordHash implements IPasswordHash {
	/** @ignore */
	private readonly helpers: {
		hash: (
			plaintext: Uint8Array,
			salt: Uint8Array,
			outputBytes: number,
			opsLimit: number,
			memLimit: number
		) => Promise<Uint8Array>;
	}	= {
		hash: async (
			plaintext: Uint8Array,
			salt: Uint8Array,
			outputBytes: number,
			opsLimit: number,
			memLimit: number
		) : Promise<Uint8Array> =>
			this.isNative ?
				NativeCrypto.passwordHash.hash(
					plaintext,
					salt,
					outputBytes,
					opsLimit,
					memLimit
				) :
				sodium.crypto_pwhash_scryptsalsa208sha256(
					outputBytes,
					plaintext,
					salt,
					opsLimit,
					memLimit
				)
	};

	/** @inheritDoc */
	public readonly algorithm: Promise<string>				= Promise.resolve(
		this.isNative ?
			(
				NativeCrypto.passwordHash.algorithm.name + '/' +
				NativeCrypto.passwordHash.algorithm.hash.name
			) :
			'scrypt'
	);

	/** @inheritDoc */
	public readonly memLimitInteractive: Promise<number>	= Promise.resolve(
		this.isNative ?
			NativeCrypto.passwordHash.memLimitInteractive :
			sodium.crypto_pwhash_scryptsalsa208sha256_MEMLIMIT_INTERACTIVE
	);

	/** @inheritDoc */
	public readonly memLimitSensitive: Promise<number>		= Promise.resolve(
		this.isNative ?
			NativeCrypto.passwordHash.memLimitSensitive :
			134217728 /* 128 MB */
	);

	/** @inheritDoc */
	public readonly opsLimitInteractive: Promise<number>	= Promise.resolve(
		this.isNative ?
			NativeCrypto.passwordHash.opsLimitInteractive :
			sodium.crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_INTERACTIVE
	);

	/** @inheritDoc */
	public readonly opsLimitSensitive: Promise<number>		= Promise.resolve(
		this.isNative ?
			NativeCrypto.passwordHash.opsLimitSensitive :
			sodium.crypto_pwhash_scryptsalsa208sha256_OPSLIMIT_SENSITIVE
	);

	/** @inheritDoc */
	public readonly saltBytes: Promise<number>				= Promise.resolve(
		this.isNative ?
			NativeCrypto.passwordHash.saltBytes :
			sodium.crypto_pwhash_scryptsalsa208sha256_SALTBYTES
	);

	/** @inheritDoc */
	public async hash (
		plaintext: Uint8Array|string,
		salt?: Uint8Array,
		outputBytes?: number,
		opsLimit?: number,
		memLimit?: number,
		clearInput?: boolean
	) : Promise<{
		hash: Uint8Array;
		metadata: Uint8Array;
		metadataObject: {
			algorithm: string;
			memLimit: number;
			opsLimit: number;
			salt: Uint8Array;
		};
	}> {
		const algorithm	= await this.algorithm;

		if (salt === undefined) {
			salt		= potassiumUtil.randomBytes(await this.saltBytes);
		}
		if (outputBytes === undefined) {
			outputBytes	= await this.secretBox.keyBytes;
		}
		if (opsLimit === undefined) {
			opsLimit	= await this.opsLimitInteractive;
		}
		if (memLimit === undefined) {
			memLimit	= await this.memLimitInteractive;
		}

		const plaintextBinary	= potassiumUtil.fromString(plaintext);

		try {
			const metadata	= potassiumUtil.concatMemory(
				false,
				new Uint32Array([memLimit]),
				new Uint32Array([opsLimit]),
				new Uint32Array([salt.length]),
				salt,
				potassiumUtil.fromString(algorithm)
			);

			return {
				hash: await this.helpers.hash(
					plaintextBinary,
					salt,
					outputBytes,
					opsLimit,
					memLimit
				),
				metadata,
				metadataObject: {
					algorithm,
					memLimit,
					opsLimit,
					salt
				}
			};
		}
		finally {
			if (clearInput) {
				potassiumUtil.clearMemory(plaintextBinary);
				potassiumUtil.clearMemory(salt);
			}
			else if (typeof plaintext === 'string') {
				potassiumUtil.clearMemory(plaintextBinary);
			}
		}
	}

	/** @inheritDoc */
	public async parseMetadata (metadata: Uint8Array) : Promise<{
		algorithm: string;
		memLimit: number;
		opsLimit: number;
		salt: Uint8Array;
	}> {
		const metadataView	= new DataView(metadata.buffer, metadata.byteOffset);
		const saltBytes		= metadataView.getUint32(8, true);

		return {
			algorithm: potassiumUtil.toString(
				new Uint8Array(metadata.buffer, metadata.byteOffset + saltBytes + 12)
			),
			memLimit: metadataView.getUint32(0, true),
			opsLimit: metadataView.getUint32(4, true),
			salt: new Uint8Array(
				new Uint8Array(metadata.buffer, metadata.byteOffset + 12, saltBytes)
			)
		};
	}

	constructor (
		/** @ignore */
		private readonly isNative: boolean,

		/** @ignore */
		private readonly secretBox: SecretBox
	) {}
}
