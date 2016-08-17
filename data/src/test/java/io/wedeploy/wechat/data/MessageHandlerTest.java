package io.wedeploy.wechat.data;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.sdk.Response;
import com.wedeploy.engine.server.WeDeployTest;
import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Ciro Costa
 */
public class MessageHandlerTest extends WeDeployTest {

	@Test
	public void testMessageWithoutSensitiveContent_messageFiltered() {
		Map message = new HashMap<>();

		message.put("content", "pure string");

		Response post = WeDeploy.url("/messages") .post(message);

		Assert.assertTrue(post.succeeded());
	}

}
