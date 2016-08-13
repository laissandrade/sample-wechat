package io.wedeploy.wechat.handler;

import com.wedeploy.api.sdk.Auth;
import com.wedeploy.api.sdk.Data;
import com.wedeploy.api.sdk.Response;
import io.wedeploy.wechat.domain.Favorite;

public class CreateFavoriteHandler {

	public void handle(Data data, Auth auth, Response response) {
		Favorite favorite = data.value(Favorite.class);
		favorite.setUserId(auth.id());
		data.commit(favorite);
	}

}
