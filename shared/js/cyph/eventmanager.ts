module Cyph {
	export class EventManager {
		private static handlers: {[event: string] : Function[]}	= {};

		public static mainThreadEvents: string	= 'mainThreadEvents';
		public static untriggeredEvents: string	= 'untriggeredEvents';

		public static off (event: string, handler: Function) : void {
			EventManager.handlers[event]	=
				(EventManager.handlers[event] || []).filter(f => f !== handler)
			;
		}

		public static on (event: string, handler: Function) : void {
			EventManager.handlers[event]	= EventManager.handlers[event] || [];
			EventManager.handlers[event].push(handler);
		}

		public static trigger (event: string, data?: any, shouldTrigger: boolean = Env.isMainThread) : void {
			if (!shouldTrigger) {
				EventManager.trigger(EventManager.untriggeredEvents, {event, data}, true);
			}
			else {
				for (let handler of (EventManager.handlers[event] || [])) {
					try {
						handler(data);
					}
					catch (err) {
						setTimeout(() => { throw err }, 0);
					}
				}

				if (Env.isMainThread) {
					for (let thread of Thread.threads) {
						try {
							thread.postMessage({event, data, isThreadEvent: true});
						}
						catch (_) {}
					}
				}
			}
		}

		private static _	= (() => {
			if (Env.isMainThread) {
				EventManager.on(
					EventManager.mainThreadEvents,
					(o: { method: string; args: any[]; }) =>
						Thread.callMainThread(o.method, o.args)
				);
			}
			else {
				self.onmessage	= (e: MessageEvent) => {
					if (Util.getValue(e.data, 'isThreadEvent')) {
						EventManager.trigger(e.data.event, e.data.data, true);
					}
					else if (onthreadmessage) {
						onthreadmessage(e);
					}
				};

				EventManager.on(
					EventManager.untriggeredEvents,
					(o: { event: string; data: any; }) =>
						postMessage({event: o.event, data: o.data, isThreadEvent: true}, undefined)
				);
			}
		})();
	}
}