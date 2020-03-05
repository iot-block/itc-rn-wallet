package com.rnwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.cmcewen.blurview.BlurViewPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import co.airbitz.fastcrypto.RNFastCryptoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import cn.jpush.reactnativejpush.JPushPackage;


public class MainApplication extends Application implements ReactApplication {

  private boolean SHUTDOWN_TOAST = true;
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new FingerprintAuthPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new BlurViewPackage(),
            new RNI18nPackage(),
            new RNFastCryptoPackage(),
            new SplashScreenReactPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new RandomBytesPackage(),
            new LinearGradientPackage(),
            new RNFSPackage(),
            new JPushPackage(SHUTDOWN_TOAST,SHUTDOWN_LOG)

      
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  
  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
