import {Elements} from './elements';
import {IDialogManager} from './idialogmanager';
import {ILinkConnection} from './ilinkconnection';
import {IChat} from './chat/ichat';
import {Env} from '../env';
import {Strings} from '../strings';
import {Util} from '../util';
import * as Chat from './chat';


export class LinkConnection implements ILinkConnection {
	private isWaiting: boolean;
	private linkConstant: string;

	public isPassive: boolean;
	public link: string;
	public linkEncoded: string;

	public advancedFeatures: boolean;

	private selectLink () : void {
		Util.getValue(
			Elements.connectLinkInput()[0],
			'setSelectionRange',
			() => {}
		).call(
			Elements.connectLinkInput()[0],
			0,
			this.linkConstant.length
		);
	}

	private setLink () : void {
		if (this.link !== this.linkConstant) {
			this.link	= this.linkConstant;
		}
	}

	public copyLink () : void {
		clipboard.copy($(".connect-link-input input").val()).then(
			this.dialogManager.toast({content: Strings.linkCopied, delay: 2500})
		);
	}

	public beginWaiting (baseUrl: string, secret: string, isPassive: boolean) : void {
		this.isWaiting		= true;
		this.linkConstant	= baseUrl + (baseUrl.indexOf('#') > -1 ? '' : '#') + secret;
		this.linkEncoded	= encodeURIComponent(this.linkConstant);
		this.link			= this.linkConstant;
		this.isPassive		= isPassive;

		if (Env.isMobile) {
			this.setLink();

			/* Only allow right-clicking (for copying the link) */
			Elements.connectLinkLink().click(e => e.preventDefault());
		}
		else {
			const linkInterval	= setInterval(() => {
				//Elements.connectLinkInput().focus();
				if (this.isWaiting) {
					this.setLink();
					//Elements.connectLinkInput().focus();
					//this.selectLink();
				}
				else {
					clearInterval(linkInterval);
				}
			}, 250);
		}

		$('timer')[1]['start']();

		setTimeout(
			() => {
				if (this.isWaiting) {
					this.chat.abortSetup();
				}
			},
			this.countdown * 1000
		);
	}

	public stop () : void {
		this.isWaiting		= false;
		this.linkConstant	= '';
		this.link			= '';
		this.linkEncoded	= '';

		/* Stop mobile browsers from keeping this selected */
		Elements.connectLinkInput().blur();
	}

	/**
	 * @param countdown
	 * @param chat
	 * @param dialogManager
	 */
	public constructor (
		public countdown: number,
		private chat: IChat,
		private dialogManager: IDialogManager
	) {}
}
