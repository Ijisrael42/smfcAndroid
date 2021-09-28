package com.smfc.tutors;
import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import android.os.Bundle;
import com.getcapacitor.Plugin;
import java.util.ArrayList;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.capacitorjs.plugins.app.AppPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            add(GoogleAuth.class);
            add(PushNotificationsPlugin.class);
            add(AppPlugin.class);
        }});
    }
}