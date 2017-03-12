/* @flow */
/* eslint-disable comma-dangle */
/* eslint-disable no-undefined */
/* eslint-disable operator-linebreak */

import React from 'react';

import HeaderBackButton from 'react-navigation/lib-rn/views/HeaderBackButton';

import { TouchableOpacity, Platform, View, TouchableNativeFeedback, I18nManager } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import variables from 'native-base/dist/src/theme/variables/platform';
import computeProps from 'native-base/dist/src/Utils/computeProps';
import mapPropsToStyleNames from 'native-base/dist/src/Utils/mapPropsToStyleNames';

import {
  Icon,
  Button,
  Text,
} from 'native-base';

class CustomBackButton extends HeaderBackButton {
  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  getInitialStyle() {
    return {
      borderedBtn: {
        borderWidth: (this.props.bordered) ? 1 : undefined,
        borderRadius: (this.props.rounded && this.props.bordered) ? variables.borderRadiusLarge : 2,
      },
    };
  }

  prepareRootProps() {
    const defaultProps = {
      style: this.getInitialStyle().borderedBtn,
    };

    return computeProps(this.props, defaultProps);
  }

  render() {
    const { onPress, width, title, truncatedTitle } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    if (Platform.OS === 'ios' || variables.androidRipple === false || Platform['Version'] <= 21) {
      return (
        <TouchableOpacity
          {...this.prepareRootProps()}
          ref={c => this._root = c}
          activeOpacity={(this.props.activeOpacity) ? this.props.activeOpacity : 0.5}
        >
          <View style={styles.textButtonContainer}>
            <Icon name='arrow-back' />
            <View style={styles.title}>
              <Text
                onLayout={this._onTextLayout}
                numberOfLines={1}
                style={styles.title}
              >
                {renderTruncated ? truncatedTitle : title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableNativeFeedback
          ref={c => this._root = c}
          onPress={onPress}
          background={(this.props.androidRippleColor)
            ? TouchableNativeFeedback.Ripple(this.props.androidRippleColor, true)
            : TouchableNativeFeedback.Ripple(variables.androidRippleColor, true)
          }
          {...this.prepareRootProps()}
        >
          <View {...this.prepareRootProps()} style={styles.container}>
            <Icon name='arrow-back' style={styles.icon} />
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

const styles = {
  textButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 20,
      width: 12,
      marginLeft: 10,
      marginRight: 22,
      marginVertical: 12,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }
    : {
      height: 24,
      width: 24,
      margin: 12,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 5,
    }
    : {},
};

const StyledButton = connectStyle('NativeBase.Button', {}, mapPropsToStyleNames)(CustomBackButton);

export default StyledButton;
