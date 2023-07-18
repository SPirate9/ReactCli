import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setError(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoadError = () => {
    setError(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowErrorMessage(!isConnected);
    }, 0);

    return () => clearTimeout(timeout);
  }, [isConnected, error]);

  const renderWebView = () => {
    const webViewStyle = isConnected ? {flex: 1} : {display: 'none'};

    if (showErrorMessage) {
      return (
        <View style={[styles.container, styles.noConnection]}>
          <Text style={styles.message}>Pas de connexion Internet</Text>
        </View>
      );
    }

    return (
      <WebView
        source={{
          uri: 'https://statyx-frontend-deploy.osc-fr1.scalingo.io/login',
        }}
        style={webViewStyle}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onShouldStartLoadWithRequest={() => true}
        onError={handleLoadError}
      />
    );
  };

  return <View style={styles.container}>{renderWebView()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noConnection: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'black',
    fontSize: 34,
  },
});

export default App;
