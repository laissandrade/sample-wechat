package io.wedeploy.wechat.bot;

import com.wedeploy.api.sdk.Context;
import com.wedeploy.api.sdk.Lifecycle;

/**
 * @author cirocosta
 */
public class ChatListenerRuntime implements Lifecycle {
	@Override
	public void start(Context context) {
		System.out.println("Hey, i just started!");
	}

	@Override
	public void stop(Context context) {
		System.out.println("Stopping");
	}
}
