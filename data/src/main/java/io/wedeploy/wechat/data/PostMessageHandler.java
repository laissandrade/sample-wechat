package io.wedeploy.wechat.data;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.sdk.Data;
import com.wedeploy.api.sdk.Response;

import java.util.Map;

/**
 * @author Ciro Costa
 */
public class PostMessageHandler {

	public void enhanceMessage(Data data) {
		Map message = data.value();

		Response sentimenterResponse = client
			.form("text", message.get("content"))
			.post();

		if (!sentimenterResponse.succeeded()) {
			System.err.println("Couldn't get response from Sentimenter");
			System.err.println(sentimenterResponse.statusMessage());
			System.err.println(sentimenterResponse.body());

			data.commit(message);
			return;
		}

		Map sentimentObject = sentimenterResponse.bodyValue();

		Integer sentimentScore = (Integer)sentimentObject.get("score");

		if (sentimentScore < 0) {
			message.put("sentiment", "negative");
		} else if (sentimentScore == 0) {
			message.put("sentiment", "neutral");
		} else {
			message.put("sentiment", "positive");
		}

		data.commit(message);
	}

	private WeDeploy client = WeDeploy.url("sentimenter").path("analyzer");

}
