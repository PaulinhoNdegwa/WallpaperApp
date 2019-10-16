import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';

const {height, width} = Dimensions.get('window');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      images: [],
      scale: new Animated.Value(1),
      isImageFocused: false,
    };
    this.scale = {
      tranform: [{scale: this.state.scale}],
    };
  }

  loadWallpapers = () => {
    axios
      .get(
        'https://api.unsplash.com/photos/random?count=5&client_id=myUnsplashClientId',
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          images: response.data,
          isLoading: false,
        });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        console.log('Fetch completed');
      });
  };

  showControls = item => {
    this.setState(
      state => ({
        isImageFocused: !state.isImageFocused,
      }),
      () => {
        if (this.state.isImageFocused) {
          Animated.spring(this.state.scale, {
            toValue: 0.9,
          }).start();
        } else {
          Animated.spring(this.state.scale, {
            toValue: 1,
          }).start();
        }
      },
    );
  };

  renderImages = ({item: image}) => {
    console.log(this.scale);
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1}}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="grey" />
        </View>
        <TouchableWithoutFeedback onPress={this.showControls(image)}>
          <Animated.View style={[{height, width}]}>
            <Image source={{uri: image.urls.regular}} style={styles.image} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  componentDidMount() {
    this.loadWallpapers();
  }

  render() {
    return this.state.isLoading ? (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <View style={styles.container}>
        <FlatList
          horizontal
          pagingEnabled
          data={this.state.images}
          renderItem={this.renderImages}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    // marginTop: 20,
  },
});
